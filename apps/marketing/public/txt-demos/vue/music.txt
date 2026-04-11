<script setup lang="ts">
import { computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { HeaderObject, CellRenderer } from "simple-table-core";
import { musicConfig, getMusicThemeColors } from "@simple-table/examples-shared";
import type { MusicArtist } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";
import "@simple-table/examples-shared/styles/music-theme.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function el(tag: string, styles?: Partial<CSSStyleDeclaration>, children?: (Node | string)[]): HTMLElement {
  const e = document.createElement(tag);
  if (styles) Object.assign(e.style, styles);
  if (children) {
    for (const c of children) {
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
  }
  return e;
}

function tag(text: string, color: "green" | "red" | "default", themeColors: Record<string, string>): HTMLElement {
  const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
    green: { bg: themeColors.successBg, text: themeColors.success },
    red: { bg: themeColors.errorBg, text: themeColors.error },
    default: { bg: themeColors.tagBg, text: themeColors.tagText, border: `1px solid ${themeColors.tagBorder}` },
  };
  const s = colorMap[color] || colorMap.default;
  const span = el("span", {
    backgroundColor: s.bg, color: s.text, padding: "0 7px",
    fontSize: "11px", lineHeight: "20px", borderRadius: "4px", display: "inline-block",
  }, [text]);
  if (s.border) span.style.border = s.border;
  return span;
}

function growthMetric(
  value: string | number,
  growthPercent: number,
  themeColors: Record<string, string>,
  opts?: { isPositive?: boolean; align?: "left" | "right"; showSign?: boolean },
): HTMLElement {
  const isPositive = opts?.isPositive ?? true;
  const align = opts?.align ?? "left";
  const showSign = opts?.showSign ?? true;
  const display = typeof value === "number" ? value.toLocaleString() : value;
  const prefix = showSign ? (isPositive ? "+" : "") : "";
  const arrow = isPositive ? "↑" : "↓";

  return el("div", {
    display: "flex", flexDirection: "column", gap: "4px",
    alignItems: align === "right" ? "flex-end" : "flex-start",
  }, [
    el("span", { fontSize: "14px", color: themeColors.gray }, [`${prefix}${display}`]),
    tag(`${arrow} ${Math.abs(growthPercent).toFixed(2)}%`, isPositive ? "green" : "red", themeColors),
  ]);
}

function applyRenderers(hdrs: readonly HeaderObject[], map: Record<string, CellRenderer>): HeaderObject[] {
  return hdrs.map((h) => {
    const renderer = map[h.accessor as string];
    const clone: HeaderObject = renderer ? { ...h, cellRenderer: renderer } : { ...h };
    if (h.children) {
      clone.children = applyRenderers(h.children, map);
    }
    return clone;
  });
}

const headers = computed(() => {
  const c = getMusicThemeColors(props.theme);

  const artistRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const name = d.artistName;
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const avatar = el("div", {
      width: "40px", height: "40px", borderRadius: "50%",
      backgroundColor: `hsl(${hash % 360}, 65%, 55%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontSize: "16px", flexShrink: "0",
    }, [name.charAt(0).toUpperCase()]);

    const tags = el("div", { display: "flex", gap: "6px", flexWrap: "wrap" }, [
      tag(d.growthStatus, "default", c),
      tag(d.mood, "default", c),
      tag(d.genre, "default", c),
    ]);

    const info = el("div", { display: "flex", flexDirection: "column", gap: "6px", flex: "1" }, [
      el("span", { fontWeight: "500", fontSize: "14px", color: c.gray }, [name]),
      tags,
    ]);

    return el("div", { display: "flex", alignItems: "center", gap: "12px" }, [avatar, info]);
  };

  const artistTypeRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      el("div", { fontSize: "13px", color: c.gray }, [`${d.artistType}, ${d.pronouns}`]),
      el("div", { fontSize: "12px", color: c.gray }, [d.recordLabel]),
      el("div", { fontSize: "12px", color: c.gray }, [`Lyrics Language: ${d.lyricsLanguage}`]),
    ]);
  };

  const followersRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("div", { display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.followersFormatted]),
      tag(`↑ +${d.followersGrowthFormatted} (${d.followersGrowthPercent.toFixed(2)}%)`, "green", c),
    ]);
  };

  const playlistReachRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const growth = d.playlistReachChange;
    const isPos = growth >= 0;
    const formatted = d.playlistReachChangeFormatted;
    const pct = Math.abs(d.playlistReachChangePercent).toFixed(2);
    return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.playlistReachFormatted]),
      tag(`${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${formatted} (${pct}%)`, isPos ? "green" : "red", c),
    ]);
  };

  const playlistCountRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("div", { display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.playlistCount.toLocaleString()]),
      tag(`↑ +${d.playlistCountGrowth} (${d.playlistCountGrowthPercent.toFixed(2)}%)`, "green", c),
    ]);
  };

  const monthlyListenersRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const growth = d.monthlyListenersChange;
    const isPos = growth >= 0;
    const formatted = d.monthlyListenersChangeFormatted;
    const pct = Math.abs(d.monthlyListenersChangePercent).toFixed(2);
    return el("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      el("div", { fontSize: "14px", color: c.gray }, [d.monthlyListenersFormatted]),
      tag(`${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${formatted} (${pct}%)`, isPos ? "green" : "red", c),
    ]);
  };

  const popularityRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    const pct = d.popularityChangePercent;
    const isPos = pct >= 0;
    const wrapper = el("div", { display: "flex", justifyContent: "center" });
    wrapper.appendChild(growthMetric(`${d.popularity}/100`, pct, c, { isPositive: isPos, showSign: false }));
    return wrapper;
  };

  const conversionRateRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("span", { color: c.gray }, [`${d.conversionRate.toFixed(2)}%`]);
  };

  const ratioRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as MusicArtist;
    return el("span", { color: c.gray }, [`${d.reachFollowersRatio.toFixed(1)}x`]);
  };

  const growthCell = (valueKey: string, pctKey: string, signed: boolean): CellRenderer => ({ row }) => {
    const d = row as unknown as Record<string, number>;
    const val = d[valueKey];
    const pct = d[pctKey];
    return growthMetric(val, pct, c, { isPositive: signed ? val >= 0 : true, align: "right" });
  };

  const rendererMap: Record<string, CellRenderer> = {
    artistName: artistRenderer,
    artistType: artistTypeRenderer,
    followers: followersRenderer,
    followers7DayGrowth: growthCell("followers7DayGrowth", "followers7DayGrowthPercent", false),
    followers28DayGrowth: growthCell("followers28DayGrowth", "followers28DayGrowthPercent", false),
    followers60DayGrowth: growthCell("followers60DayGrowth", "followers60DayGrowthPercent", false),
    popularity: popularityRenderer,
    playlistReach: playlistReachRenderer,
    playlistReach7DayGrowth: growthCell("playlistReach7DayGrowth", "playlistReach7DayGrowthPercent", true),
    playlistReach28DayGrowth: growthCell("playlistReach28DayGrowth", "playlistReach28DayGrowthPercent", true),
    playlistReach60DayGrowth: growthCell("playlistReach60DayGrowth", "playlistReach60DayGrowthPercent", true),
    playlistCount: playlistCountRenderer,
    playlistCount7DayGrowth: growthCell("playlistCount7DayGrowth", "playlistCount7DayGrowthPercent", false),
    playlistCount28DayGrowth: growthCell("playlistCount28DayGrowth", "playlistCount28DayGrowthPercent", false),
    playlistCount60DayGrowth: growthCell("playlistCount60DayGrowth", "playlistCount60DayGrowthPercent", false),
    monthlyListeners: monthlyListenersRenderer,
    monthlyListeners7DayGrowth: growthCell("monthlyListeners7DayGrowth", "monthlyListeners7DayGrowthPercent", true),
    monthlyListeners28DayGrowth: growthCell("monthlyListeners28DayGrowth", "monthlyListeners28DayGrowthPercent", true),
    monthlyListeners60DayGrowth: growthCell("monthlyListeners60DayGrowth", "monthlyListeners60DayGrowthPercent", true),
    conversionRate: conversionRateRenderer,
    reachFollowersRatio: ratioRenderer,
  };

  return applyRenderers(musicConfig.headers, rendererMap);
});
</script>

<template>
  <div class="music-theme-container" style="font-family: Inter">
    <SimpleTable
      :default-headers="headers"
      :rows="[...musicConfig.rows]"
      :height="height"
      :theme="theme"
      :selectable-cells="true"
      :column-reordering="true"
      :column-resizing="true"
      :custom-theme="{ headerHeight: 30, rowHeight: 85 }"
    />
  </div>
</template>
