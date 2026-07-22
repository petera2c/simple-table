<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
  import MusicTag from "./MusicTag.svelte";

  const CONFIG: Record<
    string,
    { val: keyof MusicArtist; pct: keyof MusicArtist; signed: boolean; align: "left" | "right" }
  > = {
    followers7DayGrowth: { val: "followers7DayGrowth", pct: "followers7DayGrowthPercent", signed: false, align: "right" },
    followers28DayGrowth: { val: "followers28DayGrowth", pct: "followers28DayGrowthPercent", signed: false, align: "right" },
    followers60DayGrowth: { val: "followers60DayGrowth", pct: "followers60DayGrowthPercent", signed: false, align: "right" },
    playlistReach7DayGrowth: { val: "playlistReach7DayGrowth", pct: "playlistReach7DayGrowthPercent", signed: true, align: "right" },
    playlistReach28DayGrowth: { val: "playlistReach28DayGrowth", pct: "playlistReach28DayGrowthPercent", signed: true, align: "right" },
    playlistReach60DayGrowth: { val: "playlistReach60DayGrowth", pct: "playlistReach60DayGrowthPercent", signed: true, align: "right" },
    playlistCount7DayGrowth: { val: "playlistCount7DayGrowth", pct: "playlistCount7DayGrowthPercent", signed: false, align: "right" },
    playlistCount28DayGrowth: { val: "playlistCount28DayGrowth", pct: "playlistCount28DayGrowthPercent", signed: false, align: "right" },
    playlistCount60DayGrowth: { val: "playlistCount60DayGrowth", pct: "playlistCount60DayGrowthPercent", signed: false, align: "right" },
    monthlyListeners7DayGrowth: { val: "monthlyListeners7DayGrowth", pct: "monthlyListeners7DayGrowthPercent", signed: true, align: "right" },
    monthlyListeners28DayGrowth: { val: "monthlyListeners28DayGrowth", pct: "monthlyListeners28DayGrowthPercent", signed: true, align: "right" },
    monthlyListeners60DayGrowth: { val: "monthlyListeners60DayGrowth", pct: "monthlyListeners60DayGrowthPercent", signed: true, align: "right" },
  };

  let { row, accessor, theme }: CellRendererProps = $props();
  const cfg = $derived(CONFIG[String(accessor)] ?? null);
  const r = $derived(row as unknown as MusicArtist);
  const c = $derived(getMusicThemeColors(theme));

  const view = $derived.by(() => {
    if (!cfg) return null;
    const val = Number(r[cfg.val]);
    const pct = Number(r[cfg.pct]);
    const isPositive = cfg.signed ? val >= 0 : true;
    const showSign = true;
    const displayVal = Number.isFinite(val) ? val.toLocaleString() : String(r[cfg.val]);
    const prefix = showSign ? (isPositive ? "+" : "") : "";
    const arrow = isPositive ? "↑" : "↓";
    const tagText = `${arrow} ${Math.abs(pct).toFixed(2)}%`;
    return {
      line: `${prefix}${displayVal}`,
      tagText,
      variant: isPositive ? ("green" as const) : ("red" as const),
      align: cfg.align,
    };
  });
</script>

{#if view}
  <div
    style="display:flex;flex-direction:column;gap:4px;align-items:{view.align === 'right'
      ? 'flex-end'
      : 'flex-start'};"
  >
    <span style="font-size:14px;color:{c.gray};">{view.line}</span>
    <MusicTag text={view.tagText} variant={view.variant} c={c} />
  </div>
{/if}
