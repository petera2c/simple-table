import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * Interactive chrome for the influencers stress demo.
 * Intentionally heavier than plain text: hover tooltips + click modals are
 * portaled to document.body (extra React work per cell on scroll/hover).
 */

const overlayRoot = () => document.body;

type TooltipState = { x: number; y: number; content: ReactNode } | null;

export function CmTooltip({
  content,
  children,
  delayMs = 120,
}: {
  content: ReactNode;
  children: ReactNode;
  delayMs?: number;
}) {
  const [tip, setTip] = useState<TooltipState>(null);
  const timer = useRef<number | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const clear = useCallback(() => {
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = null;
    setTip(null);
  }, []);

  useEffect(() => () => clear(), [clear]);

  return (
    <>
      <span
        ref={wrapRef}
        style={{ display: "inline-flex", maxWidth: "100%" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          if (timer.current != null) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => {
            const rect = (el.firstElementChild as HTMLElement | null)?.getBoundingClientRect?.()
              ?? el.getBoundingClientRect();
            setTip({
              x: rect.left + rect.width / 2,
              y: rect.top,
              content,
            });
          }, delayMs);
        }}
        onMouseLeave={clear}
        onFocus={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setTip({ x: rect.left + rect.width / 2, y: rect.top, content });
        }}
        onBlur={clear}
      >
        {children}
      </span>
      {tip
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: "fixed",
                left: tip.x,
                top: tip.y - 8,
                transform: "translate(-50%, -100%)",
                zIndex: 10000,
                maxWidth: 280,
                padding: "8px 10px",
                borderRadius: 8,
                background: "#111827",
                color: "#f9fafb",
                fontSize: 12,
                lineHeight: 1.4,
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                pointerEvents: "none",
              }}
            >
              {tip.content}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -5,
                  width: 10,
                  height: 10,
                  background: "#111827",
                  transform: "translateX(-50%) rotate(45deg)",
                }}
              />
            </div>,
            overlayRoot(),
          )
        : null}
    </>
  );
}

export function CmModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 11000,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          width: "min(480px, 100%)",
          maxHeight: "80vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 id={titleId} style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "#f1f5f9",
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>,
    overlayRoot(),
  );
}

export function CmLinkButton({
  children,
  onClick,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{
        alignSelf: "flex-start",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        color: "#0f766e",
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Metric cell: tooltip + click opens details modal. */
export function CmMetricCell({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const display = value || "—";

  return (
    <>
      <CmTooltip
        content={
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div>{display}</div>
            <div style={{ opacity: 0.75, marginTop: 4 }}>Click for details</div>
          </div>
        }
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          style={{
            all: "unset",
            cursor: "pointer",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 600,
            color: "#0f172a",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {display}
          <span style={{ fontSize: 10, color: "#94a3b8" }} aria-hidden>
            ▾
          </span>
        </button>
      </CmTooltip>
      <CmModal open={open} title={label} onClose={() => setOpen(false)}>
        {detail ?? (
          <>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Value:</strong> {display}
            </p>
            <p style={{ margin: 0, color: "#64748b" }}>
              Metric cells open a richer breakdown / deep-link modal. This demo keeps a portaled
              dialog mounted from the cell renderer tree.
            </p>
          </>
        )}
      </CmModal>
    </>
  );
}

export function CmViewAllButton({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CmLinkButton onClick={() => setOpen(true)}>View All</CmLinkButton>
      <CmModal open={open} title={title} onClose={() => setOpen(false)}>
        {children}
      </CmModal>
    </>
  );
}

type MenuItem = { label: string; onSelect?: () => void };

/** Header ⋮ menu portaled to body. */
export function CmHeaderMenuButton({
  label,
  items,
}: {
  label: string;
  items?: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const menuItems: MenuItem[] = items ?? [
    { label: "Sort ascending" },
    { label: "Sort descending" },
    { label: "Pin column" },
    { label: "Hide column" },
    { label: "Autosize" },
  ];

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: Math.min(r.left, window.innerWidth - 200) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`${label} column menu`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
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
      {open
        ? createPortal(
            <>
              <div
                role="presentation"
                style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                onMouseDown={() => setOpen(false)}
              />
              <div
                role="menu"
                style={{
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                  zIndex: 9999,
                  minWidth: 180,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  padding: 4,
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  {label}
                </div>
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onSelect?.();
                      setOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      padding: "8px 10px",
                      fontSize: 13,
                      color: "#0f172a",
                      cursor: "pointer",
                      borderRadius: 6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>,
            overlayRoot(),
          )
        : null}
    </>
  );
}
