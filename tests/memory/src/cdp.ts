import type { CDPSession, Page } from "@playwright/test";

/**
 * Chrome DevTools Protocol helpers for memory measurement.
 *
 * Why CDP and not `window.gc()` / `performance.memory`:
 * - `HeapProfiler.collectGarbage` gives deterministic, synchronous GC without
 *   launching Chromium with `--js-flags="--expose-gc"`.
 * - `Runtime.queryObjects` enumerates all live objects of a given prototype
 *   *after* a GC, so it counts only *retained* detached DOM nodes - precisely
 *   the signal for the cellRegistry / rowCellsMap leaks.
 * - `HeapProfiler.takeHeapSnapshot` is the gold-standard backstop and is used to
 *   produce a downloadable artifact + detached-node count on failure.
 */

export interface MemorySample {
  /** Used JS heap size in bytes (Runtime.getHeapUsage). */
  usedHeapBytes: number;
  /** Count of retained, detached HTMLElements (Runtime.queryObjects + filter). */
  detachedElements: number;
}

export async function openCdp(page: Page): Promise<CDPSession> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("HeapProfiler.enable");
  await cdp.send("Runtime.enable");
  return cdp;
}

/** Run a deterministic garbage collection. Repeated to flush finalization queues. */
export async function forceGc(cdp: CDPSession, passes = 3): Promise<void> {
  for (let i = 0; i < passes; i++) {
    await cdp.send("HeapProfiler.collectGarbage");
  }
}

export async function usedHeapBytes(cdp: CDPSession): Promise<number> {
  const usage = (await cdp.send("Runtime.getHeapUsage")) as { usedSize: number };
  return usage.usedSize;
}

/**
 * Count detached HTMLElements that are still reachable from JS. `queryObjects`
 * performs a GC first, so anything returned here is genuinely retained (e.g. by
 * a Map entry or closure) rather than merely awaiting collection.
 */
export async function countDetachedElements(cdp: CDPSession): Promise<number> {
  const proto = (await cdp.send("Runtime.evaluate", {
    expression: "HTMLElement.prototype",
  })) as { result: { objectId?: string } };
  const prototypeObjectId = proto.result.objectId;
  if (!prototypeObjectId) return 0;

  const query = (await cdp.send("Runtime.queryObjects", { prototypeObjectId })) as {
    objects: { objectId?: string };
  };
  const arrayObjectId = query.objects.objectId;
  if (!arrayObjectId) return 0;

  try {
    const counted = (await cdp.send("Runtime.callFunctionOn", {
      objectId: arrayObjectId,
      returnByValue: true,
      functionDeclaration: `function () {
        let n = 0;
        for (const el of this) {
          try {
            if (el && el.nodeType === 1 && !el.isConnected) n++;
          } catch (_) {}
        }
        return n;
      }`,
    })) as { result: { value: number } };
    return counted.result.value ?? 0;
  } finally {
    await cdp.send("Runtime.releaseObject", { objectId: arrayObjectId }).catch(() => {});
    if (prototypeObjectId) {
      await cdp.send("Runtime.releaseObject", { objectId: prototypeObjectId }).catch(() => {});
    }
  }
}

/** Force GC, then take a combined heap + detached-element sample. */
export async function sample(cdp: CDPSession): Promise<MemorySample> {
  await forceGc(cdp);
  return {
    usedHeapBytes: await usedHeapBytes(cdp),
    detachedElements: await countDetachedElements(cdp),
  };
}

export interface HeapSnapshotCounts {
  /** Nodes whose class name begins with "Detached " (e.g. "Detached HTMLDivElement"). */
  detachedNodes: number;
  /** Nodes flagged detached via the v8 `detachedness` field (value 2), when present. */
  detachednessFlagged: number;
  totalNodes: number;
}

/**
 * Gold-standard backstop: stream a full heap snapshot and count detached DOM
 * nodes by parsing the snapshot meta. Slower than `countDetachedElements`, used
 * for diagnostics / artifacts on failure rather than in the hot assertion path.
 */
export async function takeHeapSnapshotCounts(cdp: CDPSession): Promise<HeapSnapshotCounts> {
  const chunks: string[] = [];
  const onChunk = (e: { chunk: string }) => chunks.push(e.chunk);
  cdp.on("HeapProfiler.addHeapSnapshotChunk", onChunk);
  try {
    await forceGc(cdp);
    await cdp.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false });
  } finally {
    cdp.off("HeapProfiler.addHeapSnapshotChunk", onChunk);
  }

  const snapshot = JSON.parse(chunks.join("")) as {
    snapshot: { meta: { node_fields: string[] }; node_count: number };
    nodes: number[];
    strings: string[];
  };

  const fields = snapshot.snapshot.meta.node_fields;
  const fieldCount = fields.length;
  const nameIndex = fields.indexOf("name");
  const detachednessIndex = fields.indexOf("detachedness");
  const { nodes, strings } = snapshot;

  let detachedNodes = 0;
  let detachednessFlagged = 0;
  for (let i = 0; i < nodes.length; i += fieldCount) {
    const name = strings[nodes[i + nameIndex]] ?? "";
    if (name.startsWith("Detached ")) detachedNodes++;
    if (detachednessIndex >= 0 && nodes[i + detachednessIndex] === 2) detachednessFlagged++;
  }

  return {
    detachedNodes,
    detachednessFlagged,
    totalNodes: nodes.length / fieldCount,
  };
}
