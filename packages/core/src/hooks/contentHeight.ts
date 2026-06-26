export interface ContentHeightConfig {
  height?: string | number;
  maxHeight?: string | number;
  rowHeight: number;
  shouldPaginate?: boolean;
  rowsPerPage?: number;
  totalRowCount: number;
  headerHeight?: number;
  footerHeight?: number;
  /**
   * Visible portion of the table inside an external scroll parent (in pixels).
   * Only consulted when neither `height` nor `maxHeight` is set; enables
   * virtualization driven by a window- or element-level scroller.
   */
  externalViewportHeight?: number;
}

/**
 * Resolves a single CSS length token (e.g. "120px", "50vh", "100%") to pixels.
 * Returns `null` when the token can't be resolved (unknown unit, or a `%` whose
 * parent height is unavailable), so callers can treat the whole expression as
 * unresolvable rather than silently substituting a wrong value.
 */
const resolveLengthToken = (token: string, container: Element | null): number | null => {
  const trimmed = token.trim();
  if (trimmed === "") return null;

  if (trimmed.endsWith("px")) {
    const value = parseFloat(trimmed);
    return Number.isFinite(value) ? value : null;
  }
  if (trimmed.endsWith("vh")) {
    const value = parseFloat(trimmed);
    return Number.isFinite(value) ? (window.innerHeight * value) / 100 : null;
  }
  if (trimmed.endsWith("vw")) {
    const value = parseFloat(trimmed);
    return Number.isFinite(value) ? (window.innerWidth * value) / 100 : null;
  }
  if (trimmed.endsWith("%")) {
    const percentage = parseFloat(trimmed);
    const parentHeight = container?.parentElement?.clientHeight;
    if (!Number.isFinite(percentage) || !parentHeight || parentHeight < 50) {
      return null; // Invalid parent height
    }
    return (parentHeight * percentage) / 100;
  }

  // A bare number (valid inside calc(), e.g. as a multiplier)
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : null;
};

/**
 * Evaluates a CSS `calc(...)` expression to pixels. Supports `+ - * /`,
 * parentheses, unary minus, and `px`/`vh`/`vw`/`%`/unitless terms. Returns
 * `null` if the expression is malformed or contains an unresolvable term.
 *
 * This mirrors what the browser does when it lays out the element, so the JS
 * scroll/virtualization math stays in sync with the CSS box size. Without it,
 * `calc(...)` values fell through to the unknown-format branch and were treated
 * as the full viewport height, so overflowing content was clipped instead of
 * given an inner scrollbar.
 */
const evaluateCalc = (expression: string, container: Element | null): number | null => {
  const tokens: string[] = [];
  for (let i = 0; i < expression.length; ) {
    const char = expression[i];
    if (char === " " || char === "\t" || char === "\n") {
      i++;
      continue;
    }
    if (char === "(" || char === ")" || char === "+" || char === "-" || char === "*" || char === "/") {
      tokens.push(char);
      i++;
      continue;
    }
    const match = /^\d*\.?\d+(px|vh|vw|%)?/.exec(expression.slice(i));
    if (!match) return null; // Unexpected character
    tokens.push(match[0]);
    i += match[0].length;
  }
  if (tokens.length === 0) return null;

  let pos = 0;
  let failed = false;

  const parseExpression = (): number => {
    let value = parseTerm();
    while (!failed && (tokens[pos] === "+" || tokens[pos] === "-")) {
      const operator = tokens[pos++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  };

  const parseTerm = (): number => {
    let value = parseFactor();
    while (!failed && (tokens[pos] === "*" || tokens[pos] === "/")) {
      const operator = tokens[pos++];
      const right = parseFactor();
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  };

  const parseFactor = (): number => {
    const token = tokens[pos];
    if (token === undefined) {
      failed = true;
      return 0;
    }
    if (token === "+") {
      pos++;
      return parseFactor();
    }
    if (token === "-") {
      pos++;
      return -parseFactor();
    }
    if (token === "(") {
      pos++;
      const value = parseExpression();
      if (tokens[pos] !== ")") {
        failed = true;
        return 0;
      }
      pos++;
      return value;
    }
    const resolved = resolveLengthToken(token, container);
    if (resolved === null) {
      failed = true;
      return 0;
    }
    pos++;
    return resolved;
  };

  const result = parseExpression();
  if (failed || pos !== tokens.length || !Number.isFinite(result)) return null;
  return result;
};

/**
 * Converts a height value (string or number) to pixels
 */
export const convertHeightToPixels = (
  heightValue: string | number,
  container: Element | null = document.querySelector(".simple-table-root"),
): number => {
  if (typeof heightValue === "string") {
    const trimmed = heightValue.trim();

    if (/^calc\(/i.test(trimmed) && trimmed.endsWith(")")) {
      const inner = trimmed.slice(trimmed.indexOf("(") + 1, -1);
      const resolved = evaluateCalc(inner, container);
      // Unresolvable calc() -> 0 disables virtualization rather than guessing the
      // full viewport height (the original clipping bug).
      return resolved === null ? 0 : Math.max(0, resolved);
    }

    if (trimmed.endsWith("px")) {
      return parseInt(trimmed, 10);
    } else if (trimmed.endsWith("vh")) {
      const vh = parseInt(trimmed, 10);
      return (window.innerHeight * vh) / 100;
    } else if (trimmed.endsWith("%")) {
      const percentage = parseInt(trimmed, 10);
      const parentHeight = container?.parentElement?.clientHeight;
      if (!parentHeight || parentHeight < 50) {
        return 0; // Invalid parent height
      }
      return (parentHeight * percentage) / 100;
    } else {
      // Fall back to inner height if format is unknown
      return window.innerHeight;
    }
  } else {
    return heightValue as number;
  }
};

/**
 * Calculates the content height for the table.
 * This is a pure function alternative to the useContentHeight hook.
 * 
 * @param config - Configuration for content height calculation
 * @returns The calculated content height in pixels, or undefined to disable virtualization
 */
export const calculateContentHeight = ({
  height,
  maxHeight,
  rowHeight,
  shouldPaginate,
  rowsPerPage,
  totalRowCount,
  headerHeight,
  footerHeight,
  externalViewportHeight,
}: ContentHeightConfig): number | undefined => {
  // If maxHeight is provided, it takes precedence over height
  if (maxHeight) {
    const maxHeightPx = convertHeightToPixels(maxHeight);

    // If conversion failed (e.g., invalid parent height for %), disable virtualization
    if (maxHeightPx === 0) {
      return undefined;
    }

    // Calculate actual content height needed
    const actualHeaderHeight = headerHeight || rowHeight;
    const actualFooterHeight = footerHeight || 0;
    const actualContentHeight =
      actualHeaderHeight + totalRowCount * rowHeight + actualFooterHeight;

    // If content fits within maxHeight, no scrolling needed
    if (actualContentHeight <= maxHeightPx) {
      return undefined;
    }

    // Content exceeds maxHeight - return scrollable area height
    return Math.max(0, maxHeightPx - actualHeaderHeight);
  }

  // External scroll mode: a consumer-supplied parent (element or window) drives
  // virtualization. Only kicks in when neither height nor maxHeight is set.
  if (externalViewportHeight !== undefined && externalViewportHeight > 0) {
    const actualHeaderHeight = headerHeight || rowHeight;
    return Math.max(0, externalViewportHeight - actualHeaderHeight);
  }

  // When no height is specified, return undefined to disable virtualization
  // This allows the table to grow naturally to fit all content (paginated or not)
  if (!height) return undefined;

  // Convert height to pixels
  const totalHeightPx = convertHeightToPixels(height);

  // If conversion failed, disable virtualization
  if (totalHeightPx === 0) {
    return undefined;
  }

  // Subtract header height
  return Math.max(0, totalHeightPx - rowHeight);
};

export default calculateContentHeight;
