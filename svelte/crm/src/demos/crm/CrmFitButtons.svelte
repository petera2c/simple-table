<script lang="ts">
  type CrmColors = typeof import("./crm.demo-data").CRM_THEME_COLORS_LIGHT;

  let { colors }: { colors: CrmColors } = $props();

  let selected = $state<string | null>(null);

  const btnStyle =
    "flex:1;padding:4px 8px;font-size:0.75rem;font-weight:500;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s;";
</script>

<div style="display:flex;align-items:center;">
  <button
    type="button"
    style="{btnStyle}color:{colors.buttonText};background-color:{selected === 'fit'
      ? 'oklch(62.7% 0.194 149.214)'
      : 'oklch(92.5% 0.084 155.995)'};border-top-left-radius:6px;border-bottom-left-radius:6px;"
    onclick={() => (selected = selected === "fit" ? null : "fit")}
  >
    ✓
  </button>
  <button
    type="button"
    style="{btnStyle}color:{colors.buttonText};background-color:{selected === 'partial'
      ? colors.buttonHoverBg
      : colors.buttonBg};"
    onclick={() => (selected = selected === "partial" ? null : "partial")}
  >
    ?
  </button>
  <button
    type="button"
    style="{btnStyle}color:{colors.buttonText};background-color:{selected === 'no'
      ? 'oklch(64.6% 0.222 41.116)'
      : 'oklch(90.1% 0.076 70.697)'};border-top-right-radius:6px;border-bottom-right-radius:6px;"
    onclick={() => (selected = selected === "no" ? null : "no")}
  >
    X
  </button>
</div>
