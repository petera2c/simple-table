import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MIT License | Simple Table",
  description:
    "Simple Table is MIT licensed. Anyone can use, modify, and distribute it. Paid plans are for support, not for permission to use the library.",
  openGraph: {
    title: "MIT License | Simple Table",
    description: "Simple Table is MIT licensed and free to use.",
  },
};

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="site-shell py-12">
        <div className="mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">MIT License</h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-6 rounded mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Free for everyone
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Simple Table is distributed under the <strong>MIT License</strong>. Anyone can use
                it. You do not need to buy a license. Paid
                plans on the{" "}
                <a href="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  pricing page
                </a>{" "}
                are for support, not for permission to use the library.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 font-mono text-sm mb-8 whitespace-pre-wrap">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {`MIT License

Copyright (c) 2025 Simple Table Software

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What you can do
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use it in any product</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Modify the source code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Distribute the original or modified software</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use it privately</span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6">
                Keep the copyright notice and this permission notice in any copy of the software.
                If you want support and bug fixes, see{" "}
                <a href="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Pro
                </a>
                . For something custom,{" "}
                <a href="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contact us
                </a>
                . Support terms are in the{" "}
                <a href="/legal/eula" className="text-blue-600 dark:text-blue-400 hover:underline">
                  support agreement
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View the license on GitHub:{" "}
              <a
                href="https://github.com/petera2c/simple-table/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LICENSE
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
