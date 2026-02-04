import { CSSProperties } from "react";

const DragIcon = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 10"
    className={className}
    style={{
      height: "10px",
      width: "16px",
      ...style,
    }}
  >
    <circle cx="3" cy="3" r="1.5" fill="currentColor" />
    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
    <circle cx="13" cy="3" r="1.5" fill="currentColor" />
    <circle cx="3" cy="7" r="1.5" fill="currentColor" />
    <circle cx="8" cy="7" r="1.5" fill="currentColor" />
    <circle cx="13" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

export default DragIcon;
