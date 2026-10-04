import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Agreement | Simple Table",
  description:
    "Support terms for Simple Table. The library is MIT licensed and free to use. Pro is $850 a month for support and bug fixes.",
  openGraph: {
    title: "Support Agreement | Simple Table",
    description: "Optional paid support for Simple Table. The software itself is MIT licensed.",
  },
};

export default function EULAPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="site-shell py-12">
        <div className="mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support Agreement
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Effective Date: October 4, 2026
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              This Support Agreement (&quot;Agreement&quot;) is a contract between you and Simple
              Table Software for optional paid support. It does not limit your right to use the
              software.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              The Simple Table software is licensed under the{" "}
              <a href="/legal/license" className="text-blue-600 dark:text-blue-400 hover:underline">
                MIT License
              </a>
              . Anyone may use, copy, modify, and distribute it, including companies that make
              money. You do not need a paid plan to use the software.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Definitions
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Software:</strong> Simple Table, licensed under the MIT License.
              </li>
              <li>
                <strong>Pro:</strong> The paid support subscription at{" "}
                <a
                  href="https://www.simple-table.com/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.simple-table.com/pricing
                </a>
                .
              </li>
              <li>
                <strong>Enterprise:</strong> A custom engagement. Contact us. The scope depends on
                what you need.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Software license
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your use of the Software is governed by the MIT License, not by this Agreement. This
              Agreement does not grant, and does not take away, the rights in that license.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Pro support
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>What it is:</strong> A support subscription. It includes support and bug
                fixes. It does not change the MIT License, and it is not required to use the
                Software.
              </li>
              <li>
                <strong>Fees:</strong> $850 per month. Fees recur until you cancel. Payments are in
                USD. Taxes are your responsibility.
              </li>
              <li>
                <strong>Billing:</strong> Cancel or manage billing at{" "}
                <a
                  href="https://www.simple-table.com/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.simple-table.com/pricing
                </a>
                .
              </li>
              <li>
                <strong>Non-payment:</strong> If payment fails, we may suspend Pro support. You can
                keep using the Software under the MIT License.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Enterprise
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Enterprise is custom. Contact us and we will scope the work to what you need. Fees,
              if any, are agreed in writing before work starts.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Support
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Without Pro:</strong> Documentation, Discord, and GitHub.
              </li>
              <li>
                <strong>Pro:</strong> Support and bug fixes.
              </li>
              <li>
                <strong>Enterprise:</strong> Whatever we agree in writing.
              </li>
              <li>
                <strong>Contact:</strong>{" "}
                <a
                  href="mailto:peter@peteryng.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  peter@peteryng.com
                </a>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Updates
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Software updates are published under the MIT License for everyone. Buying Pro does
              not change who can use those updates.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Money-back guarantee
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pro includes a 30-day refund of the initial subscription fee. Email{" "}
              <a
                href="mailto:peter@peteryng.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                peter@peteryng.com
              </a>{" "}
              within 30 days.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You may cancel Pro at any time. We may end Pro support for non-payment or for a
              breach of this Agreement. Ending this Agreement ends the support subscription. It
              does not end your MIT License, and you do not have to delete the Software.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              The Software is provided &quot;as is,&quot; without warranty, as stated in the MIT
              License. Support is provided as described above. We do not warrant that every bug
              will be fixed on a particular schedule.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our liability under this Agreement is limited to the fees you paid us for support in
              the prior 12 months. We are not liable for indirect or consequential damages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. General
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Governing law:</strong> The laws of British Columbia, Canada, with disputes
                in the courts of Vancouver.
              </li>
              <li>
                <strong>What this covers:</strong> This Agreement covers paid support only. The MIT
                License covers the Software.
              </li>
              <li>
                <strong>Changes:</strong> We may update this Agreement by posting a new version at{" "}
                <a
                  href="https://www.simple-table.com/legal/eula"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.simple-table.com/legal/eula
                </a>
                .
              </li>
              <li>
                <strong>Contact:</strong>{" "}
                <a
                  href="mailto:peter@peteryng.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  peter@peteryng.com
                </a>
              </li>
            </ul>

            <p className="text-gray-700 dark:text-gray-300 mt-8">
              <strong>Simple Table Software</strong>, c/o{" "}
              <a
                href="mailto:peter@peteryng.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                peter@peteryng.com
              </a>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View the agreement on GitHub:{" "}
              <a
                href="https://github.com/petera2c/simple-table/blob/main/packages/core/EULA.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                EULA.txt
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
