import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faAngleLeft,
  faAngleRight,
  faSortDown,
  faSortUp,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import {
  DownOutlined as AntDownOutlined,
  RightOutlined as AntRightOutlined,
  LeftOutlined as AntLeftOutlined,
  CaretDownOutlined as AntCaretDownOutlined,
  CaretUpOutlined as AntCaretUpOutlined,
  FilterOutlined as AntFilterOutlined,
} from "@ant-design/icons";
import type { ReactIconsConfig } from "@simple-table/react";

export type IconLibrary = "default" | "fontawesome" | "mui" | "antd";

/**
 * Material Design icon paths (same as @mui/icons-material). We use inline SVG strings
 * instead of MUI components because SimpleTable serializes icons with renderToStaticMarkup
 * and injects them via innerHTML: MUI emits a sibling Emotion style tag for sizing while
 * the svg has no width/height, so the style is lost and the glyph is invisible.
 */
function muiMaterialSvg(pathD: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" focusable="false" aria-hidden="true"><path d="${pathD}"/></svg>`;
}

const MUI_PATHS = {
  expandMore: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z",
  filterList: "M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z",
  chevronRight: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  unfoldMore:
    "M12 5.83 15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15z",
  navigateBefore: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  navigateNext: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  arrowDownward: "m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z",
  arrowUpward: "m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z",
} as const;

export function getTableIcons(library: IconLibrary): ReactIconsConfig {
  if (library === "default") {
    return {};
  }

  if (library === "fontawesome") {
    return {
      expand: <FontAwesomeIcon icon={faChevronDown} />,
      filter: <FontAwesomeIcon icon={faFilter} />,
      headerCollapse: <FontAwesomeIcon icon={faChevronRight} />,
      headerExpand: <FontAwesomeIcon icon={faChevronDown} />,
      next: <FontAwesomeIcon icon={faAngleRight} />,
      prev: <FontAwesomeIcon icon={faAngleLeft} />,
      sortDown: <FontAwesomeIcon icon={faSortDown} />,
      sortUp: <FontAwesomeIcon icon={faSortUp} />,
    };
  }

  if (library === "mui") {
    return {
      expand: muiMaterialSvg(MUI_PATHS.expandMore),
      filter: muiMaterialSvg(MUI_PATHS.filterList),
      headerCollapse: muiMaterialSvg(MUI_PATHS.chevronRight),
      headerExpand: muiMaterialSvg(MUI_PATHS.unfoldMore),
      next: muiMaterialSvg(MUI_PATHS.navigateNext),
      prev: muiMaterialSvg(MUI_PATHS.navigateBefore),
      sortDown: muiMaterialSvg(MUI_PATHS.arrowDownward),
      sortUp: muiMaterialSvg(MUI_PATHS.arrowUpward),
    };
  }

  if (library === "antd") {
    return {
      expand: <AntDownOutlined />,
      filter: <AntFilterOutlined />,
      headerCollapse: <AntRightOutlined />,
      headerExpand: <AntDownOutlined />,
      next: <AntRightOutlined />,
      prev: <AntLeftOutlined />,
      sortDown: <AntCaretDownOutlined />,
      sortUp: <AntCaretUpOutlined />,
    };
  }

  return {};
}
