import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact, faVuejs, faAngular, faJs } from "@fortawesome/free-brands-svg-icons";
import type { Framework } from "@/providers/FrameworkProvider";

interface FrameworkIconProps {
  framework: Framework;
  className?: string;
  size?: number;
}

function SvelteLogo({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 98.1 118"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Svelte"
    >
      <path
        d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.1 21.3-2.4 3.5-4 7.5-4.8 11.7-1.6 8.7.3 17.7 5.3 25C16.4 118.1 38.1 122.7 53.7 112.8l27.5-17.6c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.1-21.3 2.4-3.5 4-7.5 4.8-11.7 1.6-8.7-.3-17.7-5.3-25"
        fill="#FF3E00"
      />
      <path
        d="M40.9 103.9a28.6 28.6 0 0 1-30.7-11.8c-3.4-4.9-4.8-10.9-3.7-16.7.2-.9.4-1.8.6-2.6l.8-2.3 2 1.6a33.6 33.6 0 0 0 10.1 5.7l1 .3-.1 1a8.6 8.6 0 0 0 1.2 5.4c1.8 2.6 4.9 4 8 3.6a9.3 9.3 0 0 0 2.5-.8l27.5-17.5a7.8 7.8 0 0 0 3.5-5.4c.5-2.5-.3-5.1-2.1-6.9-1.8-2.6-4.9-4-8-3.6-.9.2-1.8.4-2.5.8l-10.5 6.7a27.7 27.7 0 0 1-7.5 2.5c-9.1 1.2-18.2-2.8-23.6-10.7-3.4-4.9-4.8-10.9-3.7-16.7 1-5.3 4.1-10 8.6-13l27.5-17.5a27.7 27.7 0 0 1 7.5-2.5c9.1-1.2 18.2 2.8 23.6 10.7a19.9 19.9 0 0 1 3.1 19.3l-.8 2.3-2-1.6a33.6 33.6 0 0 0-10.1-5.7l-1-.3.1-1a8.6 8.6 0 0 0-1.2-5.4c-1.8-2.6-4.9-4-8-3.6-.9.2-1.8.4-2.5.8L24.2 54.5a7.8 7.8 0 0 0-3.5 5.4c-.5 2.5.3 5.1 2.1 6.9 1.8 2.6 4.9 4 8 3.6a9 9 0 0 0 2.5-.8l10.5-6.7a28 28 0 0 1 7.5-2.5c9.1-1.2 18.2 2.8 23.6 10.7a19.9 19.9 0 0 1 .6 19.3c-1 5.3-4.1 10-8.6 13l-27.5 17.5a28 28 0 0 1-7.5 2.5"
        fill="#FFF"
      />
    </svg>
  );
}

function SolidLogo({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 166 155.3"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Solid"
    >
      <defs>
        <linearGradient id="solid-a" x1="27.5" y1="3" x2="152" y2="63.5" gradientUnits="userSpaceOnUse">
          <stop offset="0.1" stopColor="#76b3e1" />
          <stop offset="0.3" stopColor="#dcf2fd" />
          <stop offset="1" stopColor="#76b3e1" />
        </linearGradient>
        <linearGradient id="solid-b" x1="95.8" y1="32.6" x2="74" y2="105.2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#76b3e1" />
          <stop offset="0.5" stopColor="#4377bb" />
          <stop offset="1" stopColor="#1f3b77" />
        </linearGradient>
        <linearGradient id="solid-c" x1="18.4" y1="64.2" x2="144.3" y2="149.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#315aa9" />
          <stop offset="0.5" stopColor="#518ac8" />
          <stop offset="1" stopColor="#315aa9" />
        </linearGradient>
        <linearGradient id="solid-d" x1="75.2" y1="74.5" x2="24.4" y2="260.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4377bb" />
          <stop offset="0.5" stopColor="#1a336b" />
          <stop offset="1" stopColor="#1a336b" />
        </linearGradient>
      </defs>
      <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="url(#solid-a)" />
      <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="url(#solid-b)" opacity="0.3" />
      <path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" fill="url(#solid-c)" />
      <path d="M166 131S113 92 73 102l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="url(#solid-a)" />
      <path d="M166 131S113 92 73 102l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="url(#solid-b)" opacity="0.3" />
      <path d="M52 131l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 122 52 131z" fill="url(#solid-d)" />
    </svg>
  );
}

export default function FrameworkIcon({ framework, className, size = 16 }: FrameworkIconProps) {
  switch (framework) {
    case "react":
      return <FontAwesomeIcon icon={faReact} className={className} style={{ fontSize: size }} />;
    case "vue":
      return <FontAwesomeIcon icon={faVuejs} className={className} style={{ fontSize: size }} />;
    case "angular":
      return <FontAwesomeIcon icon={faAngular} className={className} style={{ fontSize: size }} />;
    case "svelte":
      return <SvelteLogo size={size} className={className} />;
    case "solid":
      return <SolidLogo size={size} className={className} />;
    case "vanilla":
      return <FontAwesomeIcon icon={faJs} className={className} style={{ fontSize: size }} />;
    default:
      return null;
  }
}
