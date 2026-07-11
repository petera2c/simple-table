import { useCallback, useMemo, useState, type ReactNode } from "react";
import { SimpleTable } from "@simple-table/react";
import type {
  Theme,
  CellRendererProps,
  ReactHeaderObject,
  HeaderRendererProps,
} from "@simple-table/react";
import {
  generateInfluencerData,
  getInfluencerThemeColors,
  type AudienceAge,
  type AudienceGender,
  type BreakdownItem,
  type FeaturedEntity,
  type Influencer,
  type TopVideo,
} from "./influencers.demo-data";
import "@simple-table/react/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

const AGE_COLORS = ["#A8E3D7", "#6CC5C0", "#44A2B1", "#2980A0", "#215D8B", "#1A3F73"];
const AGE_KEYS: (keyof AudienceAge)[] = ["13-17", "18-24", "25-34", "35-44", "45-64", "65+"];
const GENDER_COLORS = { f: "#7E84FA", m: "#0FB5AE" };

function SegmentedBar({
  segments,
}: {
  segments: Array<{ value: number; color: string }>;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 9,
        borderRadius: 4,
        overflow: "hidden",
        gap: 2,
        marginTop: 6,
      }}
    >
      {segments.map((seg, i) => (
        <div
          key={i}
          style={{
            width: `${(seg.value / total) * 100}%`,
            backgroundColor: seg.color,
            borderRadius: 3,
            minWidth: seg.value > 0 ? 2 : 0,
          }}
        />
      ))}
    </div>
  );
}

function PlatformIcon({ platform }: { platform: "tiktok" | "instagram" | "youtube" | "chartmetric" }) {
  if (platform === "tiktok") {
    return (
      <span
        title="TikTok"
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: "linear-gradient(135deg, #fd355a 0%, #000 55%, #33f3ed 100%)",
          display: "inline-block",
          flexShrink: 0,
        }}
        aria-hidden
      />
    );
  }
  if (platform === "instagram") {
    return (
      <span
        title="Instagram"
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          background: "radial-gradient(circle at 30% 110%, #fa8f21, #d82d7e 70%)",
          display: "inline-block",
          flexShrink: 0,
        }}
        aria-hidden
      />
    );
  }
  if (platform === "youtube") {
    return (
      <span
        title="YouTube"
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: "#eb3423",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#fff",
          fontSize: 7,
          fontWeight: 800,
          lineHeight: 1,
        }}
        aria-hidden
      >
        ▶
      </span>
    );
  }
  return (
    <span
      title="Chartmetric"
      style={{
        width: 14,
        height: 14,
        borderRadius: 3,
        background: "linear-gradient(180deg, #00fff2, #00ffb2)",
        display: "inline-block",
        flexShrink: 0,
      }}
      aria-hidden
    />
  );
}

function ColumnMenuButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={`${label} column menu`}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "#6b7280",
        flexShrink: 0,
        fontSize: 14,
        lineHeight: 1,
        marginLeft: 4,
      }}
    >
      ⋮
    </button>
  );
}

/** Chartmetric-style header: label/icons + ellipsis menu (React portal per header). */
function HeaderChrome({
  header,
  components,
  leading,
  align = "start",
}: {
  header: HeaderRendererProps["header"];
  components?: HeaderRendererProps["components"];
  leading?: ReactNode;
  align?: "start" | "center" | "end";
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 6,
        minWidth: 0,
        padding: "0 2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
          gap: 6,
          flex: 1,
          minWidth: 0,
        }}
      >
        {leading}
        {components?.labelContent ?? (
          <span
            style={{
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {header.label}
          </span>
        )}
      </div>
      <ColumnMenuButton label={String(header.label)} />
      {components?.filterIcon}
      {components?.sortIcon}
    </div>
  );
}

function IconLabelHeader({
  header,
  components,
  platform,
}: HeaderRendererProps & { platform: "tiktok" | "instagram" | "youtube" | "chartmetric" }) {
  return (
    <HeaderChrome
      header={header}
      components={components}
      leading={<PlatformIcon platform={platform} />}
      align="start"
    />
  );
}

function IconOnlyHeader({
  header,
  components,
  platform,
}: HeaderRendererProps & { platform: "tiktok" | "instagram" | "youtube" }) {
  return (
    <HeaderChrome
      header={header}
      components={components}
      leading={<PlatformIcon platform={platform} />}
      align="center"
    />
  );
}

function DefaultHeaderWithMenu({ header, components }: HeaderRendererProps) {
  return <HeaderChrome header={header} components={components} />;
}

function InfluencerCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const r = row as Influencer;
  const meta = [r.country, r.role, [r.gender, r.ageRange].filter(Boolean).join(" · ")]
    .filter(Boolean)
    .join(" · ");

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", minWidth: 0 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: r.avatarColor,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {r.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: colors.text,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {r.name}
        </div>
        <div style={{ display: "flex", gap: 6, overflow: "hidden", alignItems: "center" }}>
          {[r.category, r.niche].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 12,
                lineHeight: 1.2,
                padding: "2px 6px",
                borderRadius: 4,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.chipBg,
                color: colors.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 140,
              }}
            >
              {tag}
            </span>
          ))}
          <span
            style={{
              fontSize: 12,
              lineHeight: 1.2,
              padding: "2px 6px",
              borderRadius: 4,
              border: "0.5px solid rgba(0,0,0,0.4)",
              backgroundColor: "#e8f3f1",
              color: colors.text,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            All
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.muted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ marginRight: 4 }}>{r.countryFlag}</span>
          {meta}
        </div>
      </div>
    </div>
  );
}

function TopVideoThumb({ video, colors }: { video: TopVideo; colors: ReturnType<typeof getInfluencerThemeColors> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 44 }}>
      <div
        style={{
          width: 42,
          height: 48,
          borderRadius: 8,
          background: `linear-gradient(145deg, ${video.color}cc, ${video.color}66)`,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            bottom: 3,
            right: 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 8,
            fontWeight: 700,
            color: "#111",
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          {video.platform === "tiktok" ? "TT" : video.platform === "instagram" ? "IG" : "YT"}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: colors.text, fontWeight: 500 }}>
        <span aria-hidden="true">{video.metricLabel === "likes" ? "♥" : "👁"}</span>
        {video.metric}
      </div>
    </div>
  );
}

function TopVideosCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const videos = (row as Influencer).topVideos.slice(0, 3);

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%" }}>
      {videos.map((video, idx) => (
        <TopVideoThumb key={idx} video={video} colors={colors} />
      ))}
      <button
        type="button"
        style={{
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
          color: "#0f766e",
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        View All
      </button>
    </div>
  );
}

function SingleTopVideoCell({ row, theme, index }: CellRendererProps & { index: number }) {
  const colors = getInfluencerThemeColors(theme);
  const video = (row as Influencer).topVideos[index];
  if (!video) return <span style={{ color: colors.muted }}>—</span>;
  return <TopVideoThumb video={video} colors={colors} />;
}

function FeaturedEntityCell({
  entity,
  theme,
  round,
}: {
  entity: FeaturedEntity | null;
  theme?: string;
  round?: boolean;
}) {
  const colors = getInfluencerThemeColors(theme);
  if (!entity) {
    return <span style={{ color: colors.muted }}>—</span>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <div
          style={{
            width: round ? 28 : 32,
            height: round ? 28 : 32,
            borderRadius: round ? "50%" : 6,
            backgroundColor: entity.color,
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {entity.name}
            {entity.subtitle ? (
              <span style={{ color: colors.muted, fontWeight: 400 }}> — {entity.subtitle}</span>
            ) : null}
          </div>
        </div>
      </div>
      <button
        type="button"
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
          color: "#0f766e",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        View All
      </button>
    </div>
  );
}

function BreakdownCell({ item, theme }: { item: BreakdownItem; theme?: string }) {
  const colors = getInfluencerThemeColors(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13, color: colors.text }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.flag ? `${item.flag} ` : ""}
          {item.label}
        </span>
        <span style={{ fontWeight: 600, flexShrink: 0 }}>{item.percent}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 6,
          borderRadius: 4,
          backgroundColor: colors.border,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${item.percent}%`,
            height: "100%",
            borderRadius: 4,
            backgroundColor: "#0d9488",
          }}
        />
      </div>
      <button
        type="button"
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: 0,
          padding: 0,
          cursor: "pointer",
          color: "#0f766e",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        View All
      </button>
    </div>
  );
}

function AudienceAgeCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const age = (row as Influencer).audienceAge;
  const young = (age["13-17"] ?? 0) + (age["18-24"] ?? 0) + (age["25-34"] ?? 0);

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <div style={{ display: "flex", gap: 3 }}>
          {AGE_COLORS.slice(0, 3).map((c) => (
            <span
              key={c}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: c,
                display: "inline-block",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: colors.muted }}>
          Aged 13-34: <span style={{ color: colors.text, fontWeight: 600 }}>{young}%</span>
        </div>
      </div>
      <SegmentedBar segments={AGE_KEYS.map((k, i) => ({ value: age[k] ?? 0, color: AGE_COLORS[i] }))} />
    </div>
  );
}

function AudienceGenderCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const gender = (row as Influencer).audienceGender as AudienceGender;

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: colors.muted }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: GENDER_COLORS.f }} />
          F: <span style={{ color: colors.text, fontWeight: 600 }}>{gender.f}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: colors.muted }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: GENDER_COLORS.m }} />
          M: <span style={{ color: colors.text, fontWeight: 600 }}>{gender.m}%</span>
        </div>
      </div>
      <SegmentedBar
        segments={[
          { value: gender.f, color: GENDER_COLORS.f },
          { value: gender.m, color: GENDER_COLORS.m },
        ]}
      />
    </div>
  );
}

function ScoreCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const score = (row as Influencer).score;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, width: "100%" }}>
      <div
        style={{
          width: 36,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.border,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #00fff2, #00ffb2)",
          }}
        />
      </div>
      <span style={{ fontWeight: 600, color: colors.text, minWidth: 24, textAlign: "right" }}>{score}</span>
    </div>
  );
}

function RightText({ value }: { value: string }) {
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{value || ""}</span>;
}

/** Ensure every header gets a React headerRenderer (portal), matching Chartmetric density. */
function withHeaderMenus(headers: readonly ReactHeaderObject[]): ReactHeaderObject[] {
  return headers.map((header) => {
    const children = header.children ? withHeaderMenus(header.children) : undefined;
    if (header.headerRenderer) {
      return children ? { ...header, children } : { ...header };
    }
    return {
      ...header,
      headerRenderer: DefaultHeaderWithMenu,
      ...(children ? { children } : {}),
    };
  });
}

function collectWidths(
  headers: readonly ReactHeaderObject[],
  into: Map<string, ReactHeaderObject["width"]>,
) {
  for (const h of headers) {
    into.set(String(h.accessor), h.width);
    if (h.children?.length) collectWidths(h.children, into);
  }
}

/** Width-only merge so controlled resize doesn't re-wrap React renderers. */
function mergeHeaderWidths(
  prev: readonly ReactHeaderObject[],
  next: readonly ReactHeaderObject[],
): ReactHeaderObject[] {
  const widthByAccessor = new Map<string, ReactHeaderObject["width"]>();
  collectWidths(next, widthByAccessor);

  const apply = (headers: readonly ReactHeaderObject[]): ReactHeaderObject[] =>
    headers.map((h) => {
      const width = widthByAccessor.get(String(h.accessor));
      const children = h.children?.length ? apply(h.children) : undefined;
      const widthChanged = width !== undefined && width !== h.width;
      const childrenChanged = Boolean(children && children !== h.children);
      if (!widthChanged && !childrenChanged) return { ...h };
      return {
        ...h,
        ...(widthChanged ? { width } : {}),
        ...(children ? { children } : {}),
      };
    });

  return apply(prev);
}

function buildHeaders(): ReactHeaderObject[] {
  const topVideoChildren: ReactHeaderObject[] = [
    {
      accessor: "topVideosSummary",
      label: "Top Videos",
      width: 280,
      type: "string",
      showWhen: "parentCollapsed",
      cellRenderer: TopVideosCell,
    },
    ...([1, 2, 3, 4, 5] as const).map((n) => ({
      accessor: `topVideo${n}`,
      label: `#${n} Top Video`,
      width: 100,
      type: "string" as const,
      showWhen: "parentExpanded" as const,
      cellRenderer: (props: CellRendererProps) => <SingleTopVideoCell {...props} index={n - 1} />,
    })),
  ];

  return withHeaderMenus([
    {
      accessor: "rank",
      label: "#",
      width: 70,
      type: "number",
      isSortable: true,
      align: "center",
      pinned: "left",
      // Chartmetric portals even the index cell
      cellRenderer: ({ row }: CellRendererProps) => (
        <RightText value={String((row as Influencer).rank)} />
      ),
    },
    {
      accessor: "name",
      label: "Influencer",
      width: 400,
      type: "string",
      isSortable: true,
      pinned: "left",
      cellRenderer: InfluencerCell,
    },
    {
      accessor: "score",
      label: "Score",
      width: 120,
      type: "number",
      isSortable: true,
      align: "right",
      headerRenderer: (props: HeaderRendererProps) => (
        <IconLabelHeader {...props} platform="chartmetric" />
      ),
      cellRenderer: ScoreCell,
    },
    {
      accessor: "followers",
      label: "Followers",
      width: 330,
      type: "string",
      // Nested group (not collapsible) — matches Chartmetric Followers parent
      children: [
        {
          accessor: "tiktokFollowers",
          label: "TikTok",
          width: 110,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconOnlyHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).tiktokFollowersFormatted} />
          ),
        },
        {
          accessor: "youtubeFollowers",
          label: "YouTube",
          width: 110,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconOnlyHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).youtubeFollowersFormatted} />
          ),
        },
        {
          accessor: "instagramFollowers",
          label: "Instagram",
          width: 110,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconOnlyHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).instagramFollowersFormatted} />
          ),
        },
      ],
    },
    {
      accessor: "topContents",
      label: "Top Videos",
      width: 280,
      type: "string",
      collapsible: true,
      collapseDefault: true,
      children: topVideoChildren,
    },
    {
      accessor: "featuredContent",
      label: "Featured Content",
      width: 440,
      type: "string",
      children: [
        {
          accessor: "trackFeatured",
          label: "Tracks Featured",
          width: 260,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <FeaturedEntityCell entity={(row as Influencer).trackFeatured} theme={theme} />
          ),
        },
        {
          accessor: "artistFeatured",
          label: "Artists Featured",
          width: 180,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <FeaturedEntityCell entity={(row as Influencer).artistFeatured} theme={theme} round />
          ),
        },
      ],
    },
    {
      accessor: "audienceDemographics",
      label: "Audience Demographics",
      width: 900,
      type: "string",
      children: [
        {
          accessor: "audienceLocation",
          label: "Audience Location",
          width: 220,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <BreakdownCell item={(row as Influencer).audienceLocation} theme={theme} />
          ),
        },
        {
          accessor: "audienceLanguage",
          label: "Audience Language",
          width: 220,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <BreakdownCell item={(row as Influencer).audienceLanguage} theme={theme} />
          ),
        },
        {
          accessor: "audienceGender",
          label: "Audience Gender",
          width: 220,
          type: "string",
          cellRenderer: AudienceGenderCell,
        },
        {
          accessor: "audienceAge",
          label: "Audience Age",
          width: 240,
          type: "string",
          cellRenderer: AudienceAgeCell,
        },
      ],
    },
    {
      accessor: "tiktokStats",
      label: "Stats",
      width: 1010,
      type: "string",
      headerRenderer: (props: HeaderRendererProps) => (
        <IconLabelHeader {...props} platform="tiktok" />
      ),
      children: [
        {
          accessor: "tiktokStats.postsCount",
          label: "Video Count",
          width: 150,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).tiktokStats.postsCountFormatted} />
          ),
        },
        {
          accessor: "tiktokStats.engagementRate",
          label: "Engagement Rate (%)",
          width: 220,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).tiktokStats.engagementRateFormatted} />
          ),
        },
        {
          accessor: "tiktokStats.avgViews",
          label: "Views (Average)",
          width: 200,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).tiktokStats.avgViewsFormatted} />
          ),
        },
        {
          accessor: "tiktokStats.avgLikes",
          label: "Likes (Average)",
          width: 200,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).tiktokStats.avgLikesFormatted} />
          ),
        },
        {
          accessor: "tiktokStats.avgComments",
          label: "Comments (Average)",
          width: 220,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).tiktokStats.avgCommentsFormatted} />
          ),
        },
      ],
    },
    {
      accessor: "instagramStats",
      label: "Stats",
      width: 1030,
      type: "string",
      headerRenderer: (props: HeaderRendererProps) => (
        <IconLabelHeader {...props} platform="instagram" />
      ),
      children: [
        {
          accessor: "instagramStats.postsCount",
          label: "Post Count",
          width: 150,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).instagramStats.postsCountFormatted} />
          ),
        },
        {
          accessor: "instagramStats.engagementRate",
          label: "Engagement Rate (%)",
          width: 260,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).instagramStats.engagementRateFormatted} />
          ),
        },
        {
          accessor: "instagramStats.avgReelsPlays",
          label: "Reels Plays (Average)",
          width: 220,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).instagramStats.avgReelsPlaysFormatted ?? ""} />
          ),
        },
        {
          accessor: "instagramStats.avgLikes",
          label: "Likes (Average)",
          width: 180,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).instagramStats.avgLikesFormatted} />
          ),
        },
        {
          accessor: "instagramStats.avgComments",
          label: "Comments (Average)",
          width: 220,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).instagramStats.avgCommentsFormatted} />
          ),
        },
      ],
    },
    {
      accessor: "youtubeStats",
      label: "Stats",
      width: 1010,
      type: "string",
      headerRenderer: (props: HeaderRendererProps) => (
        <IconLabelHeader {...props} platform="youtube" />
      ),
      children: [
        {
          accessor: "youtubeStats.postsCount",
          label: "Video Count",
          width: 150,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).youtubeStats.postsCountFormatted} />
          ),
        },
        {
          accessor: "youtubeStats.engagementRate",
          label: "Engagement Rate (%)",
          width: 240,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).youtubeStats.engagementRateFormatted} />
          ),
        },
        {
          accessor: "youtubeStats.avgViews",
          label: "Views (Average)",
          width: 200,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).youtubeStats.avgViewsFormatted} />
          ),
        },
        {
          accessor: "youtubeStats.avgLikes",
          label: "Likes (Average)",
          width: 200,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).youtubeStats.avgLikesFormatted} />
          ),
        },
        {
          accessor: "youtubeStats.avgComments",
          label: "Comments (Average)",
          width: 220,
          type: "number",
          isSortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) => (
            <RightText value={(row as Influencer).youtubeStats.avgCommentsFormatted} />
          ),
        },
      ],
    },
  ]);
}

/**
 * Chartmetric-faithful stress demo:
 * - Nested headers (~28 leaf cols, ~5575px total width)
 * - React portals on every header + body cell
 * - Controlled headers via onColumnWidthChange (React re-render on resize)
 * - autoExpandColumns (post-resize reflow — often the "weird animation")
 * - editColumns + column reordering/resizing
 * - ~50 rows, no pagination (internal scroll like their discovery table)
 */
const InfluencersDemo = ({ height, theme }: { height?: string | number | null; theme?: Theme }) => {
  const rows = useMemo(() => generateInfluencerData(50), []);
  const [headers, setHeaders] = useState<ReactHeaderObject[]>(() => buildHeaders());

  const handleColumnWidthChange = useCallback((next: ReactHeaderObject[]) => {
    setHeaders((prev) => mergeHeaderWidths(prev, next));
  }, []);

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={rows}
      getRowId={(p) => String((p.row as Influencer | undefined)?.id)}
      height={formatTableHeight(height)}
      theme={theme}
      customTheme={{ headerHeight: 36, rowHeight: 90 }}
      columnResizing
      columnReordering
      autoExpandColumns
      editColumns
      columnEditorConfig={{
        text: "All Columns",
        searchEnabled: true,
        searchPlaceholder: "Search columns",
      }}
      shouldPaginate={false}
      onColumnWidthChange={handleColumnWidthChange}
    />
  );
};

export default InfluencersDemo;
