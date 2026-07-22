import type { ColumnEditorRowRendererProps } from "@simple-table/solid";
import { createEffect } from "solid-js";

function attach(slot: unknown, host: HTMLElement | undefined): void {
  if (!host) return;
  host.replaceChildren();
  if (slot == null) return;
  if (typeof slot === "string") {
    host.textContent = slot;
  } else if (slot instanceof Node) {
    host.appendChild(slot);
  }
}

function SlotHost(props: { slot: () => unknown }) {
  let host: HTMLSpanElement | undefined;
  createEffect(() => {
    attach(props.slot(), host);
  });
  return (
    <span
      ref={(el) => {
        host = el;
        attach(props.slot(), el);
      }}
    />
  );
}

export default function MarketingColumnEditorRow(props: ColumnEditorRowRendererProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
        gap: "8px",
        "padding-right": "8px",
      }}
    >
      <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
        <SlotHost slot={() => props.components.expandIcon} />
        <SlotHost slot={() => props.components.checkbox} />
        <SlotHost slot={() => props.components.labelContent} />
      </div>
      <SlotHost slot={() => props.components.dragIcon} />
    </div>
  );
}
