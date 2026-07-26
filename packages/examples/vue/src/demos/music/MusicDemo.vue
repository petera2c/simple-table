<script setup lang="ts">
import { ref, computed, h, type VNodeChild } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueColumnDef, CellRendererProps, GetRowIdParams } from "@simple-table/vue";
import { musicConfig, getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import "@simple-table/vue/styles.css";
import "./music-theme.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function musicNumber(row: MusicArtist, key: string): number {
  const value = row[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function hv(
  tag: string,
  styles?: Record<string, string | number | undefined>,
  children?: VNodeChild[],
) {
  return h(tag, { style: styles ?? {} }, children ?? []);
}

function tag(text: string, color: "green" | "red" | "default", themeColors: Record<string, string>) {
  const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
    green: { bg: themeColors.successBg, text: themeColors.success },
    red: { bg: themeColors.errorBg, text: themeColors.error },
    default: { bg: themeColors.tagBg, text: themeColors.tagText, border: `1px solid ${themeColors.tagBorder}` },
  };
  const s = colorMap[color] || colorMap.default;
  const style: Record<string, string> = {
    backgroundColor: s.bg,
    color: s.text,
    padding: "0 7px",
    fontSize: "11px",
    lineHeight: "20px",
    borderRadius: "4px",
    display: "inline-block",
  };
  if (s.border) style.border = s.border;
  return h("span", { style }, text);
}

function growthMetric(
  value: string | number,
  growthPercent: number,
  themeColors: Record<string, string>,
  opts?: { isPositive?: boolean; align?: "left" | "right"; showSign?: boolean },
) {
  const isPositive = opts?.isPositive ?? true;
  const align = opts?.align ?? "left";
  const showSign = opts?.showSign ?? true;
  const display = typeof value === "number" ? value.toLocaleString() : value;
  const prefix = showSign ? (isPositive ? "+" : "") : "";
  const arrow = isPositive ? "↑" : "↓";

  return hv(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      alignItems: align === "right" ? "flex-end" : "flex-start",
    },
    [
      hv("span", { fontSize: "14px", color: themeColors.gray }, [`${prefix}${display}`]),
      tag(`${arrow} ${Math.abs(growthPercent).toFixed(2)}%`, isPositive ? "green" : "red", themeColors),
    ],
  );
}

function applyRenderers(
  hdrs: readonly VueColumnDef<MusicArtist>[],
  map: Record<string, (p: CellRendererProps<MusicArtist>) => VNodeChild>,
): VueColumnDef<MusicArtist>[] {
  return hdrs.map((col) => {
    const renderer = map[col.accessor as string];
    const clone: VueColumnDef<MusicArtist> = renderer ? { ...col, cellRenderer: renderer } : { ...col };
    if (col.children) {
      clone.children = applyRenderers(col.children, map);
    }
    return clone;
  });
}

const getRowId = ({ row }: GetRowIdParams<MusicArtist>) => row.id;

const headers = computed((): VueColumnDef<MusicArtist>[] => {
  const c = getMusicThemeColors(props.theme);

  const artistRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    const name = row.artistName;
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const avatar = hv("div", {
      width: "40px", height: "40px", borderRadius: "50%",
      backgroundColor: `hsl(${hash % 360}, 65%, 55%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontSize: "16px", flexShrink: "0",
    }, [name.charAt(0).toUpperCase()]);

    const tags = hv("div", { display: "flex", gap: "6px", flexWrap: "wrap" }, [
      tag(row.growthStatus as string, "default", c),
      tag(row.mood as string, "default", c),
      tag(row.genre, "default", c),
    ]);

    const info = hv("div", { display: "flex", flexDirection: "column", gap: "6px", flex: "1" }, [
      hv("span", { fontWeight: "500", fontSize: "14px", color: c.gray }, [name]),
      tags,
    ]);

    return hv("div", { display: "flex", alignItems: "center", gap: "12px" }, [avatar, info]);
  };

  const artistTypeRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    return hv("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      hv("div", { fontSize: "13px", color: c.gray }, [`${row.artistType}, ${row.pronouns}`]),
      hv("div", { fontSize: "12px", color: c.gray }, [row.recordLabel]),
      hv("div", { fontSize: "12px", color: c.gray }, [`Lyrics Language: ${String(row.lyricsLanguage ?? "")}`]),
    ]);
  };

  const followersRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    return hv("div", { display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }, [
      hv("div", { fontSize: "14px", color: c.gray }, [String(row.followersFormatted ?? "")]),
      tag(`↑ +${String(row.followersGrowthFormatted ?? "")} (${musicNumber(row, "followersGrowthPercent").toFixed(2)}%)`, "green", c),
    ]);
  };

  const playlistReachRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    const growth = musicNumber(row, "playlistReachChange");
    const isPos = growth >= 0;
    const formatted = String(row.playlistReachChangeFormatted ?? "");
    const pct = Math.abs(musicNumber(row, "playlistReachChangePercent")).toFixed(2);
    return hv("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      hv("div", { fontSize: "14px", color: c.gray }, [String(row.playlistReachFormatted ?? "")]),
      tag(`${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${formatted} (${pct}%)`, isPos ? "green" : "red", c),
    ]);
  };

  const playlistCountRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    return hv("div", { display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }, [
      hv("div", { fontSize: "14px", color: c.gray }, [musicNumber(row, "playlistCount").toLocaleString()]),
      tag(`↑ +${musicNumber(row, "playlistCountGrowth")} (${musicNumber(row, "playlistCountGrowthPercent").toFixed(2)}%)`, "green", c),
    ]);
  };

  const monthlyListenersRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    const growth = musicNumber(row, "monthlyListenersChange");
    const isPos = growth >= 0;
    const formatted = String(row.monthlyListenersChangeFormatted ?? "");
    const pct = Math.abs(musicNumber(row, "monthlyListenersChangePercent")).toFixed(2);
    return hv("div", { display: "flex", flexDirection: "column", gap: "4px" }, [
      hv("div", { fontSize: "14px", color: c.gray }, [String(row.monthlyListenersFormatted ?? "")]),
      tag(`${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${formatted} (${pct}%)`, isPos ? "green" : "red", c),
    ]);
  };

  const popularityRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    const pct = musicNumber(row, "popularityChangePercent");
    const isPos = pct >= 0;
    return hv("div", { display: "flex", justifyContent: "center" }, [
      growthMetric(`${musicNumber(row, "popularity")}/100`, pct, c, { isPositive: isPos, showSign: false }),
    ]);
  };

  const conversionRateRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    return hv("span", { color: c.gray }, [`${musicNumber(row, "conversionRate").toFixed(2)}%`]);
  };

  const ratioRenderer = ({ row }: CellRendererProps<MusicArtist>) => {
    return hv("span", { color: c.gray }, [`${musicNumber(row, "reachFollowersRatio").toFixed(1)}x`]);
  };

  const growthCell = (valueKey: string, pctKey: string, signed: boolean) =>
    ({ row }: CellRendererProps<MusicArtist>) => {
      const val = musicNumber(row, valueKey);
      const pct = musicNumber(row, pctKey);
      return growthMetric(val, pct, c, { isPositive: signed ? val >= 0 : true, align: "right" });
    };

  const rendererMap: Record<string, (p: CellRendererProps<MusicArtist>) => VNodeChild> = {
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
      :columns="headers"
      :get-row-id="getRowId"
      :rows="[...musicConfig.rows]"
      :height="props.height"
      :theme="props.theme"
      :selectable-cells="true"
      :column-reordering="true"
      :column-resizing="true"
      :custom-theme="{ headerHeight: 30, rowHeight: 85 }"
    />
  </div>
</template>
