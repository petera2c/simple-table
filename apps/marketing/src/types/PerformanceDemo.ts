import type { Theme } from "@simple-table/react";

export interface PerformanceDemoProps {
  // Table configuration
  headers?: any[];
  height?: string | number;
  theme?: Theme;
  initialRowCount?: number;

  // Data generation options
  dataCategories?: string[];
  maxDealValue?: number;
  minDealValue?: number;
  maxProfit?: number;
  minProfit?: number;

  // UI customization
  title?: string;
  description?: string;
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
  className?: string;
  hideTable?: boolean;
}
