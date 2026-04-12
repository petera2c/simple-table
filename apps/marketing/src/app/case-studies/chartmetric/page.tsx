import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faDollarSign,
  faRocket,
  faHeadset,
  faPalette,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "antd";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.caseStudies.chartmetric.title,
  description: SEO_STRINGS.caseStudies.chartmetric.description,
  keywords: SEO_STRINGS.caseStudies.chartmetric.keywords,
  openGraph: {
    title: SEO_STRINGS.caseStudies.chartmetric.title,
    description: SEO_STRINGS.caseStudies.chartmetric.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.caseStudies.chartmetric.title,
    description: SEO_STRINGS.caseStudies.chartmetric.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/case-studies/chartmetric",
  },
};

// Color configuration for easy customization
const COLORS = {
  question: {
    light: "text-gray-900",
    dark: "dark:text-white",
  },
  answer: {
    light: "text-gray-700",
    dark: "dark:text-gray-300",
  },
  bold: {
    light: "text-gray-900",
    dark: "dark:text-white",
  },
};

interface QAItemProps {
  question: string;
  answer: string | React.ReactNode;
  icon: any;
  iconColor: string;
}

function QAItem({ question, answer, icon, iconColor }: QAItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 w-10 h-10 rounded-full ${iconColor} flex items-center justify-center`}
        >
          <FontAwesomeIcon icon={icon} className="text-white" />
        </div>
        <div className="flex-1">
          <h3
            className={`text-base font-medium ${COLORS.question.light} ${COLORS.question.dark} mb-4`}
          >
            {question}
          </h3>
          <div
            className={`text-base ${COLORS.answer.light} ${COLORS.answer.dark} leading-relaxed [&_strong]:${COLORS.bold.light} [&_strong]:${COLORS.bold.dark} [&_strong]:font-semibold`}
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChartMetricCaseStudyPage() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Case Study
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How ChartMetric Chose Simple Table
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Discover how ChartMetric evaluated AG Grid, TanStack Table, Material UI Data Grid, and
            Material React Table before choosing Simple Table for their table-heavy product.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6">
              <div className="text-2xl font-bold text-green-700 dark:text-green-200 mb-2">
                $19K+
              </div>
              <div className="text-sm text-green-600 dark:text-green-300">
                First-year savings vs AG Grid
              </div>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-2">99%</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">
                Customization needs met
              </div>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2">
                Highly Responsive
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-300">
                Support & bug fixes
              </div>
            </div>
          </div>
        </section>

        {/* Q&A Sections */}
        <div className="space-y-6">
          <QAItem
            question="What data display challenges did you face before using Simple Table?"
            answer={
              <>
                Before adopting Simple Table, we lacked essential table features like{" "}
                <strong>copy and paste</strong> and an intuitive{" "}
                <strong>column configuration UI</strong> (drag-and-drop reordering and visibility
                control). We also had <strong>multiple table components</strong> with similar but
                inconsistent behaviors, which resulted in <strong>fragmented UI/UX</strong> and{" "}
                <strong>higher maintenance overhead</strong>.
              </>
            }
            icon={faChartLine}
            iconColor="bg-red-500"
          />

          <QAItem
            question="What other tables/grids did you consider, and why choose Simple Table?"
            answer={
              <div className="space-y-4">
                <p>
                  <strong>AG Grid</strong> offered the most powerful and polished feature set, but
                  its <strong>per-engineer pricing model</strong> was not scalable for a rapidly
                  growing team.
                </p>
                <p>
                  <strong>TanStack Table</strong> was highly flexible and extensible, but required{" "}
                  <strong>significant upfront engineering effort</strong> to build essential
                  features from scratch.
                </p>
                <p>
                  <strong>Material UI Data Grid</strong> supported most of our needs and had a large
                  community, but its <strong>per-engineer, annual pricing</strong> raised similar
                  cost concerns.
                </p>
                <p>
                  <strong>Material React Table</strong> is open source with a larger community, but
                  lacked some core features such as <strong>copy-and-paste support</strong>, and its
                  UI felt outdated.
                </p>
                <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  We chose <strong>Simple Table</strong> for its <strong>lightweight design</strong>
                  , <strong>strong performance with virtualization</strong>, and{" "}
                  <strong>clean, customizable UI</strong>. Although it initially missed some
                  features, it is <strong>actively maintained</strong>, improves quickly with
                  real-time feedback, and offers <strong>affordable fixed pricing</strong> with
                  priority support.
                </p>
              </div>
            }
            icon={faCheckCircle}
            iconColor="bg-blue-500"
          />

          <QAItem
            question="How was Simple Table's support during implementation?"
            answer={
              <div className="space-y-4">
                <p>
                  The support was <strong>highly responsive</strong> and very{" "}
                  <strong>open to feedback</strong>. We were able to add most of the features we
                  needed, and visible, straightforward issues were often{" "}
                  <strong>fixed within a few days</strong>. This helped us ship with{" "}
                  <strong>minimal schedule delays</strong>.
                </p>
                <p>
                  Even for larger feature requests, the team shared{" "}
                  <strong>detailed timelines</strong>, which made it easier for us to plan our
                  development work accordingly.
                </p>
              </div>
            }
            icon={faHeadset}
            iconColor="bg-green-500"
          />

          <QAItem
            question="How customizable was Simple Table for Chartmetric's design?"
            answer={
              <div className="space-y-4">
                <p>
                  Simple Table was <strong>highly customizable</strong>—around{" "}
                  <strong>99% of our needs</strong> were covered through built-in customization
                  options such as <strong>CSS variable overrides</strong>,{" "}
                  <strong>custom icons</strong>, and <strong>custom headers</strong>. For edge
                  cases, we were able to rely on global class selectors.
                </p>
                <p>
                  This flexibility allowed us to <strong>fully apply our design system</strong>,
                  including colors and spacing, and build tables that were well aligned with the
                  rest of our application.
                </p>
              </div>
            }
            icon={faPalette}
            iconColor="bg-purple-500"
          />

          <QAItem
            question="How much has Simple Table's pricing saved versus alternatives?"
            answer={
              <div className="space-y-4">
                <p>
                  Assuming 20 product engineers use the table library,{" "}
                  <strong>AG Grid Enterprise</strong> would cost{" "}
                  <strong className="text-red-600 dark:text-red-400">$999 × 20 = $19,980</strong>{" "}
                  for a perpetual license, with additional costs likely for future major version
                  upgrades.
                </p>
                <p>
                  In contrast, <strong>Simple Table Pro</strong> costs just{" "}
                  <strong className="text-green-600 dark:text-green-400">$850 per year</strong> for
                  the whole team. That's a{" "}
                  <strong className="text-green-600 dark:text-green-400">
                    first-year savings of over $19K
                  </strong>
                  , and the savings grow as the team expands.
                </p>
              </div>
            }
            icon={faDollarSign}
            iconColor="bg-yellow-500"
          />

          <QAItem
            question="What improvements (e.g., performance, UX) have you seen if any?"
            answer={
              <div className="space-y-4">
                <p>
                  One area that could be improved is smoother animations—for example, when sorting,
                  or expanding/collapsing rows or panels.
                </p>
                <p>
                  It would also be helpful to have a more programmatic API with examples covering
                  various use cases on the site.
                </p>
              </div>
            }
            icon={faRocket}
            iconColor="bg-orange-500"
          />

          <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-8 text-center">
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Would you recommend Simple Table?
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              "Yes, definitely! It's a great fit for table-heavy products like ours. It's
              affordable, lightweight, feature-rich, and easy to customize."
            </div>
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to try Simple Table?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Join ChartMetric and other teams building table-heavy products with Simple Table.
              Start with our free plan or explore our affordable Pro pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs/installation">
                <Button type="primary" size="large">
                  Get Started
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="large">View Pricing</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
