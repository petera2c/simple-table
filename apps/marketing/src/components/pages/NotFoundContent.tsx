"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button, Space } from "antd";
import Link from "next/link";
import { UI_STRINGS } from "@/constants/strings/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells, faArrowLeft, faHome, faBook } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import PageWrapper from "@/components/PageWrapper";
import { DEFAULT_EXAMPLE_PATH } from "@/constants/global";
import ExampleLink from "@/components/ExampleLink";

export default function NotFoundContent() {
  const messageIndex = useMemo(
    () => Math.floor(Math.random() * UI_STRINGS.notFound.messages.length),
    []
  );
  const messages = UI_STRINGS.notFound.messages;

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center max-w-2xl">
          {/* Animated flipping table icon */}
          <motion.div
            className="text-6xl text-blue-600 mb-8"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <FontAwesomeIcon icon={faTableCells} />
          </motion.div>

          {/* Title with stagger animation */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {UI_STRINGS.notFound.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-xl md:text-2xl text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {UI_STRINGS.notFound.subtitle}
          </motion.h2>

          {/* Animated message carousel */}
          <div className="h-16">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Helpful suggestions */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 text-left shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Here are some helpful links:
            </h3>
            <ul className="space-y-3 text-gray-600">
              <motion.li
                className="flex items-center gap-2 hover:translate-x-2 transition-transform"
                whileHover={{ scale: 1.02 }}
              >
                <FontAwesomeIcon icon={faHome} className="text-blue-500" />
                <Link href="/" className="hover:text-blue-600">
                  Homepage
                </Link>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 hover:translate-x-2 transition-transform"
                whileHover={{ scale: 1.02 }}
              >
                <FontAwesomeIcon icon={faBook} className="text-blue-500" />
                <Link href="/docs/installation" className="hover:text-blue-600">
                  Documentation
                </Link>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 hover:translate-x-2 transition-transform"
                whileHover={{ scale: 1.02 }}
              >
                <FontAwesomeIcon icon={faTableCells} className="text-blue-500" />
                <ExampleLink href={DEFAULT_EXAMPLE_PATH} className="hover:text-blue-600">
                  View Examples
                </ExampleLink>
              </motion.li>
            </ul>
          </motion.div>

          {/* CTA section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Space size="middle">
              <Button
                type="default"
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => window.history.back()}
                className="hover:scale-105 transition-transform"
              >
                Go Back
              </Button>
              <Link href="/">
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faHome} />}
                  className="hover:scale-105 transition-transform"
                >
                  Homepage
                </Button>
              </Link>
            </Space>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
