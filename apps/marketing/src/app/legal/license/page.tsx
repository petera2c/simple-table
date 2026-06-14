import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community License | Simple Table",
  description:
    "Read the Simple Table Community License - a source-available license that is free for zero-revenue teams. Revenue-generating companies require a Pro or Enterprise license.",
  openGraph: {
    title: "Community License | Simple Table",
    description: "Simple Table Community License - source-available, free for zero-revenue teams",
  },
};

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Simple Table Community License
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-6 rounded mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Source-available, not MIT
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Simple Table is distributed under the <strong>Simple Table Community License</strong>,
                a source-available license. It is <strong>not</strong> the MIT License and is{" "}
                <strong>not</strong> an OSI-approved open source license. It is free to use only
                while you and your product generate <strong>zero revenue</strong>.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 font-mono text-sm mb-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Simple Table Community License
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Copyright (c) 2025 Simple Table Software
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Subject to your full and ongoing compliance with this license, Licensor grants you a
                worldwide, royalty-free, non-exclusive, non-transferable, revocable license to use,
                copy, modify, merge, publish, and distribute the Software, and to incorporate the
                Software into your Product, for as long as you and your Product generate ZERO revenue
                (pre-revenue use). This grant permits an unlimited number of users per Product.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                The Community grant is available only while you and your Product have zero revenue.
                If you or your Product generate any revenue whatsoever, the Community grant
                immediately terminates, and continued use of the Software requires a paid Pro or
                Enterprise license under the EULA.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                The above copyright notice, this permission notice, and the revenue limitation shall
                be included in all copies or substantial portions of the Software.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR
                A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
                OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 p-6 rounded">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Important: Revenue Requirement
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                The Community License applies <strong>only to companies, products, or organizations
                with zero revenue</strong>. If your company generates{" "}
                <strong>any revenue whatsoever</strong>, you must obtain a Pro or Enterprise License
                under our{" "}
                <a
                  href="/legal/eula"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  EULA
                </a>
                .
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For commercial use by revenue-generating companies and additional Pro features, see
                the{" "}
                <a
                  href="/legal/eula"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  EULA
                </a>{" "}
                and visit our{" "}
                <a
                  href="/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  pricing page
                </a>
                .
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What does this mean?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                While you and your product have zero revenue, the Community License lets you:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use the software in a product, with unlimited users</span>
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
                <strong>The key conditions</strong> are that you include the original copyright
                notice, this permission notice, and the revenue limitation in any copy of the
                software, and that you upgrade to a paid license as soon as you or your product
                generate revenue.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Community vs Pro License
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The core Simple Table library is free under the Community License for companies with
                <strong> zero revenue only</strong>. Any company, product, or organization that
                generates revenue must obtain a Pro or Enterprise License.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For revenue-generating companies and access to Pro features (priority support, early
                access, custom guidance), please review our{" "}
                <a href="/legal/eula" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EULA
                </a>{" "}
                and visit our{" "}
                <a href="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  pricing page
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View the full license on GitHub:{" "}
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
