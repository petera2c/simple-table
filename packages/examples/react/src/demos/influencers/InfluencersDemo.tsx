import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { SimpleTable } from "@simple-table/react";
import type {
  Theme,
  CellRendererProps,
  ReactCellRenderer,
  ReactColumnDef,
  HeaderRendererProps,
} from "@simple-table/react";
import {
  generateInfluencerData,
  getInfluencerThemeColors,
  formatCompact,
  formatRate,
  type AudienceGender,
  type BreakdownItem,
  type FeaturedEntity,
  type Influencer,
  type TopVideo,
} from "./influencers.demo-data";
import {
  CmHeaderMenuButton,
  CmLinkButton,
  CmMetricCell,
  CmModal,
  CmTooltip,
  CmViewAllButton,
} from "./influencers-interactive";
import "@simple-table/react/styles.css";

/**
 * Client repro toggles — Chartmetric Track List suspected unstable props.
 * When enabled, mimics apps that rebuild columns/rows (and re-render the page)
 * on every parent update, which can flicker header menus and fight column resize.
 */
type UnstableReproFlags = {
  /** Rebuild columns from scratch each render (new object + renderer refs). */
  unstableColumns: boolean;
  /** Pass a freshly mapped/cloned rows array each render. */
  unstableRows: boolean;
  /** Interval tick that forces parent re-renders (simulates busy page state). */
  forceParentRerenders: boolean;
};

const DEFAULT_REPRO_FLAGS: UnstableReproFlags = {
  unstableColumns: false,
  unstableRows: false,
  forceParentRerenders: false,
};

const PARENT_RERENDER_MS = 250;

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "90dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

const GENDER_COLORS = { f: "#7E84FA", m: "#0FB5AE" };

function SegmentedBar({ segments }: { segments: Array<{ value: number; color: string }> }) {
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

function PlatformIcon({
  platform,
}: {
  platform: "tiktok" | "instagram" | "youtube" | "chartmetric";
}) {
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
          justifyContent:
            align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
          gap: 6,
          flex: 1,
          minWidth: 0,
        }}
      >
        {leading}
        {components?.labelContent ?? (
          <CmTooltip content={`Column: ${header.label}`}>
            <span
              style={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "default",
              }}
            >
              {header.label}
            </span>
          </CmTooltip>
        )}
      </div>
      <CmHeaderMenuButton label={String(header.label)} />
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
  const [profileOpen, setProfileOpen] = useState(false);
  const meta = [r.country, r.role, [r.gender, r.ageRange].filter(Boolean).join(" · ")]
    .filter(Boolean)
    .join(" · ");

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", minWidth: 0 }}>
      <CmTooltip content={`Open profile · ${r.name}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setProfileOpen(true);
          }}
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
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {r.name.charAt(0).toUpperCase()}
        </button>
      </CmTooltip>
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <CmTooltip
          content={
            <div>
              <div style={{ fontWeight: 700 }}>{r.name}</div>
              <div style={{ opacity: 0.85 }}>{r.role}</div>
              <div style={{ opacity: 0.75, marginTop: 4 }}>
                {r.countryFlag} {r.country}
              </div>
            </div>
          }
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen(true);
            }}
            style={{
              all: "unset",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {r.name}
          </button>
        </CmTooltip>
        <div style={{ display: "flex", gap: 6, overflow: "hidden", alignItems: "center" }}>
          {[r.category, r.niche].map((tag) => (
            <CmTooltip key={tag} content={`Filter by ${tag}`}>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
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
                  cursor: "pointer",
                }}
              >
                {tag}
              </button>
            </CmTooltip>
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
        <CmLinkButton onClick={() => setProfileOpen(true)}>View profile</CmLinkButton>
      </div>
      <CmModal open={profileOpen} title={r.name} onClose={() => setProfileOpen(false)}>
        <p style={{ marginTop: 0 }}>
          {r.role} · {r.category} · {r.niche}
        </p>
        <p>
          {r.countryFlag} {r.country} · Score {r.ranks.score_100}
        </p>
        <p style={{ color: "#64748b" }}>
          Chartmetric opens influencer drawers / modals from the identity cell. This replica keeps
          that interaction inside the cellRenderer portal tree.
        </p>
      </CmModal>
    </div>
  );
}

function TopVideoThumb({
  video,
  colors,
}: {
  video: TopVideo;
  colors: ReturnType<typeof getInfluencerThemeColors>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minWidth: 44,
      }}
    >
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontSize: 11,
          color: colors.text,
          fontWeight: 500,
        }}
      >
        <span aria-hidden="true">{video.metricLabel === "likes" ? "♥" : "👁"}</span>
        {video.metric}
      </div>
    </div>
  );
}

function TopVideosCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const videos = (row as Influencer).topContents.slice(0, 3);
  const all = (row as Influencer).topContents;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%" }}>
      {videos.map((video, idx) => (
        <CmTooltip key={idx} content={`${video.platform} · ${video.metricLabel} ${video.metric}`}>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            style={{ all: "unset", cursor: "pointer" }}
          >
            <TopVideoThumb video={video} colors={colors} />
          </button>
        </CmTooltip>
      ))}
      <CmViewAllButton title="Top Videos">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {all.map((v, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              #{i + 1} {v.platform} — {v.metricLabel} {v.metric}
            </li>
          ))}
        </ul>
      </CmViewAllButton>
    </div>
  );
}

function SingleTopVideoCell({ row, theme, index }: CellRendererProps & { index: number }) {
  const colors = getInfluencerThemeColors(theme);
  const video = (row as Influencer).topContents[index];
  const [open, setOpen] = useState(false);
  if (!video) return <span style={{ color: colors.muted }}>—</span>;
  return (
    <>
      <CmTooltip content={`#${index + 1} ${video.platform} · ${video.metric}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <TopVideoThumb video={video} colors={colors} />
        </button>
      </CmTooltip>
      <CmModal open={open} title={`#${index + 1} Top Video`} onClose={() => setOpen(false)}>
        <p style={{ marginTop: 0 }}>
          {video.platform} — {video.metricLabel} {video.metric}
        </p>
      </CmModal>
    </>
  );
}

function FeaturedEntityCell({
  entity,
  theme,
  round,
  kind,
}: {
  entity: FeaturedEntity | null;
  theme?: string;
  round?: boolean;
  kind: string;
}) {
  const colors = getInfluencerThemeColors(theme);
  if (!entity) {
    return <span style={{ color: colors.muted }}>—</span>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", minWidth: 0 }}>
      <CmTooltip content={`${kind}: ${entity.name}`}>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            cursor: "pointer",
            width: "100%",
          }}
        >
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
        </button>
      </CmTooltip>
      <CmViewAllButton title={kind}>
        <p style={{ marginTop: 0 }}>
          <strong>{entity.name}</strong>
          {entity.subtitle ? ` — ${entity.subtitle}` : ""}
        </p>
        <p style={{ color: "#64748b" }}>
          Chartmetric opens a full featured-content browser from this cell.
        </p>
      </CmViewAllButton>
    </div>
  );
}

function BreakdownCell({
  item,
  theme,
  title,
}: {
  item: BreakdownItem;
  theme?: string;
  title: string;
}) {
  const colors = getInfluencerThemeColors(theme);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <CmTooltip content={`${item.label}: ${item.percent}%`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            fontSize: 13,
            color: colors.text,
            cursor: "default",
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.flag ? `${item.flag} ` : ""}
            {item.label}
          </span>
          <span style={{ fontWeight: 600, flexShrink: 0 }}>{item.percent}%</span>
        </div>
      </CmTooltip>
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
      <CmViewAllButton title={title}>
        <p style={{ marginTop: 0 }}>
          Top: {item.flag ? `${item.flag} ` : ""}
          {item.label} ({item.percent}%)
        </p>
        <p style={{ color: "#64748b" }}>Full audience breakdown modal replica.</p>
      </CmViewAllButton>
    </div>
  );
}

function AudienceGenderCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const gender = (row as Influencer).audienceStats.gender as AudienceGender;
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <CmTooltip content={`Female ${gender.f}% · Male ${gender.m}%`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}
        >
          <div style={{ display: "flex", gap: 16, marginBottom: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: colors.muted,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: GENDER_COLORS.f,
                }}
              />
              F: <span style={{ color: colors.text, fontWeight: 600 }}>{gender.f}%</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: colors.muted,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: GENDER_COLORS.m,
                }}
              />
              M: <span style={{ color: colors.text, fontWeight: 600 }}>{gender.m}%</span>
            </div>
          </div>
          <SegmentedBar
            segments={[
              { value: gender.f, color: GENDER_COLORS.f },
              { value: gender.m, color: GENDER_COLORS.m },
            ]}
          />
        </button>
      </CmTooltip>
      <div style={{ marginTop: 6 }}>
        <CmLinkButton onClick={() => setOpen(true)}>View All</CmLinkButton>
      </div>
      <CmModal open={open} title="Audience Gender" onClose={() => setOpen(false)}>
        <p style={{ marginTop: 0 }}>
          Female {gender.f}% · Male {gender.m}%
        </p>
        <p style={{ color: "#64748b" }}>Full gender breakdown modal replica.</p>
      </CmModal>
    </div>
  );
}

function ScoreCell({ row, theme }: CellRendererProps) {
  const colors = getInfluencerThemeColors(theme);
  const score = (row as Influencer).ranks.score_100;
  const [open, setOpen] = useState(false);
  return (
    <>
      <CmTooltip content={`Chartmetric Score ${score}/100 — click for details`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            width: "100%",
            cursor: "pointer",
          }}
        >
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
          <span style={{ fontWeight: 600, color: colors.text, minWidth: 24, textAlign: "right" }}>
            {score}
          </span>
        </button>
      </CmTooltip>
      <CmModal open={open} title="Chartmetric Score" onClose={() => setOpen(false)}>
        <p style={{ marginTop: 0 }}>
          Score: <strong>{score}</strong> / 100
        </p>
        <p style={{ color: "#64748b" }}>Score breakdown modal replica.</p>
      </CmModal>
    </>
  );
}

function metricCell(label: string, value: string) {
  return <CmMetricCell label={label} value={value} />;
}

/** Placeholder row appended while the next infinite-scroll page is in flight. */
type SkeletonInfluencer = {
  id: string;
  __index__: number;
  __skeleton__: true;
};

type InfluencerRow = Influencer | SkeletonInfluencer;

function isSkeletonRow(row: unknown): row is SkeletonInfluencer {
  return Boolean(
    row &&
    typeof row === "object" &&
    "__skeleton__" in row &&
    (row as SkeletonInfluencer).__skeleton__,
  );
}

function createSkeletonRows(startIndex: number, count: number): SkeletonInfluencer[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `skeleton-${startIndex + i + 1}`,
    __index__: startIndex + i + 1,
    __skeleton__: true as const,
  }));
}

function countLoadedRows(rows: readonly InfluencerRow[]): number {
  return rows.reduce((n, row) => n + (isSkeletonRow(row) ? 0 : 1), 0);
}

function SkeletonBar({
  width = "70%",
  height = 14,
  radius = 4,
  style,
}: {
  width?: string | number;
  height?: number;
  radius?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className="st-loading-skeleton"
      style={{ width, height, borderRadius: radius, maxWidth: "100%", ...style }}
    />
  );
}

/** Chartmetric-style identity cell shimmer (avatar + two text lines). */
function InfluencerSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
      <SkeletonBar width={56} height={56} radius={28} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonBar width="55%" height={14} />
        <SkeletonBar width="75%" height={10} />
      </div>
    </div>
  );
}

/** Compact media / featured-content shimmer. */
function MediaSkeleton({ tiles = 3 }: { tiles?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      {Array.from({ length: tiles }, (_, i) => (
        <SkeletonBar key={i} width={48} height={48} radius={6} style={{ flexShrink: 0 }} />
      ))}
    </div>
  );
}

function DefaultCellSkeleton({ align }: { align?: string }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: align === "right" || align === "center" ? align : "flex-start",
      }}
    >
      <SkeletonBar width={align === "center" ? "40%" : "65%"} />
    </div>
  );
}

function skeletonForAccessor(accessor: string, align?: string): ReactNode {
  if (accessor === "name") return <InfluencerSkeleton />;
  if (accessor === "topContentsSummary" || accessor.startsWith("topVideo")) {
    return <MediaSkeleton tiles={accessor === "topContentsSummary" ? 3 : 1} />;
  }
  if (accessor === "tracksFeatured" || accessor === "artistsFeatured") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
        <SkeletonBar
          width={36}
          height={36}
          radius={accessor === "artistsFeatured" ? 18 : 6}
          style={{ flexShrink: 0 }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <SkeletonBar width="70%" height={12} />
          <SkeletonBar width="45%" height={10} />
        </div>
      </div>
    );
  }
  if (
    accessor === "audienceStats.gender" ||
    accessor === "audienceStats.code2" ||
    accessor === "audienceStats.language"
  ) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <SkeletonBar width="50%" height={12} />
        <SkeletonBar width="100%" height={9} />
      </div>
    );
  }
  return <DefaultCellSkeleton align={align} />;
}

function withSkeletonCell(
  accessor: string,
  align: string | undefined,
  Renderer: ReactCellRenderer,
): ReactCellRenderer {
  return (props: CellRendererProps) => {
    if (isSkeletonRow(props.row)) {
      return skeletonForAccessor(accessor, align);
    }
    return createElement(Renderer, props);
  };
}

/** Ensure every header gets a React headerRenderer (portal), matching Chartmetric density. */
function withHeaderMenus(headers: readonly ReactColumnDef[]): ReactColumnDef[] {
  return headers.map((header) => {
    const children = header.children ? withHeaderMenus(header.children) : undefined;
    const cellRenderer = header.cellRenderer
      ? withSkeletonCell(String(header.accessor), header.align, header.cellRenderer)
      : undefined;
    if (header.headerRenderer) {
      return {
        ...header,
        ...(children ? { children } : {}),
        ...(cellRenderer ? { cellRenderer } : {}),
      };
    }
    return {
      ...header,
      headerRenderer: DefaultHeaderWithMenu,
      ...(children ? { children } : {}),
      ...(cellRenderer ? { cellRenderer } : {}),
    };
  });
}

function collectWidths(
  headers: readonly ReactColumnDef[],
  into: Map<string, ReactColumnDef["width"]>,
) {
  for (const h of headers) {
    into.set(String(h.accessor), h.width);
    if (h.children?.length) collectWidths(h.children, into);
  }
}

/** Width-only merge so controlled resize doesn't re-wrap React renderers. */
function mergeHeaderWidths(
  prev: readonly ReactColumnDef[],
  next: readonly ReactColumnDef[],
): ReactColumnDef[] {
  const widthByAccessor = new Map<string, ReactColumnDef["width"]>();
  collectWidths(next, widthByAccessor);

  const apply = (headers: readonly ReactColumnDef[]): ReactColumnDef[] =>
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

/**
 * Headers mirrored from sandbox3.chartmetric.com/influencers DOM:
 * accessors, widths, nested groups, collapsed top videos, no audience age.
 * Main scroll width ≈ 150+390+280+500+900+1010+1030+1010 = 5270–5560px.
 *
 * Includes an accidental production case: `id` has excludeFromRender + width: 150.
 * Cells/headers are correctly omitted, but layout must not reserve that width.
 */
function buildHeaders(): ReactColumnDef[] {
  const topVideoChildren: ReactColumnDef[] = [
    {
      accessor: "topContentsSummary",
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
      accessor: "__index__",
      label: "#",
      width: 70,
      type: "number",
      sortable: true,
      align: "center",
      pinned: "left",
      cellRenderer: ({ row }: CellRendererProps) =>
        metricCell("#", String((row as Influencer).__index__)),
    },
    {
      accessor: "name",
      label: "Influencer",
      width: 400,
      type: "string",
      sortable: true,
      pinned: "left",
      cellRenderer: InfluencerCell,
    },
    // Repro: excluded from render but still has a width (as seen in Chartmetric).
    // Expect no header/body cells AND no reserved horizontal space.
    {
      accessor: "id",
      label: "Internal ID",
      width: 150,
      type: "string",
      excludeFromRender: true,
    },
    {
      accessor: "ranks.score_100",
      label: "Chartmetric Score",
      width: 150,
      type: "number",
      sortable: true,
      align: "right",
      headerRenderer: (props: HeaderRendererProps) => (
        <IconLabelHeader {...props} platform="chartmetric" />
      ),
      cellRenderer: ScoreCell,
    },
    {
      accessor: "followers",
      label: "Followers",
      width: 390,
      type: "string",
      children: [
        {
          accessor: "profiles.tiktok_followers",
          label: "TikTok",
          width: 130,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconOnlyHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Followers",
              formatCompact((row as Influencer).profiles.tiktok_followers),
            ),
        },
        {
          accessor: "profiles.youtube_followers",
          label: "YouTube",
          width: 130,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconOnlyHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "YouTube Followers",
              formatCompact((row as Influencer).profiles.youtube_followers),
            ),
        },
        {
          accessor: "profiles.instagram_followers",
          label: "Instagram",
          width: 130,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconOnlyHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "Instagram Followers",
              formatCompact((row as Influencer).profiles.instagram_followers),
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
      width: 500,
      type: "string",
      children: [
        {
          accessor: "tracksFeatured",
          label: "Tracks Featured",
          width: 300,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <FeaturedEntityCell
              entity={(row as Influencer).tracksFeatured}
              theme={theme}
              kind="Tracks Featured"
            />
          ),
        },
        {
          accessor: "artistsFeatured",
          label: "Artists Featured",
          width: 200,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <FeaturedEntityCell
              entity={(row as Influencer).artistsFeatured}
              theme={theme}
              round
              kind="Artists Featured"
            />
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
          accessor: "audienceStats.code2",
          label: "Audience Location",
          width: 300,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <BreakdownCell
              item={(row as Influencer).audienceLocation}
              theme={theme}
              title="Audience Location"
            />
          ),
        },
        {
          accessor: "audienceStats.language",
          label: "Audience Language",
          width: 300,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) => (
            <BreakdownCell
              item={(row as Influencer).audienceLanguage}
              theme={theme}
              title="Audience Language"
            />
          ),
        },
        {
          accessor: "audienceStats.gender",
          label: "Audience Gender",
          width: 300,
          type: "string",
          cellRenderer: AudienceGenderCell,
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
          accessor: "profiles.tiktok_posts_count",
          label: "Video Count",
          width: 150,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Video Count",
              formatCompact((row as Influencer).profiles.tiktok_posts_count),
            ),
        },
        {
          accessor: "audienceStats.tiktok_engagement_rate",
          label: "Engagement Rate (%)",
          width: 240,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Engagement Rate",
              formatRate((row as Influencer).audienceStats.tiktok_engagement_rate),
            ),
        },
        {
          accessor: "audienceStats.tiktok_avg_views",
          label: "Views (Average)",
          width: 200,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Views (Average)",
              formatCompact((row as Influencer).audienceStats.tiktok_avg_views),
            ),
        },
        {
          accessor: "audienceStats.tiktok_avg_likes",
          label: "Likes (Average)",
          width: 200,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Likes (Average)",
              formatCompact((row as Influencer).audienceStats.tiktok_avg_likes),
            ),
        },
        {
          accessor: "audienceStats.tiktok_avg_comments",
          label: "Comments (Average)",
          width: 220,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="tiktok" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Comments (Average)",
              formatCompact((row as Influencer).audienceStats.tiktok_avg_comments),
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
          accessor: "profiles.instagram_posts_count",
          label: "Post Count",
          width: 150,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "Instagram Post Count",
              formatCompact((row as Influencer).profiles.instagram_posts_count),
            ),
        },
        {
          accessor: "audienceStats.instagram_engagement_rate",
          label: "Engagement Rate (%)",
          width: 260,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "Instagram Engagement Rate",
              formatRate((row as Influencer).audienceStats.instagram_engagement_rate),
            ),
        },
        {
          accessor: "audienceStats.instagram_avg_reels_plays",
          label: "Reels Plays (Average)",
          width: 220,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "Instagram Reels Plays",
              formatCompact((row as Influencer).audienceStats.instagram_avg_reels_plays),
            ),
        },
        {
          accessor: "audienceStats.instagram_avg_likes",
          label: "Likes (Average)",
          width: 180,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "Instagram Likes (Average)",
              formatCompact((row as Influencer).audienceStats.instagram_avg_likes),
            ),
        },
        {
          accessor: "audienceStats.instagram_avg_comments",
          label: "Comments (Average)",
          width: 220,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="instagram" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "Instagram Comments (Average)",
              formatCompact((row as Influencer).audienceStats.instagram_avg_comments),
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
          accessor: "profiles.youtube_posts_count",
          label: "Video Count",
          width: 150,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "YouTube Video Count",
              formatCompact((row as Influencer).profiles.youtube_posts_count),
            ),
        },
        {
          accessor: "audienceStats.youtube_engagement_rate",
          label: "Engagement Rate (%)",
          width: 240,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "YouTube Engagement Rate",
              formatRate((row as Influencer).audienceStats.youtube_engagement_rate),
            ),
        },
        {
          accessor: "audienceStats.youtube_avg_views",
          label: "Views (Average)",
          width: 200,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "YouTube Views (Average)",
              formatCompact((row as Influencer).audienceStats.youtube_avg_views),
            ),
        },
        {
          accessor: "audienceStats.youtube_avg_likes",
          label: "Likes (Average)",
          width: 200,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "YouTube Likes (Average)",
              formatCompact((row as Influencer).audienceStats.youtube_avg_likes),
            ),
        },
        {
          accessor: "audienceStats.youtube_avg_comments",
          label: "Comments (Average)",
          width: 220,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: (props: HeaderRendererProps) => (
            <IconLabelHeader {...props} platform="youtube" />
          ),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "YouTube Comments (Average)",
              formatCompact((row as Influencer).audienceStats.youtube_avg_comments),
            ),
        },
      ],
    },
  ]);
}

/** Chartmetric sandbox loads ~26 rows per scroll fetch. */
const INITIAL_BATCH = 26;
const BATCH_SIZE = 26;
/** Simulated catalog size — footer shows loaded range of this total. */
const TOTAL_INFLUENCERS = 520;

function ChartmetricFooter({
  loaded,
  total,
  loading,
}: {
  loaded: number;
  total: number;
  loading: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        fontSize: 13,
        color: "#475569",
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        height: 49,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontWeight: 600 }}>
        Showing 1–{loaded} of {total.toLocaleString()} influencers
        {loading ? (
          <span style={{ fontWeight: 400, color: "#64748b", marginLeft: 8 }}>Loading…</span>
        ) : null}
      </span>
      <span style={{ color: "#64748b" }}>Chartmetric stress replica · infinite scroll</span>
    </div>
  );
}

function UnstableReproToolbar({
  flags,
  onChange,
  renderCount,
}: {
  flags: UnstableReproFlags;
  onChange: (next: UnstableReproFlags) => void;
  renderCount: number;
}) {
  const anyOn = flags.unstableColumns || flags.unstableRows || flags.forceParentRerenders;
  const toggle = (key: keyof UnstableReproFlags) => onChange({ ...flags, [key]: !flags[key] });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: anyOn ? "#fff7ed" : "#f8fafc",
        borderBottom: `1px solid ${anyOn ? "#fdba74" : "#e2e8f0"}`,
        fontSize: 13,
        color: "#334155",
        flexShrink: 0,
      }}
    >
      <span style={{ fontWeight: 700, color: anyOn ? "#9a3412" : "#0f172a" }}>Client repro</span>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={flags.unstableColumns}
          onChange={() => toggle("unstableColumns")}
        />
        Unstable columns
      </label>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={flags.unstableRows}
          onChange={() => toggle("unstableRows")}
        />
        Unstable rows
      </label>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={flags.forceParentRerenders}
          onChange={() => toggle("forceParentRerenders")}
        />
        Force parent re-renders ({PARENT_RERENDER_MS}ms)
      </label>
      <button
        type="button"
        onClick={() => onChange({ ...DEFAULT_REPRO_FLAGS })}
        style={{
          marginLeft: "auto",
          border: "1px solid #cbd5e1",
          background: "#fff",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
      <span style={{ color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
        renders: {renderCount}
      </span>
    </div>
  );
}

/**
 * Deep-clone header tree while preserving widths from `widthSource`.
 * Produces new objects + re-wraps renderers via buildHeaders — the classic
 * "columns defined inline / rebuilt from config every render" anti-pattern.
 */
function rebuildHeadersPreservingWidths(
  widthSource: readonly ReactColumnDef[],
): ReactColumnDef[] {
  const next = buildHeaders();
  return mergeHeaderWidths(next, widthSource);
}

/** Shallow-clone each row so `rows` is a new array of new object identities. */
function cloneRowsUnstable(rows: readonly InfluencerRow[]): InfluencerRow[] {
  return rows.map((row) => ({ ...row }));
}

/**
 * Exact Chartmetric influencers stress replica:
 * - Nested headers (~5560px main width, same accessors/widths as sandbox)
 * - React portals on every header + body cell
 * - Controlled headers via onColumnWidthChange
 * - autoExpandColumns
 * - enableColumnEditor + column reordering/resizing
 * - footerPosition top (49px)
 * - Infinite scroll: initial 26 rows, fetch +26 near bottom (onLoadMore)
 * - Skeleton placeholder rows at the bottom while the next page loads
 * - rowHeight 90, headerHeight 36 (72 when nested)
 * - Optional "Client repro" toggles for unstable column/row/parent refs
 */
const InfluencersDemo = ({ height, theme }: { height?: string | number | null; theme?: Theme }) => {
  const [rows, setRows] = useState<InfluencerRow[]>(() => generateInfluencerData(0, INITIAL_BATCH));
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState<ReactColumnDef[]>(() => buildHeaders());
  const [repro, setRepro] = useState<UnstableReproFlags>(DEFAULT_REPRO_FLAGS);
  const [, setParentTick] = useState(0);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  // Sync guard: React state alone can't block back-to-back onLoadMore ticks
  // between setLoading(true) and the next commit (same pattern as InfiniteScrollDemo).
  const loadingRef = useRef(false);
  const loadedCount = countLoadedRows(rows);
  const hasMore = loadedCount < TOTAL_INFLUENCERS;

  useEffect(() => {
    if (!repro.forceParentRerenders) return;
    const id = window.setInterval(() => {
      setParentTick((n) => n + 1);
    }, PARENT_RERENDER_MS);
    return () => window.clearInterval(id);
  }, [repro.forceParentRerenders]);

  const handleColumnWidthChange = useCallback((next: ReactColumnDef[]) => {
    setHeaders((prev) => mergeHeaderWidths(prev, next));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    // Show Chartmetric-style skeleton rows immediately, then swap in real data.
    setRows((prev) => {
      const loaded = countLoadedRows(prev);
      const remaining = TOTAL_INFLUENCERS - loaded;
      if (remaining <= 0) return prev;
      const batch = Math.min(BATCH_SIZE, remaining);
      const withoutSkeletons = prev.filter((row) => !isSkeletonRow(row));
      return [...withoutSkeletons, ...createSkeletonRows(loaded, batch)];
    });

    window.setTimeout(() => {
      setRows((prev) => {
        const withoutSkeletons = prev.filter((row) => !isSkeletonRow(row));
        const remaining = TOTAL_INFLUENCERS - withoutSkeletons.length;
        if (remaining <= 0) return withoutSkeletons;
        const batch = Math.min(BATCH_SIZE, remaining);
        return [...withoutSkeletons, ...generateInfluencerData(withoutSkeletons.length, batch)];
      });
      setLoading(false);
      loadingRef.current = false;
    }, 450);
  }, [hasMore]);

  const footerRenderer = useCallback(
    () => <ChartmetricFooter loaded={loadedCount} total={TOTAL_INFLUENCERS} loading={loading} />,
    [loadedCount, loading],
  );

  // --- Client-style unstable props (only when toggles are on) ---
  const tableHeaders = repro.unstableColumns ? rebuildHeadersPreservingWidths(headers) : headers;
  const tableRows = repro.unstableRows ? cloneRowsUnstable(rows) : rows;
  // Inline object/fn props: new identity every render (always), amplified by forceParentRerenders.
  const columnEditorConfig = {
    text: "All Columns",
    searchEnabled: true,
    searchPlaceholder: "Search columns",
  };
  const customTheme = { headerHeight: 36, rowHeight: 90 };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: formatTableHeight(height) }}>
      <UnstableReproToolbar
        flags={repro}
        onChange={setRepro}
        renderCount={renderCountRef.current}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SimpleTable
          columns={tableHeaders}
          rows={tableRows}
          getRowId={(p) => String((p.row as InfluencerRow | undefined)?.id)}
          height="100%"
          theme={theme}
          customTheme={customTheme}
          columnResizing
          columnReordering
          autoExpandColumns
          enableColumnEditor
          columnEditorConfig={columnEditorConfig}
          onLoadMore={handleLoadMore}
          infiniteScrollThreshold={200}
          footerPosition="top"
          footerRenderer={footerRenderer}
          onColumnWidthChange={handleColumnWidthChange}
        />
      </div>
    </div>
  );
};

export default InfluencersDemo;
