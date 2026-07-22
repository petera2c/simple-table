<script lang="ts">
  type CrmColors = typeof import("./crm.demo-data").CRM_THEME_COLORS_LIGHT;

  let { colors }: { colors: CrmColors } = $props();

  let isLoading = $state(false);
  let email = $state<string | null>(null);

  function handleClick() {
    if (isLoading || email) return;
    isLoading = true;
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
    const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
    setTimeout(() => {
      email = `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`;
      isLoading = false;
    }, 2000);
  }
</script>

{#if email}
  <span
    style="margin-right:8px;display:inline-flex;cursor:default;align-items:center;column-gap:6px;border-radius:9999px;padding-inline:8px;padding-block:4px;font-size:12px;font-weight:500;background-color:{colors.tagBg};color:{colors.tagText};"
  >
    {email}
  </span>
{:else if isLoading}
  <span
    style="margin-right:8px;display:inline-flex;cursor:default;align-items:center;column-gap:6px;border-radius:9999px;padding-inline:8px;padding-block:4px;font-size:12px;font-weight:500;background-color:{colors.tagBg};color:{colors.tagText};"
  >
    <div
      style="width:12px;height:12px;border:2px solid {colors.buttonHoverBg};border-top:2px solid {colors.accent};border-radius:50%;animation:spin 1s linear infinite;"
    ></div>
    Enriching...
  </span>
{:else}
  <span
    style="cursor:pointer;display:inline-flex;align-items:center;column-gap:6px;border-radius:9999px;padding-inline:8px;padding-block:4px;font-size:12px;font-weight:500;background-color:color-mix(in oklab, oklch(62.3% 0.214 259.815) 10%, transparent);color:{colors.tagText};"
    onclick={handleClick}
    onkeydown={(e) => e.key === "Enter" && handleClick()}
    role="button"
    tabindex="0"
  >
    Enrich
  </span>
{/if}
