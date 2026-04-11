import { SimpleTable } from "@simple-table/solid";
import type { Theme, FooterRendererProps } from "@simple-table/solid";
import { footerRendererConfig } from "@simple-table/examples-shared";
import { For } from "solid-js";
import "@simple-table/solid/styles.css";

function getFooterColors(theme?: Theme) {
  const isModernDark = theme === "modern-dark";
  const isDark = theme === "dark" || isModernDark;
  const isModernLight = theme === "modern-light";
  const isLight = theme === "light" || isModernLight;

  if (isModernDark)
    return {
      background: "#1f2937", border: "#374151", text: "#d1d5db",
      buttonBg: "#374151", buttonBorder: "#4b5563", buttonActive: "#3b82f6",
      buttonText: "#d1d5db", buttonDisabled: "#6b7280",
    };
  if (isDark)
    return {
      background: "#1f2937", border: "#374151", text: "#e5e7eb",
      buttonBg: "#374151", buttonBorder: "#4b5563", buttonActive: "#3b82f6",
      buttonText: "#d1d5db", buttonDisabled: "#6b7280",
    };
  if (isLight)
    return {
      background: "white", border: "#f3f4f6", text: "#6b7280",
      buttonBg: "white", buttonBorder: "#e5e7eb", buttonActive: "#3b82f6",
      buttonText: "#374151", buttonDisabled: "#d1d5db",
    };
  return {
    background: "#f8fafc", border: "#e2e8f0", text: "#475569",
    buttonBg: "white", buttonBorder: "#e2e8f0", buttonActive: "#3b82f6",
    buttonText: "#64748b", buttonDisabled: "#cbd5e1",
  };
}

export default function FooterRendererDemo(props: { height?: string | number; theme?: Theme }) {
  const c = getFooterColors(props.theme);
  const pages = (totalPages: number) => Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <SimpleTable
      defaultHeaders={footerRendererConfig.headers}
      rows={footerRendererConfig.rows}
      shouldPaginate={true}
      rowsPerPage={10}
      height={props.height ?? "400px"}
      theme={props.theme}
      footerRenderer={(fp: FooterRendererProps) => (
        <div
          style={{
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            padding: "16px 20px",
            "background-color": c.background,
            "border-top": `2px solid ${c.border}`,
          }}
        >
          <div style={{ display: "flex", "align-items": "center", gap: "12px" }}>
            <span style={{ "font-size": "14px", "font-weight": "600", color: c.text }}>
              Showing {fp.startRow}-{fp.endRow} of {fp.totalRows} items
            </span>
          </div>

          <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
            <button
              onClick={fp.onPrevPage}
              disabled={!fp.hasPrevPage}
              style={{
                padding: "8px 16px", "font-size": "14px", "font-weight": "500",
                color: fp.hasPrevPage ? c.buttonActive : c.buttonDisabled,
                "background-color": c.buttonBg, border: `1px solid ${c.buttonBorder}`,
                "border-radius": "6px",
                cursor: fp.hasPrevPage ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Previous
            </button>

            <div style={{ display: "flex", gap: "4px" }}>
              <For each={pages(fp.totalPages)}>
                {(page) => (
                  <button
                    onClick={() => fp.onPageChange(page)}
                    style={{
                      padding: "8px 12px", "font-size": "14px", "font-weight": "500",
                      color: fp.currentPage === page ? "white" : c.buttonText,
                      "background-color": fp.currentPage === page ? c.buttonActive : c.buttonBg,
                      border: `1px solid ${c.buttonBorder}`, "border-radius": "6px",
                      cursor: "pointer", transition: "all 0.2s", "min-width": "40px",
                    }}
                  >
                    {page}
                  </button>
                )}
              </For>
            </div>

            <button
              onClick={() => fp.onNextPage()}
              disabled={!fp.hasNextPage}
              style={{
                padding: "8px 16px", "font-size": "14px", "font-weight": "500",
                color: fp.hasNextPage ? c.buttonActive : c.buttonDisabled,
                "background-color": c.buttonBg, border: `1px solid ${c.buttonBorder}`,
                "border-radius": "6px",
                cursor: fp.hasNextPage ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    />
  );
}
