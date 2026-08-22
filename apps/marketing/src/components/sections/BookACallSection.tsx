"use client";

import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";
import { trackBookACall } from "@/lib/analytics";

export default function BookACallSection() {
  const calendlyUrl = TECHNICAL_STRINGS.links.calendly;

  const handleBookClick = () => {
    trackBookACall({
      cta_id: "homepage_book_a_call",
      cta_text: "Book a free call",
      destination: calendlyUrl,
      location: "homepage_evaluator",
    });
  };

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-3xl mx-auto rounded-lg border border-line bg-surface px-6 py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">
          Not sure which table or grid you need?
        </h2>
        <p className="text-muted mb-6 max-w-xl mx-auto">
          Book 30 minutes with us. We&apos;ll help you pick the right fit for free — even if
          Simple Table isn&apos;t the answer.
        </p>
        <Button
          type="primary"
          size="large"
          className="h-11 px-8"
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBookClick}
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
          Book a free call
        </Button>
      </div>
    </motion.section>
  );
}
