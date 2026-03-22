import { CSSProperties } from "react";

const PinFilledIcon = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    style={{
      height: "14px",
      width: "14px",
      ...style,
    }}
  >
    <path
      fill="currentColor"
      d="M12 2C8.41 2 5.5 4.24 5.5 7.11c0 2.6 3.63 6.35 5.74 8.48a.75.75 0 0 0 1.06 0c2.11-2.13 5.74-5.88 5.74-8.48C18.5 4.24 15.59 2 12 2zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
    />
  </svg>
);

export default PinFilledIcon;
