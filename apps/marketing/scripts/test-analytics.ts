/**
 * Checks that the GA4 conversion helpers in src/lib/analytics.ts call gtag with the
 * expected event names and params, and stay silent on the server.
 */
import assert from "node:assert/strict";

type Call = unknown[];

async function main(): Promise<void> {
  const analytics = await import("../src/lib/analytics");

  // Server: no window, must not throw.
  analytics.trackOutboundClick({ target: "github", link_url: "https://github.com/x" });
  assert.equal(analytics.getPageLocation(), "");

  const calls: Call[] = [];
  const fakeWindow = {
    gtag: (...args: unknown[]) => calls.push(args),
    location: { pathname: "/docs/installation" },
  };
  (globalThis as unknown as { window: unknown }).window = fakeWindow;

  const lastEvent = () => {
    const call = calls[calls.length - 1];
    assert.ok(call, "gtag was not called");
    assert.equal(call[0], "event");
    return { name: call[1] as string, params: call[2] as Record<string, unknown> };
  };

  // Install command detection and parsing.
  assert.equal(analytics.detectPackageManager("npm install @simple-table/react"), "npm");
  assert.equal(analytics.detectPackageManager("pnpm add simple-table-core"), "pnpm");
  assert.equal(analytics.detectPackageManager("yarn add @simple-table/vue"), "yarn");
  assert.equal(analytics.detectPackageManager("import { SimpleTable } from 'x'"), null);
  assert.equal(
    analytics.parseInstallPackages("npm install --save @simple-table/react"),
    "@simple-table/react",
  );

  analytics.trackCopyInstallCommand({
    package_manager: "pnpm",
    framework: "react",
    code_preview: "pnpm add @simple-table/react",
  });
  let e = lastEvent();
  assert.equal(e.name, "copy_install_command");
  assert.deepEqual(
    [e.params.package_manager, e.params.framework, e.params.package, e.params.location],
    ["pnpm", "react", "@simple-table/react", "/docs/installation"],
  );

  analytics.trackCopyExampleCode({ framework: "vue", demo_id: "quick-start", line_count: 12 });
  e = lastEvent();
  assert.equal(e.name, "copy_example_code");
  assert.equal(e.params.demo_id, "quick-start");
  assert.equal(e.params.location, "/docs/installation");

  // Outbound classification.
  assert.deepEqual(analytics.classifyOutboundUrl("https://github.com/petera2c/simple-table"), {
    target: "github",
  });
  assert.deepEqual(
    analytics.classifyOutboundUrl("https://www.npmjs.com/package/@simple-table/react"),
    { target: "npm", package: "@simple-table/react" },
  );
  assert.equal(analytics.classifyOutboundUrl("https://www.simple-table.com/docs"), null);
  assert.equal(analytics.classifyOutboundUrl("/pricing"), null);

  analytics.trackOutboundClick({
    target: "github",
    link_url: "https://github.com/petera2c/simple-table",
    location: "header",
  });
  e = lastEvent();
  assert.equal(e.name, "github_click");
  assert.equal(e.params.location, "header");

  analytics.trackOutboundClick({
    target: "npm",
    link_url: "https://www.npmjs.com/package/simple-table-core",
    package: "simple-table-core",
  });
  e = lastEvent();
  assert.equal(e.name, "npm_click");
  assert.equal(e.params.package, "simple-table-core");

  analytics.trackQuickStartComplete({ framework: "svelte" });
  e = lastEvent();
  assert.equal(e.name, "quick_start_complete");
  assert.equal(e.params.framework, "svelte");

  analytics.trackQuickStartNextStep({ framework: "react", destination: "/docs/table-height" });
  e = lastEvent();
  assert.equal(e.name, "quick_start_next_step");
  assert.equal(e.params.destination, "/docs/table-height");

  analytics.trackPricingCtaClick({
    plan: "pro",
    cta_id: "pricing_start_pro",
    cta_text: "Start Pro",
    destination: "stripe_checkout",
  });
  e = lastEvent();
  assert.equal(e.name, "pricing_cta_click");
  assert.equal(e.params.plan, "pro");
  assert.equal(e.params.location, "pricing_page");

  // No gtag on the page: no-op, no throw.
  delete (fakeWindow as { gtag?: unknown }).gtag;
  const before = calls.length;
  analytics.trackPricingCtaClick({ plan: "free", cta_id: "x", cta_text: "x", destination: "x" });
  assert.equal(calls.length, before);

  console.log("Analytics events: all checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
