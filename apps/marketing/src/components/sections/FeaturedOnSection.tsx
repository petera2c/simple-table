"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface FeaturedItem {
  name: string;
  url: string;
  description: string;
  icon?: React.ReactNode;
}

const featuredItems: FeaturedItem[] = [
  {
    name: "Awesome React Components",
    url: "https://github.com/brillout/awesome-react-components",
    description: "Curated list of React components & libraries",
    icon: <FontAwesomeIcon icon={faGithub} className="text-2xl" />,
  },
];

export default function FeaturedOnSection() {
  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mb-8 py-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Featured On
        </h3>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6">
        {featuredItems.map((item, index) => (
          <motion.a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {item.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
            </div>
            <FontAwesomeIcon
              icon={faStar}
              className="text-yellow-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}
