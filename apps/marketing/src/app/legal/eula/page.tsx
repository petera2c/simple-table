import { Metadata } from "next";

export const metadata: Metadata = {
  title: "End-User License Agreement (EULA) | Simple Table",
  description:
    "Read the End-User License Agreement for Simple Table - Terms and conditions for using our React table component library.",
  openGraph: {
    title: "EULA | Simple Table",
    description: "End-User License Agreement for Simple Table",
  },
};

export default function EULAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            End-User License Agreement (EULA)
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Effective Date: October 19, 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              This End-User License Agreement (&quot;Agreement&quot;) is a legal contract between
              you (&quot;Licensee,&quot; &quot;you,&quot; or &quot;your&quot;) and Simple Table
              Software (&quot;Licensor,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
              the developer and owner of Simple Table (&quot;Software&quot;). By downloading,
              installing, copying, accessing, or using the Software (including updates or
              modifications), you agree to be bound by this Agreement. If you do not agree, do not
              use the Software.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Definitions
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Free License:</strong> The no-cost license under the &quot;FREE&quot; tier
                at{" "}
                <a
                  href="https://www.simple-table.com/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.simple-table.com/pricing
                </a>
                .
              </li>
              <li>
                <strong>Pro License:</strong> The paid subscription license under the
                &quot;PRO&quot; tier at{" "}
                <a
                  href="https://www.simple-table.com/pricing"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.simple-table.com/pricing
                </a>
                .
              </li>
              <li>
                <strong>Product:</strong> A single software application, website, or service
                developed by you that incorporates the Software.
              </li>
              <li>
                <strong>Users:</strong> Individuals accessing or using the Product, including
                employees, contractors, or end-users.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Grant of License
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Subject to compliance with this Agreement and payment of applicable fees, Licensor
              grants you a non-exclusive, non-transferable, revocable license to use the Software:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.1 Free License
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              <li>
                <strong>Scope:</strong> Use in one (1) Product for non-commercial purposes or
                commercial purposes if your company has zero revenue (pre-revenue). If your company,
                product, or organization generates any revenue whatsoever, you must obtain a Pro
                License. Unlimited Users per Product.
              </li>
              <li>
                <strong>Permissions:</strong> Full access to the Simple Table library (sorting,
                filtering, editing), themes, and TypeScript support. Governed by the MIT License
                (see LICENSE file in repository), allowing modification and distribution subject to
                MIT terms.
              </li>
              <li>
                <strong>Support:</strong> Community support only (e.g., GitHub issues).
              </li>
              <li>
                <strong>Limitations:</strong> No access to Pro features (e.g., priority support,
                early access). Commercial use is permitted only for companies with zero revenue. Any
                revenue generation requires upgrading to a Pro License.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.2 Pro License
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              <li>
                <strong>Scope:</strong> Use in one (1) Product for commercial or non-commercial
                purposes. Unlimited Users per Product.
              </li>
              <li>
                <strong>Permissions:</strong> All Free License features, plus priority email/Discord
                support, direct developer access, feature request prioritization, early access to
                new features, and custom implementation guidance.
              </li>
              <li>
                <strong>License Type:</strong> Proprietary license under this Agreement,
                supplementing MIT License for core features.
              </li>
              <li>
                <strong>Fees:</strong> $85/month (or annual equivalent) per Product. First 50
                customers receive 50% off ($42.50/month) with code &quot;first_50&quot; (limited
                time). Fees are non-refundable except as per Section 7.
              </li>
              <li>
                <strong>Support:</strong> Priority support (24-48 hour response), up to 4
                hours/month custom guidance (additional hours at $100/hour).
              </li>
              <li>
                <strong>Limitations:</strong> Additional Products require separate licenses. You may
                not redistribute the Software or make it available as a standalone product or
                service.
              </li>
              <li>
                <strong>Resale and Distribution:</strong> If your Product resells, redistributes, or
                makes the Software available to third parties in any form (including as part of a
                white-label solution, SaaS platform, or embedded feature), each of your clients,
                customers, or end-users who receive access to the Software must obtain their own
                appropriate license (Free or Pro) from Simple Table Software. Your Pro License does
                not extend to your downstream clients or customers.
              </li>
            </ul>

            <p className="text-gray-700 dark:text-gray-300 mt-4">
              <strong>General Restrictions:</strong> You may not: (i) reverse engineer, decompile,
              or disassemble the Software beyond MIT License permissions; (ii) remove proprietary
              notices; (iii) sublicense, rent, or lease the Software outside your Product; (iv)
              violate laws; or (v) create competing products. Licensor retains all intellectual
              property rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Pricing and Payment
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pricing is fixed per Product, regardless of revenue or team size. See{" "}
              <a
                href="https://www.simple-table.com/pricing"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://www.simple-table.com/pricing
              </a>{" "}
              for details. Pro License fees recur automatically. Manage billing at{" "}
              <a
                href="https://www.simple-table.com/pricing"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://www.simple-table.com/pricing
              </a>
              . Payments in USD. Late payments may suspend Pro features. Taxes are your
              responsibility.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Updates
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Free Licensees receive updates via the MIT-licensed repository. Pro Licensees get
              early access to new features. Continued use after updates accepts any revised terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Support
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Free License:</strong> Community forums only.
              </li>
              <li>
                <strong>Pro License:</strong> Priority email/Discord support, direct developer
                access, and custom guidance.
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
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              The Software is protected by copyright and other laws. Feedback you provide becomes
              Licensor&apos;s property without compensation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Money-Back Guarantee
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pro License offers a 30-day refund for the initial subscription fee. Contact{" "}
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
              Breaches or non-payment terminate this Agreement. You must cease use and destroy
              copies. Sections 2 (restrictions), 6, 9, 10, and 12 survive termination.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Software is &quot;as is.&quot; Licensor warrants ownership and basic functionality for
              30 days. NO OTHER WARRANTIES, INCLUDING MERCHANTABILITY OR FITNESS FOR PURPOSE, ARE
              PROVIDED.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              LICENSOR&apos;S LIABILITY IS LIMITED TO FEES PAID IN THE PRIOR 12 MONTHS ($0 FOR FREE
              LICENSE). NO LIABILITY FOR INDIRECT OR CONSEQUENTIAL DAMAGES.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. Indemnification
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You indemnify Licensor against claims from your use of the Software.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              12. General
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Governing Law:</strong> Laws of British Columbia, Canada, with disputes in
                Vancouver courts.
              </li>
              <li>
                <strong>Entire Agreement:</strong> This Agreement supersedes prior agreements.
              </li>
              <li>
                <strong>Changes:</strong> Updates posted at{" "}
                <a
                  href="https://www.simple-table.com/legal/eula"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://www.simple-table.com/legal/eula
                </a>{" "}
                or in the repository.
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
              <strong>Licensor:</strong> Simple Table Software, c/o{" "}
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
              View the original EULA on GitHub:{" "}
              <a
                href="https://github.com/petera2c/simple-table/blob/main/EULA.txt"
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
