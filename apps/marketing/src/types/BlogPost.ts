type BlogContentType =
  | "title"
  | "paragraph"
  | "list"
  | "card"
  | "section"
  | "row"
  | "col"
  | "codeBlock"
  | "space"
  | "text"
  | "divider"
  | "alert"
  | "table"
  | "tag"
  | "button"
  | "icon"
  | "progressBar"
  | "heroSection"
  | "callToAction"
  | "featureItem"
  | "container"
  | "performanceDemo";

export type BlogContentItem = {
  align?: "left" | "center" | "right";
  alertType?: "success" | "info" | "warning" | "error";
  barClassName?: string;
  block?: boolean;
  bordered?: boolean;
  buttonType?: "primary" | "dashed" | "link" | "text" | "default";
  children?: BlogContentItem[];
  className?: string;
  code?: string;
  colorClassName?: string;
  columns?: any[];
  dataSource?: any[];
  description?: string;
  descriptionClassName?: string;
  direction?: "vertical" | "horizontal";
  ghost?: boolean;
  gutter?: [number, number] | number;
  headStyle?: React.CSSProperties;
  href?: string;
  icon?: BlogContentItem;
  iconClassName?: string;
  iconType?: "antd" | "fontAwesome";
  id?: string;
  isNextLink?: boolean;
  items?: string[];
  language?: string;
  level?: 1 | 2 | 3 | 4 | 5;
  message?: string;
  name?: string;
  onClick?: () => void;
  pagination?: boolean | object;
  percentage?: string;
  preClassName?: string;
  rowClassName?: string;
  scroll?: { x?: string | number | true; y?: string | number };
  sections?: {
    title: string;
    items: string[];
  }[];
  showIcon?: boolean;
  size?: "small" | "middle" | "large";
  span?: number;
  strong?: boolean;
  style?: React.CSSProperties;
  target?: string;
  text?: string;
  textType?: "secondary" | "success" | "warning" | "danger";
  title?: string;
  titleContent?: BlogContentItem;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  type: BlogContentType;
  wrapperClassName?: string;
  // Responsive column widths
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;

  // Performance Demo specific properties
  headers?: any[];
  height?: string | number;
  initialRowCount?: number;
  dataCategories?: string[];
  maxDealValue?: number;
  minDealValue?: number;
  maxProfit?: number;
  minProfit?: number;
  buttonVariants?: {
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    extraLarge?: boolean;
  };
  buttonColors?: {
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  showGenerationTime?: boolean;
  demoClassName?: string;
  hideTable?: boolean;
};

export type BlogPost = {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  metadata: {
    keywords: string[];
    openGraph: {
      title: string;
      description: string;
      type: "article";
      publishedTime: string;
      authors: string[];
    };
    twitter: {
      card: "summary_large_image";
      title: string;
      description: string;
    };
  };
  content: BlogContentItem[];
};
