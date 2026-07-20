"use client";

import PageWrapper from "@/components/PageWrapper";
import {
  DISTRIBUTION_CADENCE,
  DISTRIBUTION_RULES,
  EARNED_OUTREACH_TARGETS,
  WEEKLY_TARGETS,
} from "@/constants/distributionCadence";
import Link from "next/link";

export default function DistributionCadenceContent() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4 text-sm text-amber-900 dark:text-amber-100">
          Internal checklist (noindex). Do not buy backlinks — use earned distribution only.
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          90-day distribution cadence
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Weekly targets and ready-to-adapt drafts for Reddit, X, Indie Hackers, Show HN, Discord,
          and GitHub.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Weekly targets
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Reddit: {WEEKLY_TARGETS.reddit}</li>
            <li>Discord / GitHub: {WEEKLY_TARGETS.discordGithub}</li>
            <li>X: {WEEKLY_TARGETS.x}</li>
            <li>Indie Hackers / Show HN: {WEEKLY_TARGETS.indieHackersOrShowHn}</li>
          </ul>
        </section>

        <section className="mb-10 grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-red-200 dark:border-red-800 p-4">
            <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Never</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
              {DISTRIBUTION_RULES.never.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-green-200 dark:border-green-800 p-4">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Always</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
              {DISTRIBUTION_RULES.always.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Week-by-week drafts
          </h2>
          <div className="space-y-4">
            {DISTRIBUTION_CADENCE.map((item) => (
              <article
                key={`${item.week}-${item.channel}-${item.action}`}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
                  Week {item.week} · {item.channel}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.action}</h3>
                {item.draft ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">
                    {item.draft}
                  </p>
                ) : null}
                {item.linkTarget ? (
                  <Link
                    href={item.linkTarget}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Link target: {item.linkTarget}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Earned outreach targets (90 days)
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            {EARNED_OUTREACH_TARGETS.map((target) => (
              <li key={target}>{target}</li>
            ))}
          </ul>
        </section>
      </div>
    </PageWrapper>
  );
}
