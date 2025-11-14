import { lazy, Suspense } from "react";
import type AnimateComponent from "./animate/Animate";
import type DatePickerComponent from "./date-picker/DatePicker";

/**
 * Lazy-loaded heavy components with Suspense wrappers
 * These components are only loaded when actually needed, reducing initial bundle size
 */

// Type-safe lazy imports
const AnimateLazy = lazy(() => import("./animate/Animate"));
const DatePickerLazy = lazy(() => import("./date-picker/DatePicker"));

// Extract prop types from the imported components
type AnimateProps = React.ComponentProps<typeof AnimateComponent>;
type DatePickerProps = React.ComponentProps<typeof DatePickerComponent>;

/**
 * Animate component with Suspense
 * Fallback renders a plain div to prevent layout shift
 */
export const Animate = (props: AnimateProps) => {
  // Destructure React-specific props that shouldn't be passed to DOM elements
  const { parentRef, tableRow, ...domProps } = props;

  return (
    <Suspense fallback={<div {...domProps} />}>
      <AnimateLazy {...props} />
    </Suspense>
  );
};

/**
 * DatePicker component with Suspense
 * Fallback shows a loading message since it's in a modal/dropdown
 */
export const DatePicker = (props: DatePickerProps) => (
  <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>}>
    <DatePickerLazy {...props} />
  </Suspense>
);
