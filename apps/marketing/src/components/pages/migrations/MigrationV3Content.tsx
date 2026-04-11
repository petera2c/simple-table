"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faExclamationTriangle,
  faCheckCircle,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import CodeBlock from "@/components/CodeBlock";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";

export default function MigrationV3Content() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Migration Guide: v2 to v3
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simple Table v3 makes the core engine fully framework-agnostic. Each framework now has its
        own dedicated adapter package. This guide covers everything you need to update.
      </motion.p>

      {/* Overview */}
      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-6 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">What's New in v3</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Framework Adapter Packages</strong> — React, Vue, Angular, Svelte, and Solid
            each have their own npm package (e.g.{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              @simple-table/react
            </code>
            )
          </li>
          <li>
            <strong>Framework-Agnostic Core</strong> —{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              simple-table-core
            </code>{" "}
            is now plain JavaScript/TypeScript with no framework dependencies
          </li>
          <li>
            <strong>Column Virtualization</strong> — Only visible columns are rendered in the DOM,
            dramatically improving performance for wide tables
          </li>
        </ul>
      </motion.div>

      {/* Breaking Changes */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
        Breaking Changes
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Import change */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            Import from your framework adapter, not simple-table-core
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            In v2, everything was imported from{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              simple-table-core
            </code>
            . In v3,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              simple-table-core
            </code>{" "}
            is a plain JavaScript engine and no longer exports framework components. Import from
            your framework's adapter package instead.
          </p>

          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              v2 (before):
            </p>
            <CodeBlock
              code={`import { SimpleTable } from "simple-table-core";
import type { HeaderObject, Row, CellRendererProps } from "simple-table-core";
import "simple-table-core/styles.css";`}
              language="tsx"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              v3 (after):
            </p>
            <CodeBlock
              code={`import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Row, CellRendererProps } from "@simple-table/react";
import "@simple-table/react/styles.css";`}
              language="tsx"
            />
          </div>
        </div>

        {/* Type renames */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            Framework-Specific Type Names
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Some types are now prefixed with the framework name since each adapter can have slightly
            different type signatures. For React:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 text-gray-800 dark:text-white font-semibold">v2</th>
                  <th className="pb-2 text-gray-800 dark:text-white font-semibold">v3 (React)</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      HeaderObject
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      ReactHeaderObject
                    </code>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      TableRefType
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      TableAPI
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
            Other frameworks follow the same pattern (e.g.{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              VueHeaderObject
            </code>
            ,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              AngularHeaderObject
            </code>
            ). Types like{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">Row</code> and{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">Theme</code> remain
            the same.
          </p>
        </div>

        {/* tableRef -> ref */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            Table Ref:{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">tableRef</code> prop
            replaced by standard React{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">ref</code>
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            SimpleTable now uses React&#39;s{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">forwardRef</code>, so
            you pass a ref using the standard{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">ref</code> prop
            instead of the custom{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">tableRef</code> prop.
            The ref type has also been renamed from{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableRefType</code>{" "}
            to <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableAPI</code>.
          </p>
          <CodeBlock
            code={`// v2
const tableRef = useRef<TableRefType>(null);
<SimpleTable tableRef={tableRef} ... />

// v3
const tableRef = useRef<TableAPI>(null);
<SimpleTable ref={tableRef} ... />`}
            language="tsx"
          />
        </div>

        {/* Adapter packages */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
            Framework Adapter Packages
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 text-gray-800 dark:text-white font-semibold">Framework</th>
                  <th className="pb-2 text-gray-800 dark:text-white font-semibold">Package</th>
                  <th className="pb-2 text-gray-800 dark:text-white font-semibold">Install</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-2">React</td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      @simple-table/react
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      npm i @simple-table/react
                    </code>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-2">Vue</td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      @simple-table/vue
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      npm i @simple-table/vue
                    </code>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-2">Angular</td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      @simple-table/angular
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      npm i @simple-table/angular
                    </code>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-2">Svelte</td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      @simple-table/svelte
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      npm i @simple-table/svelte
                    </code>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Solid</td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      @simple-table/solid
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      npm i @simple-table/solid
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
            Each adapter package includes{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              simple-table-core
            </code>{" "}
            as a dependency — you do not need to install it separately. CSS styles are imported from
            your adapter package (e.g.{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              @simple-table/react/styles.css
            </code>
            ).
          </p>
        </div>
      </motion.div>

      {/* Step-by-Step Migration */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        Step-by-Step Migration
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {/* Step 1 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            1. Install your framework adapter
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Install the adapter package for your framework. For React:
          </p>
          <CodeBlock code={`npm install @simple-table/react`} language="bash" />
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            2. Update your imports
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Find and replace all imports from{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              simple-table-core
            </code>{" "}
            with your adapter package.
          </p>

          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Find:</p>
            <CodeBlock code={`from "simple-table-core"`} language="tsx" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Replace with:
            </p>
            <CodeBlock code={`from "@simple-table/react"`} language="tsx" />
          </div>

          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mt-4">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Tip:</strong> Use your editor's global find-and-replace. This covers both
              component/type imports and the CSS import — all references to{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                simple-table-core
              </code>{" "}
              become{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                @simple-table/react
              </code>
              .
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            3. Rename framework-specific types
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Rename{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">HeaderObject</code>{" "}
            to{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              ReactHeaderObject
            </code>{" "}
            (or your framework's equivalent), and rename{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableRefType</code>{" "}
            to <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableAPI</code>.
          </p>
          <CodeBlock
            code={`// v2
const headers: HeaderObject[] = [...]
const tableRef = useRef<TableRefType>(null);

// v3
const headers: ReactHeaderObject[] = [...]
const tableRef = useRef<TableAPI>(null);`}
            language="tsx"
          />
        </div>

        {/* Step 3b */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            4. Update tableRef to ref
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            The custom{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">tableRef</code> prop
            has been replaced by the standard React{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">ref</code> prop.
          </p>
          <CodeBlock
            code={`// v2
<SimpleTable tableRef={tableRef} ... />

// v3
<SimpleTable ref={tableRef} ... />`}
            language="tsx"
          />
        </div>

        {/* Step 4 */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            5. Remove simple-table-core from your dependencies
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            You no longer need{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              simple-table-core
            </code>{" "}
            as a direct dependency. The adapter package includes it automatically.
          </p>
          <CodeBlock code={`npm uninstall simple-table-core`} language="bash" />
        </div>
      </motion.div>

      {/* Complete Example */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Complete Migration Example
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">v2:</p>
          <CodeBlock
            code={`import { SimpleTable } from "simple-table-core";
import type { HeaderObject, Row } from "simple-table-core";
import "simple-table-core/styles.css";

const headers: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "age", label: "Age", width: 100 },
];

const rows: Row[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

export default function MyTable() {
  return <SimpleTable defaultHeaders={headers} rows={rows} />;
}`}
            language="tsx"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">v3:</p>
          <CodeBlock
            code={`import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Row } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "age", label: "Age", width: 100 },
];

const rows: Row[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

export default function MyTable() {
  return <SimpleTable defaultHeaders={headers} rows={rows} />;
}`}
            language="tsx"
          />
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-4">
          That's it — update the import path, rename{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">HeaderObject</code> to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            ReactHeaderObject
          </code>
          , <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableRefType</code>{" "}
          to <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableAPI</code>, and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">tableRef</code> to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">ref</code>. All other
          props and behavior are the same.
        </p>
      </motion.div>

      {/* New Feature: Column Virtualization */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
        New: Column Virtualization
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          v3 introduces column virtualization. Previously, Simple Table only virtualized rows. Now
          columns are also virtualized — only the columns visible in the viewport are rendered in
          the DOM. This dramatically improves performance for tables with a large number of columns.
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>No configuration needed.</strong> Column virtualization is enabled automatically
            when your table has a fixed height and horizontal scrolling. There is nothing to opt
            into — it just works.
          </p>
        </div>
      </motion.div>

      {/* Quick Checklist */}
      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-6 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">
          Migration Checklist
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>
              Install your framework adapter (e.g.{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                npm i @simple-table/react
              </code>
              )
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>
              Replace all{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                from &quot;simple-table-core&quot;
              </code>{" "}
              with{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                from &quot;@simple-table/react&quot;
              </code>{" "}
              (or your framework)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>
              Rename{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">HeaderObject</code>{" "}
              to{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                ReactHeaderObject
              </code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>
              Rename{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableRefType</code>{" "}
              to <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableAPI</code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>
              Replace{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                tableRef={"{tableRef}"}
              </code>{" "}
              with{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                ref={"{tableRef}"}
              </code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>
              Update CSS import to{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                import &quot;@simple-table/react/styles.css&quot;
              </code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">&#9744;</span>
            <span>Verify your table renders correctly</span>
          </li>
        </ul>
      </motion.div>

      {/* Need Help */}
      <motion.div
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">Need Help?</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If you encounter any issues during migration, check out these resources:
        </p>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <Link
              href="/docs/installation"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Installation Guide
            </Link>
          </li>
          <li>
            <Link
              href="/docs/quick-start"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Quick Start
            </Link>
          </li>
          <li>
            <Link
              href="/docs/api-reference"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              API Reference
            </Link>
          </li>
          <li>
            <Link
              href="/changelog"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Full Changelog
            </Link>
          </li>
        </ul>
      </motion.div>
    </PageWrapper>
  );
}
