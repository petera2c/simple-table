/**
 * Influencers headers – vanilla DOM port of React InfluencersDemo columns.
 * Includes excludeFromRender + width: 150 repro column (`id`).
 */
import type {
  CellRendererProps,
  ColumnDef,
  HeaderRendererProps,
} from "../../../src/index";
import {
  formatCompact,
  formatRate,
  getInfluencerThemeColors,
  type AudienceGender,
  type BreakdownItem,
  type FeaturedEntity,
  type Influencer,
  type TopVideo,
} from "./influencers-data";

type Style = Partial<CSSStyleDeclaration>;
type Child = string | number | Node | null | undefined;

function el(tag: string, style?: Style, children?: Child | Child[]): HTMLElement {
  const node = document.createElement(tag);
  if (style) Object.assign(node.style, style);
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined) continue;
    node.appendChild(
      typeof child === "string" || typeof child === "number"
        ? document.createTextNode(String(child))
        : child,
    );
  }
  return node;
}

const GENDER_COLORS = { f: "#7E84FA", m: "#0FB5AE" };

type SkeletonInfluencer = {
  id: string;
  __index__: number;
  __skeleton__: true;
};

export type InfluencerRow = Influencer | SkeletonInfluencer;

export function isSkeletonRow(row: unknown): row is SkeletonInfluencer {
  return Boolean(
    row &&
      typeof row === "object" &&
      "__skeleton__" in row &&
      (row as SkeletonInfluencer).__skeleton__,
  );
}

export function createSkeletonRows(startIndex: number, count: number): SkeletonInfluencer[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `skeleton-${startIndex + i + 1}`,
    __index__: startIndex + i + 1,
    __skeleton__: true as const,
  }));
}

export function countLoadedRows(rows: readonly InfluencerRow[]): number {
  return rows.reduce((n, row) => n + (isSkeletonRow(row) ? 0 : 1), 0);
}

function skeletonBar(
  width: string | number = "70%",
  height = 14,
  radius = 4,
  extra?: Style,
): HTMLElement {
  return el("div", {
    width: typeof width === "number" ? `${width}px` : width,
    height: `${height}px`,
    borderRadius: `${radius}px`,
    maxWidth: "100%",
    background:
      "linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)",
    backgroundSize: "200% 100%",
    ...extra,
  });
}

function skeletonForAccessor(accessor: string, align?: string): HTMLElement {
  if (accessor === "name") {
    return el(
      "div",
      { display: "flex", alignItems: "center", gap: "12px", width: "100%", minWidth: "0" },
      [
        skeletonBar(56, 56, 28, { flexShrink: "0" }),
        el("div", { flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }, [
          skeletonBar("55%", 14),
          skeletonBar("75%", 10),
        ]),
      ],
    );
  }
  if (accessor === "topContentsSummary" || accessor.startsWith("topVideo")) {
    const tiles = accessor === "topContentsSummary" ? 3 : 1;
    return el(
      "div",
      { display: "flex", alignItems: "center", gap: "8px", width: "100%" },
      Array.from({ length: tiles }, () => skeletonBar(48, 48, 6, { flexShrink: "0" })),
    );
  }
  if (accessor === "tracksFeatured" || accessor === "artistsFeatured") {
    return el(
      "div",
      { display: "flex", alignItems: "center", gap: "10px", width: "100%" },
      [
        skeletonBar(36, 36, accessor === "artistsFeatured" ? 18 : 6, { flexShrink: "0" }),
        el("div", { flex: "1", display: "flex", flexDirection: "column", gap: "6px" }, [
          skeletonBar("70%", 12),
          skeletonBar("45%", 10),
        ]),
      ],
    );
  }
  if (
    accessor === "audienceStats.gender" ||
    accessor === "audienceStats.code2" ||
    accessor === "audienceStats.language"
  ) {
    return el("div", { display: "flex", flexDirection: "column", gap: "8px", width: "100%" }, [
      skeletonBar("50%", 12),
      skeletonBar("100%", 9),
    ]);
  }
  return el(
    "div",
    {
      display: "flex",
      width: "100%",
      justifyContent:
        align === "right" || align === "center" ? align : "flex-start",
    },
    [skeletonBar(align === "center" ? "40%" : "65%")],
  );
}

function withSkeletonCell(
  accessor: string,
  align: string | undefined,
  renderer: (props: CellRendererProps) => HTMLElement | string,
): (props: CellRendererProps) => HTMLElement | string {
  return (props) => {
    if (isSkeletonRow(props.row)) return skeletonForAccessor(accessor, align);
    return renderer(props);
  };
}

function openSimpleModal(title: string, bodyHtml: string) {
  const existing = document.getElementById("st-influencers-modal");
  existing?.remove();

  const backdrop = el("div", {
    position: "fixed",
    inset: "0",
    background: "rgba(15, 23, 42, 0.45)",
    zIndex: "10000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  });
  backdrop.id = "st-influencers-modal";

  const dialog = el("div", {
    background: "#fff",
    borderRadius: "10px",
    maxWidth: "420px",
    width: "100%",
    padding: "20px 22px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
    color: "#0f172a",
  });

  const header = el(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
      gap: "12px",
    },
    [
      el("strong", { fontSize: "16px" }, title),
      (() => {
        const btn = el(
          "button",
          {
            border: "1px solid #cbd5e1",
            background: "#fff",
            borderRadius: "6px",
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "12px",
          },
          "Close",
        ) as HTMLButtonElement;
        btn.type = "button";
        btn.addEventListener("click", () => backdrop.remove());
        return btn;
      })(),
    ],
  );

  const body = el("div", { fontSize: "14px", lineHeight: "1.5", color: "#334155" });
  body.innerHTML = bodyHtml;

  dialog.append(header, body);
  backdrop.appendChild(dialog);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
  document.body.appendChild(backdrop);
}

function platformIcon(
  platform: "tiktok" | "instagram" | "youtube" | "chartmetric",
): HTMLElement {
  if (platform === "tiktok") {
    return el("span", {
      width: "14px",
      height: "14px",
      borderRadius: "3px",
      background: "linear-gradient(135deg, #fd355a 0%, #000 55%, #33f3ed 100%)",
      display: "inline-block",
      flexShrink: "0",
    });
  }
  if (platform === "instagram") {
    return el("span", {
      width: "14px",
      height: "14px",
      borderRadius: "4px",
      background: "radial-gradient(circle at 30% 110%, #fa8f21, #d82d7e 70%)",
      display: "inline-block",
      flexShrink: "0",
    });
  }
  if (platform === "youtube") {
    return el(
      "span",
      {
        width: "14px",
        height: "14px",
        borderRadius: "3px",
        background: "#eb3423",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: "0",
        color: "#fff",
        fontSize: "7px",
        fontWeight: "800",
        lineHeight: "1",
      },
      "▶",
    );
  }
  return el("span", {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
    background: "linear-gradient(180deg, #00fff2, #00ffb2)",
    display: "inline-block",
    flexShrink: "0",
  });
}

function headerChrome(
  props: HeaderRendererProps,
  leading?: HTMLElement,
  align: "start" | "center" | "end" = "start",
): HTMLElement {
  const { header, components } = props;
  const left = el("div", {
    display: "flex",
    alignItems: "center",
    justifyContent:
      align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
    gap: "6px",
    flex: "1",
    minWidth: "0",
  });

  if (leading) left.appendChild(leading);

  const label = components?.labelContent;
  if (label instanceof HTMLElement) {
    left.appendChild(label);
  } else {
    left.appendChild(
      el(
        "span",
        {
          fontWeight: "600",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        String(header.label),
      ),
    );
  }

  const wrap = el(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      gap: "6px",
      minWidth: "0",
      padding: "0 2px",
    },
    [left],
  );

  if (components?.filterIcon instanceof HTMLElement) wrap.appendChild(components.filterIcon);
  if (components?.sortIcon instanceof HTMLElement) wrap.appendChild(components.sortIcon);
  return wrap;
}

function iconLabelHeader(
  platform: "tiktok" | "instagram" | "youtube" | "chartmetric",
) {
  return (props: HeaderRendererProps) =>
    headerChrome(props, platformIcon(platform), "start");
}

function iconOnlyHeader(platform: "tiktok" | "instagram" | "youtube") {
  return (props: HeaderRendererProps) =>
    headerChrome(props, platformIcon(platform), "center");
}

function defaultHeaderWithMenu(props: HeaderRendererProps) {
  return headerChrome(props);
}

function metricCell(label: string, value: string): HTMLElement {
  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "2px",
      width: "100%",
    },
    [
      el("span", { fontSize: "11px", color: "#64748b" }, label),
      el("span", { fontWeight: "600", color: "#0f172a" }, value || "—"),
    ],
  );
}

function influencerCell({ row, theme }: CellRendererProps): HTMLElement {
  const colors = getInfluencerThemeColors(theme);
  const r = row as Influencer;
  const meta = [r.country, r.role, [r.gender, r.ageRange].filter(Boolean).join(" · ")]
    .filter(Boolean)
    .join(" · ");

  const openProfile = () => {
    openSimpleModal(
      r.name,
      `<p style="margin-top:0">${r.role} · ${r.category} · ${r.niche}</p>
       <p>${r.countryFlag} ${r.country} · Score ${r.ranks.score_100}</p>
       <p style="color:#64748b">Chartmetric opens influencer drawers / modals from the identity cell.</p>`,
    );
  };

  const avatar = el(
    "button",
    {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      backgroundColor: r.avatarColor,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "18px",
      flexShrink: "0",
      border: "none",
      cursor: "pointer",
      padding: "0",
    },
    r.name.charAt(0).toUpperCase(),
  ) as HTMLButtonElement;
  avatar.type = "button";
  avatar.title = `Open profile · ${r.name}`;
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    openProfile();
  });

  const nameBtn = el(
    "button",
    {
      all: "unset",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      color: colors.text,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "100%",
    },
    r.name,
  ) as HTMLButtonElement;
  nameBtn.type = "button";
  nameBtn.title = `${r.name} · ${r.role}`;
  nameBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openProfile();
  });

  const tags = el(
    "div",
    { display: "flex", gap: "6px", overflow: "hidden", alignItems: "center" },
    [
      ...[r.category, r.niche].map((tag) =>
        el(
          "span",
          {
            fontSize: "12px",
            lineHeight: "1.2",
            padding: "2px 6px",
            borderRadius: "4px",
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.chipBg,
            color: colors.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "140px",
          },
          tag,
        ),
      ),
      el(
        "span",
        {
          fontSize: "12px",
          lineHeight: "1.2",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "0.5px solid rgba(0,0,0,0.4)",
          backgroundColor: "#e8f3f1",
          color: colors.text,
          whiteSpace: "nowrap",
          flexShrink: "0",
        },
        "All",
      ),
    ],
  );

  const viewProfile = el(
    "button",
    {
      all: "unset",
      cursor: "pointer",
      color: "#0d9488",
      fontSize: "12px",
      fontWeight: "600",
      width: "fit-content",
    },
    "View profile",
  ) as HTMLButtonElement;
  viewProfile.type = "button";
  viewProfile.addEventListener("click", (e) => {
    e.stopPropagation();
    openProfile();
  });

  return el(
    "div",
    {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      width: "100%",
      minWidth: "0",
    },
    [
      avatar,
      el("div", { minWidth: "0", flex: "1", display: "flex", flexDirection: "column", gap: "4px" }, [
        nameBtn,
        tags,
        el(
          "div",
          {
            fontSize: "12px",
            color: colors.muted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          `${r.countryFlag} ${meta}`,
        ),
        viewProfile,
      ]),
    ],
  );
}

function topVideoThumb(
  video: TopVideo,
  colors: ReturnType<typeof getInfluencerThemeColors>,
): HTMLElement {
  const badge =
    video.platform === "tiktok" ? "TT" : video.platform === "instagram" ? "IG" : "YT";
  return el(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      minWidth: "44px",
    },
    [
      el(
        "div",
        {
          width: "42px",
          height: "48px",
          borderRadius: "8px",
          background: `linear-gradient(145deg, ${video.color}cc, ${video.color}66)`,
          position: "relative",
          overflow: "hidden",
          flexShrink: "0",
        },
        [
          el(
            "span",
            {
              position: "absolute",
              bottom: "3px",
              right: "3px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              fontWeight: "700",
              color: "#111",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            },
            badge,
          ),
        ],
      ),
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          color: colors.text,
          fontWeight: "500",
        },
        `${video.metricLabel === "likes" ? "♥" : "👁"} ${video.metric}`,
      ),
    ],
  );
}

function topVideosCell({ row, theme }: CellRendererProps): HTMLElement {
  const colors = getInfluencerThemeColors(theme);
  const all = (row as Influencer).topContents;
  const videos = all.slice(0, 3);

  const viewAll = el(
    "button",
    {
      all: "unset",
      cursor: "pointer",
      color: "#0d9488",
      fontSize: "12px",
      fontWeight: "600",
      whiteSpace: "nowrap",
    },
    "View all",
  ) as HTMLButtonElement;
  viewAll.type = "button";
  viewAll.addEventListener("click", (e) => {
    e.stopPropagation();
    openSimpleModal(
      "Top Videos",
      `<ul style="margin:0;padding-left:18px">${all
        .map(
          (v, i) =>
            `<li style="margin-bottom:6px">#${i + 1} ${v.platform} — ${v.metricLabel} ${v.metric}</li>`,
        )
        .join("")}</ul>`,
    );
  });

  return el(
    "div",
    { display: "flex", gap: "10px", alignItems: "center", width: "100%" },
    [
      ...videos.map((video) => {
        const btn = el("button", { all: "unset", cursor: "pointer" }, [
          topVideoThumb(video, colors),
        ]) as HTMLButtonElement;
        btn.type = "button";
        btn.title = `${video.platform} · ${video.metricLabel} ${video.metric}`;
        btn.addEventListener("click", (e) => e.stopPropagation());
        return btn;
      }),
      viewAll,
    ],
  );
}

function singleTopVideoCell(index: number) {
  return ({ row, theme }: CellRendererProps): HTMLElement => {
    const colors = getInfluencerThemeColors(theme);
    const video = (row as Influencer).topContents[index];
    if (!video) return el("span", { color: colors.muted }, "—");

    const btn = el("button", { all: "unset", cursor: "pointer" }, [
      topVideoThumb(video, colors),
    ]) as HTMLButtonElement;
    btn.type = "button";
    btn.title = `#${index + 1} ${video.platform} · ${video.metric}`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSimpleModal(
        `#${index + 1} Top Video`,
        `<p style="margin-top:0">${video.platform} — ${video.metricLabel} ${video.metric}</p>`,
      );
    });
    return btn;
  };
}

function featuredEntityCell(
  entity: FeaturedEntity | null,
  theme: string | undefined,
  kind: string,
  round?: boolean,
): HTMLElement {
  const colors = getInfluencerThemeColors(theme);
  if (!entity) return el("span", { color: colors.muted }, "—");

  const viewAll = el(
    "button",
    {
      all: "unset",
      cursor: "pointer",
      color: "#0d9488",
      fontSize: "12px",
      fontWeight: "600",
      width: "fit-content",
    },
    "View all",
  ) as HTMLButtonElement;
  viewAll.type = "button";
  viewAll.addEventListener("click", (e) => {
    e.stopPropagation();
    openSimpleModal(
      kind,
      `<p style="margin-top:0"><strong>${entity.name}</strong>${
        entity.subtitle ? ` — ${entity.subtitle}` : ""
      }</p><p style="color:#64748b">Chartmetric opens a full featured-content browser from this cell.</p>`,
    );
  });

  return el(
    "div",
    { display: "flex", flexDirection: "column", gap: "6px", width: "100%", minWidth: "0" },
    [
      el(
        "div",
        { display: "flex", alignItems: "center", gap: "8px", minWidth: "0", width: "100%" },
        [
          el("div", {
            width: round ? "28px" : "32px",
            height: round ? "28px" : "32px",
            borderRadius: round ? "50%" : "6px",
            backgroundColor: entity.color,
            flexShrink: "0",
          }),
          el(
            "div",
            {
              fontSize: "13px",
              fontWeight: "500",
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: "0",
            },
            entity.subtitle
              ? [
                  entity.name,
                  el("span", { color: colors.muted, fontWeight: "400" }, ` — ${entity.subtitle}`),
                ]
              : entity.name,
          ),
        ],
      ),
      viewAll,
    ],
  );
}

function breakdownCell(item: BreakdownItem, theme: string | undefined, title: string): HTMLElement {
  const colors = getInfluencerThemeColors(theme);
  const viewAll = el(
    "button",
    {
      all: "unset",
      cursor: "pointer",
      color: "#0d9488",
      fontSize: "12px",
      fontWeight: "600",
      width: "fit-content",
    },
    "View all",
  ) as HTMLButtonElement;
  viewAll.type = "button";
  viewAll.addEventListener("click", (e) => {
    e.stopPropagation();
    openSimpleModal(
      title,
      `<p style="margin-top:0">Top: ${item.flag ? `${item.flag} ` : ""}${item.label} (${item.percent}%)</p>
       <p style="color:#64748b">Full audience breakdown modal replica.</p>`,
    );
  });

  return el("div", { display: "flex", flexDirection: "column", gap: "6px", width: "100%" }, [
    el(
      "div",
      {
        display: "flex",
        justifyContent: "space-between",
        gap: "8px",
        fontSize: "13px",
        color: colors.text,
      },
      [
        el(
          "span",
          { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
          `${item.flag ? `${item.flag} ` : ""}${item.label}`,
        ),
        el("span", { fontWeight: "600", flexShrink: "0" }, `${item.percent}%`),
      ],
    ),
    el(
      "div",
      {
        width: "100%",
        height: "6px",
        borderRadius: "4px",
        backgroundColor: colors.border,
        overflow: "hidden",
      },
      [
        el("div", {
          width: `${item.percent}%`,
          height: "100%",
          borderRadius: "4px",
          backgroundColor: "#0d9488",
        }),
      ],
    ),
    viewAll,
  ]);
}

function audienceGenderCell({ row, theme }: CellRendererProps): HTMLElement {
  const colors = getInfluencerThemeColors(theme);
  const gender = (row as Influencer).audienceStats.gender as AudienceGender;

  const open = () =>
    openSimpleModal(
      "Audience Gender",
      `<p style="margin-top:0">Female ${gender.f}% · Male ${gender.m}%</p>
       <p style="color:#64748b">Full gender breakdown modal replica.</p>`,
    );

  const total = gender.f + gender.m || 1;
  const bar = el(
    "div",
    {
      display: "flex",
      width: "100%",
      height: "9px",
      borderRadius: "4px",
      overflow: "hidden",
      gap: "2px",
      marginTop: "6px",
    },
    [
      el("div", {
        width: `${(gender.f / total) * 100}%`,
        backgroundColor: GENDER_COLORS.f,
        borderRadius: "3px",
        minWidth: gender.f > 0 ? "2px" : "0",
      }),
      el("div", {
        width: `${(gender.m / total) * 100}%`,
        backgroundColor: GENDER_COLORS.m,
        borderRadius: "3px",
        minWidth: gender.m > 0 ? "2px" : "0",
      }),
    ],
  );

  const clickable = el("button", {
    all: "unset",
    cursor: "pointer",
    display: "block",
    width: "100%",
  }) as HTMLButtonElement;
  clickable.type = "button";
  clickable.title = `Female ${gender.f}% · Male ${gender.m}%`;
  clickable.addEventListener("click", (e) => {
    e.stopPropagation();
    open();
  });
  clickable.append(
    el("div", { display: "flex", gap: "16px", marginBottom: "2px" }, [
      el("div", { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: colors.muted }, [
        el("span", {
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: GENDER_COLORS.f,
        }),
        `F: `,
        el("span", { color: colors.text, fontWeight: "600" }, `${gender.f}%`),
      ]),
      el("div", { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: colors.muted }, [
        el("span", {
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: GENDER_COLORS.m,
        }),
        `M: `,
        el("span", { color: colors.text, fontWeight: "600" }, `${gender.m}%`),
      ]),
    ]),
    bar,
  );

  const viewAll = el(
    "button",
    {
      all: "unset",
      cursor: "pointer",
      color: "#0d9488",
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "6px",
      display: "inline-block",
    },
    "View All",
  ) as HTMLButtonElement;
  viewAll.type = "button";
  viewAll.addEventListener("click", (e) => {
    e.stopPropagation();
    open();
  });

  return el("div", { width: "100%", minWidth: "0" }, [clickable, viewAll]);
}

function scoreCell({ row, theme }: CellRendererProps): HTMLElement {
  const colors = getInfluencerThemeColors(theme);
  const score = (row as Influencer).ranks.score_100;

  const btn = el(
    "button",
    {
      all: "unset",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "8px",
      width: "100%",
      cursor: "pointer",
    },
    [
      el(
        "div",
        {
          width: "36px",
          height: "8px",
          borderRadius: "4px",
          backgroundColor: colors.border,
          overflow: "hidden",
        },
        [
          el("div", {
            width: `${score}%`,
            height: "100%",
            borderRadius: "4px",
            background: "linear-gradient(90deg, #00fff2, #00ffb2)",
          }),
        ],
      ),
      el(
        "span",
        { fontWeight: "600", color: colors.text, minWidth: "24px", textAlign: "right" },
        String(score),
      ),
    ],
  ) as HTMLButtonElement;
  btn.type = "button";
  btn.title = `Chartmetric Score ${score}/100 — click for details`;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openSimpleModal(
      "Chartmetric Score",
      `<p style="margin-top:0">Score: <strong>${score}</strong> / 100</p>
       <p style="color:#64748b">Score breakdown modal replica.</p>`,
    );
  });
  return btn;
}

function withHeaderMenus(headers: readonly ColumnDef[]): ColumnDef[] {
  return headers.map((header) => {
    const children = header.children ? withHeaderMenus(header.children) : undefined;
    const cellRenderer = header.cellRenderer
      ? withSkeletonCell(
          String(header.accessor),
          header.align,
          header.cellRenderer as (props: CellRendererProps) => HTMLElement | string,
        )
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
      headerRenderer: defaultHeaderWithMenu,
      ...(children ? { children } : {}),
      ...(cellRenderer ? { cellRenderer } : {}),
    };
  });
}

/**
 * Headers mirrored from sandbox3.chartmetric.com/influencers DOM.
 * Includes accidental production case: `id` has excludeFromRender + width: 150.
 */
export function buildInfluencerHeaders(): ColumnDef[] {
  const topVideoChildren: ColumnDef[] = [
    {
      accessor: "topContentsSummary",
      label: "Top Videos",
      width: 280,
      type: "string",
      showWhen: "parentCollapsed",
      cellRenderer: topVideosCell,
    },
    ...([1, 2, 3, 4, 5] as const).map((n) => ({
      accessor: `topVideo${n}`,
      label: `#${n} Top Video`,
      width: 100,
      type: "string" as const,
      showWhen: "parentExpanded" as const,
      cellRenderer: singleTopVideoCell(n - 1),
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
      cellRenderer: influencerCell,
    },
    // Repro: excluded from render but still has a width (as seen in Chartmetric).
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
      headerRenderer: iconLabelHeader("chartmetric"),
      cellRenderer: scoreCell,
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
          headerRenderer: iconOnlyHeader("tiktok"),
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
          headerRenderer: iconOnlyHeader("youtube"),
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
          headerRenderer: iconOnlyHeader("instagram"),
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
          cellRenderer: ({ row, theme }: CellRendererProps) =>
            featuredEntityCell(
              (row as Influencer).tracksFeatured,
              theme,
              "Tracks Featured",
            ),
        },
        {
          accessor: "artistsFeatured",
          label: "Artists Featured",
          width: 200,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) =>
            featuredEntityCell(
              (row as Influencer).artistsFeatured,
              theme,
              "Artists Featured",
              true,
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
          cellRenderer: ({ row, theme }: CellRendererProps) =>
            breakdownCell(
              (row as Influencer).audienceLocation,
              theme,
              "Audience Location",
            ),
        },
        {
          accessor: "audienceStats.language",
          label: "Audience Language",
          width: 300,
          type: "string",
          cellRenderer: ({ row, theme }: CellRendererProps) =>
            breakdownCell(
              (row as Influencer).audienceLanguage,
              theme,
              "Audience Language",
            ),
        },
        {
          accessor: "audienceStats.gender",
          label: "Audience Gender",
          width: 300,
          type: "string",
          cellRenderer: audienceGenderCell,
        },
      ],
    },
    {
      accessor: "tiktokStats",
      label: "Stats",
      width: 1010,
      type: "string",
      headerRenderer: iconLabelHeader("tiktok"),
      children: [
        {
          accessor: "profiles.tiktok_posts_count",
          label: "Post Count",
          width: 150,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: iconLabelHeader("tiktok"),
          cellRenderer: ({ row }: CellRendererProps) =>
            metricCell(
              "TikTok Post Count",
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
          headerRenderer: iconLabelHeader("tiktok"),
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
          headerRenderer: iconLabelHeader("tiktok"),
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
          headerRenderer: iconLabelHeader("tiktok"),
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
          headerRenderer: iconLabelHeader("tiktok"),
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
      headerRenderer: iconLabelHeader("instagram"),
      children: [
        {
          accessor: "profiles.instagram_posts_count",
          label: "Post Count",
          width: 150,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: iconLabelHeader("instagram"),
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
          headerRenderer: iconLabelHeader("instagram"),
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
          headerRenderer: iconLabelHeader("instagram"),
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
          headerRenderer: iconLabelHeader("instagram"),
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
          headerRenderer: iconLabelHeader("instagram"),
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
      headerRenderer: iconLabelHeader("youtube"),
      children: [
        {
          accessor: "profiles.youtube_posts_count",
          label: "Video Count",
          width: 150,
          type: "number",
          sortable: true,
          align: "right",
          headerRenderer: iconLabelHeader("youtube"),
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
          headerRenderer: iconLabelHeader("youtube"),
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
          headerRenderer: iconLabelHeader("youtube"),
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
          headerRenderer: iconLabelHeader("youtube"),
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
          headerRenderer: iconLabelHeader("youtube"),
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
