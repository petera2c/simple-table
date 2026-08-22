"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faColumns,
  faEdit,
  faArrowRightArrowLeft,
  faEye,
  faThumbtack,
  faCalculator,
  faFileCsv,
  faLayerGroup,
  faCheckSquare,
  faPager,
  faInfinity,
  faLeftRight,
  faAlignCenter,
  faPalette,
  faCode,
  faIcons,
  faTableCells,
  faPuzzlePiece,
  faGaugeHigh,
  faBolt,
  faFileCode,
  faMobileAlt,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { motion } from "framer-motion";
import { SIMPLE_TABLE_INFO } from "@/constants/packageInfo";

export default function FeaturesSection() {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-12">
        <motion.div
          className="inline-flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FontAwesomeIcon icon={faTable} className="text-muted text-2xl" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink">
          Full-Featured Data Grid Component
        </h2>
        <p className="text-lg text-muted max-w-3xl mx-auto">
          30+ features in the box, so you can stop gluing libraries together.
        </p>
      </div>

      {/* Core Features */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-6 text-ink">
          Core Data Grid Features
        </h3>
        <p className="text-muted mb-6">
          Get started with essential data grid functions out of the box. Simple Table provides all
          the tools you need to render, navigate, and interact with data.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: faColumns,
              text: "Column Sorting & Filtering",
              link: "/docs/column-sorting",
            },
            { icon: faEdit, text: "In-line Cell Editing", link: "/docs/cell-editing" },
            { icon: faBolt, text: "Live Data Updates", link: "/docs/live-updates" },
            { icon: faCalculator, text: "Aggregate Functions", link: "/docs/aggregate-functions" },
            { icon: faFileCsv, text: "CSV Export", link: "/docs/csv-export" },
            { icon: faLayerGroup, text: "Row Grouping", link: "/docs/row-grouping" },
            { icon: faTableCells, text: "Pivot Tables", link: "/docs/pivot" },
            { icon: faCheckSquare, text: "Row Selection", link: "/docs/row-selection" },
            { icon: faPager, text: "Pagination", link: "/docs/pagination" },
            { icon: faInfinity, text: "Infinite Scroll", link: "/docs/infinite-scroll" },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <motion.div
                className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-line transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-muted text-lg"
                />
                <span className="text-ink">{item.text}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Advanced Column Management */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={faColumns} className="text-muted text-2xl" />
          <h3 className="text-2xl font-bold text-ink">
            Advanced Column Management
          </h3>
        </div>
        <p className="text-muted mb-6">
          Complete control over your columns. Resize, reorder, pin, hide, and customize columns with
          intuitive drag-and-drop controls.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: faLeftRight,
              title: "Column Resizing",
              desc: "Adjust widths with min/max constraints",
              link: "/docs/column-resizing",
            },
            {
              icon: faArrowRightArrowLeft,
              title: "Drag & Drop Reordering",
              desc: "Smooth animations and intuitive UX",
              link: "/docs/column-reordering",
            },
            {
              icon: faThumbtack,
              title: "Pin to Left/Right",
              desc: "Lock important columns while scrolling",
              link: "/docs/column-pinning",
            },
            {
              icon: faEye,
              title: "Show/Hide Columns",
              desc: "Dynamic visibility with state management",
              link: "/docs/column-visibility",
            },
            {
              icon: faAlignCenter,
              title: "Content Alignment",
              desc: "Left, center, or right alignment",
              link: "/docs/column-alignment",
            },
            {
              icon: faLayerGroup,
              title: "Nested Headers",
              desc: "Hierarchical column structures",
              link: "/docs/nested-headers",
            },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <motion.div
                className="p-4 bg-surface rounded-lg border border-line cursor-pointer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-muted text-xl mt-1"
                  />
                  <div>
                    <h4 className="font-semibold text-ink mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Customization & Theming */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={faPalette} className="text-muted text-2xl" />
          <h3 className="text-2xl font-bold text-ink">
            Customizable Style & Theming
          </h3>
        </div>
        <p className="text-muted mb-6">
          Build the exact interface you need. Add custom components, adjust theming, or create
          entirely custom control panels that fit your workflow.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: faPalette,
              title: "Multiple Built-in Themes",
              desc: "Professional themes ready to use",
              link: "/docs/themes",
            },
            {
              icon: faCode,
              title: "CSS Variable Customization",
              desc: "Adjust colors and spacing to your brand",
              link: "/docs/custom-theme",
            },
            {
              icon: faIcons,
              title: "Custom Icons",
              desc: "Replace default icons with your own",
              link: "/docs/custom-icons",
            },
            {
              icon: faTableCells,
              title: "Custom Cell Renderers",
              desc: "Full control over cell display",
              link: "/docs/cell-renderer",
            },
            {
              icon: faCode,
              title: "Header Renderers",
              desc: "Customize column headers",
              link: "/docs/header-renderer",
            },
            {
              icon: faPuzzlePiece,
              title: "Theme Builder Tool",
              desc: "Visual theme customization",
              link: "/theme-builder",
            },
            {
              icon: faWandMagicSparkles,
              title: "Animations",
              desc: "Smooth transitions on sort, reorder, and visibility changes",
              link: "/docs/animations",
            },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <motion.div
                className="p-4 bg-surface rounded-lg border border-line cursor-pointer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-muted text-xl mt-1"
                  />
                  <div>
                    <h4 className="font-semibold text-ink mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Performance */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={faBolt} className="text-muted text-2xl" />
          <h3 className="text-2xl font-bold text-ink">
            High Performance Data Grid
          </h3>
        </div>
        <p className="text-muted mb-6">
          Handle large datasets without the lag. Optimized rendering ensures smooth scrolling and
          fast loading, even with thousands of rows.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: faGaugeHigh,
              title: "Virtual Scrolling",
              desc: "Renders only visible rows for optimal performance",
            },
            {
              icon: faFileCode,
              title: "Tiny Bundle Size",
              desc: `Only ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} - won't bloat your app`,
            },
            { icon: faBolt, title: "Fast Rendering", desc: "Optimized for large datasets" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-4 sm:p-5 lg:p-6 bg-surface rounded-lg border border-line text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-muted text-3xl mb-3"
              />
              <h4 className="font-semibold text-ink mb-2">{item.title}</h4>
              <p className="text-sm text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Responsive & Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon
            icon={faMobileAlt}
            className="text-muted text-2xl"
          />
          <h3 className="text-2xl font-bold text-ink">
            Responsive & Mobile-Optimized
          </h3>
        </div>
        <p className="text-muted mb-6">
          Works seamlessly across all devices and screen sizes. Your data grids look professional
          whether users are on desktop, tablet, or mobile.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: faMobileAlt, text: "Mobile-first responsive design" },
            { icon: faTable, text: "Touch-friendly interactions" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-line"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-muted text-lg"
              />
              <span className="text-ink">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
