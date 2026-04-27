"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import AnimationsDemo from "@/components/demos/AnimationsDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const ANIMATIONS_PROPS: PropInfo[] = [
  {
    key: "animations",
    name: "animations",
    required: false,
    description:
      "Configures table animations. Animations are enabled by default with sensible motion settings (240ms duration, smooth easing) and automatically respect the user's prefers-reduced-motion setting. Pass an object to override the duration, easing, or to disable animations entirely.",
    type: "AnimationsConfig",
    link: "/docs/api-reference#animations-config",
    example: `// Default behavior (animations on, 240ms, smooth easing)
// No prop required.

// Tweak duration / easing
animations={{
  duration: 320,
  easing: "ease-out",
}}

// Disable animations entirely
animations={{ enabled: false }}`,
  },
];

const ANIMATIONS_CONFIG_FIELDS: PropInfo[] = [
  {
    key: "enabled",
    name: "enabled",
    required: false,
    description:
      "Master toggle. When false, no other field has effect and cells snap to their new positions instantly. Defaults to true.",
    type: "boolean",
    example: `animations={{ enabled: false }}`,
  },
  {
    key: "duration",
    name: "duration",
    required: false,
    description:
      "Animation duration in milliseconds. Applies to every animated cell. Defaults to 240.",
    type: "number",
    example: `// Snappier 160ms transitions
animations={{ duration: 160 }}

// Slower, more dramatic 400ms transitions
animations={{ duration: 400 }}`,
  },
  {
    key: "easing",
    name: "easing",
    required: false,
    description:
      "CSS easing function applied to the transform transition. Accepts any valid CSS timing function (cubic-bezier, ease, linear, etc.). Defaults to cubic-bezier(0.2, 0.8, 0.2, 1).",
    type: "string",
    example: `animations={{
  duration: 280,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" // bouncy
}}`,
  },
];

const AnimationsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Animations</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Cells smoothly slide between positions when the table&apos;s logical state changes —
        sorting, reordering columns, or toggling column visibility — instead of teleporting.
        Animations are enabled by default, GPU-accelerated, and virtualization-aware so cells slide
        in from the viewport edge when they enter and out to the edge when they leave.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview demoId="animations" height="400px" Preview={AnimationsDemo} />
      </motion.div>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h4 className="font-bold text-gray-800 dark:text-white mb-2">New in v3.1.0</h4>
        <p className="text-gray-700 dark:text-gray-300">
          Animations ship enabled by default. Click a column header to sort, drag a column to
          reorder, or toggle a column from the visibility popout to see cells slide smoothly into
          their new positions.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        What gets animated
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Sort change.</strong> Rows shift vertically when the user clicks a sortable
            header or you change the sort programmatically.
          </li>
          <li>
            <strong>Column reorder during drag.</strong> As the user drags a column header over its
            neighbors, the displaced columns slide smoothly out of the way. The actively dragged
            column itself follows the pointer (it is intentionally not animated, so the cursor never
            fights the transition).
          </li>
          <li>
            <strong>Programmatic column reorder.</strong> Updating{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">defaultHeaders</code>{" "}
            or calling{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              tableRef.applyPinnedState
            </code>{" "}
            animates every cell to its new column position.
          </li>
          <li>
            <strong>Column visibility changes.</strong> Showing or hiding a column from the column
            editor reflows the remaining columns with the same slide.
          </li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">What is not animated</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Some renders are deliberately skipped to keep the table feeling responsive:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Scroll.</strong> Vertical and horizontal scrolling already produce native
              motion; layering animations on top would feel laggy. Scroll renders never trigger
              animations.
            </li>
            <li>
              <strong>The actively dragged column.</strong> The column under the user&apos;s pointer
              follows the cursor instantly. Only the columns being displaced animate.
            </li>
            <li>
              <strong>Cell content updates.</strong> Cells update text and other content instantly.
              The existing{" "}
              <Link
                href="/docs/cell-renderer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                <code>cellUpdateFlash</code>
              </Link>{" "}
              flash animation is independent and can be enabled separately.
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Configuration
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Animations are on by default — no prop needed. Pass an{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">animations</code>{" "}
          object to tune the timing or to disable them.
        </p>

        <PropTable props={ANIMATIONS_PROPS} title="Animations Prop" />

        <div className="mt-8">
          <PropTable props={ANIMATIONS_CONFIG_FIELDS} title="AnimationsConfig Fields" />
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        Examples
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Disable animations
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Useful for spreadsheet-style UIs where instant feedback matters more than motion.
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code className="text-gray-800 dark:text-gray-200">{`<SimpleTable
  defaultHeaders={headers}
  rows={rows}
  animations={{ enabled: false }}
/>`}</code>
        </pre>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Custom timing</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Override the default 240 ms duration and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            cubic-bezier(0.2, 0.8, 0.2, 1)
          </code>{" "}
          easing to match your product&apos;s motion language.
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto mb-6">
          <code className="text-gray-800 dark:text-gray-200">{`<SimpleTable
  defaultHeaders={headers}
  rows={rows}
  animations={{
    duration: 320,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // gentle overshoot
  }}
/>`}</code>
        </pre>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        Accessibility
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The animation system reads{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            window.matchMedia(&quot;(prefers-reduced-motion: reduce)&quot;)
          </code>{" "}
          on initialization and falls back to instant updates whenever the user has reduced motion
          enabled at the OS or browser level. You don&apos;t need to do anything special — this is
          handled automatically and overrides the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enabled</code> flag.
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default AnimationsContent;
