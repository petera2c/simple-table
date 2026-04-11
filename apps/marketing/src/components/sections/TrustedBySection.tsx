"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Company {
  name: string;
  logo: string;
  darkLogo?: string; // Optional separate logo for dark mode
}

const companies: Company[] = [
  {
    name: "ChartMetric",
    logo: "/images/trusted-by/chart-metric.svg",
    darkLogo: "/images/trusted-by/chart-metric-dark.svg",
  },
];

export default function TrustedBySection() {
  // Don't render if no companies are added yet
  if (companies.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Trusted by teams at
        </h3>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
        {companies.map((company, index) => (
          <motion.div
            key={company.name}
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
          >
            <div className="relative h-12 w-32 md:h-14 md:w-40">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                fill
                className="object-contain dark:hidden"
                sizes="(max-width: 768px) 128px, 160px"
              />
              {company.darkLogo && (
                <Image
                  src={company.darkLogo}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain hidden dark:block"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
