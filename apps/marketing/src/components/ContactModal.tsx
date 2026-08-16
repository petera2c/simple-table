"use client";

import { useEffect, useState } from "react";
import { Modal, Input, Button, App, Select, Checkbox } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faBuilding, faComment, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { trackContactSubmit, trackLicenseQuoteSubmit } from "@/lib/analytics";

const { TextArea } = Input;

export type ContactModalVariant = "contact" | "license_quote";
export type PlanInterest = "pro" | "enterprise" | "unsure";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ContactModalVariant;
  /** Prefill plan interest when opening the license quote variant. */
  initialPlanInterest?: PlanInterest;
}

const emptyForm = {
  name: "",
  email: "",
  company: "",
  message: "",
  planInterest: "pro" as PlanInterest,
  replacingAgGrid: false,
};

const ContactModal = ({
  isOpen,
  onClose,
  variant = "contact",
  initialPlanInterest = "pro",
}: ContactModalProps) => {
  const { message } = App.useApp();
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isQuote = variant === "license_quote";

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...emptyForm, planInterest: initialPlanInterest });
    }
  }, [isOpen, variant, initialPlanInterest]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.company) {
      message.error("Please fill in all required fields");
      return;
    }

    if (!isQuote && !formData.message) {
      message.error("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          source: isQuote ? "license_quote" : "contact_modal",
          planInterest: isQuote ? formData.planInterest : undefined,
          replacingAgGrid: isQuote ? formData.replacingAgGrid : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isQuote) {
          trackLicenseQuoteSubmit({
            plan_interest: formData.planInterest,
            replacing_ag_grid: formData.replacingAgGrid,
          });
        } else {
          trackContactSubmit("contact_modal");
        }
        message.success({
          content: isQuote
            ? "Quote request sent! We'll reply within 24 hours with pricing and next steps."
            : "Message sent successfully! We'll get back to you within 24 hours.",
        });
        setFormData(emptyForm);
        onClose();
      } else {
        message.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      message.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={isQuote ? faFileInvoice : faEnvelope}
            className="text-blue-600"
          />
          <span>{isQuote ? "Get a license quote" : "Contact Us"}</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isQuote ? "Request quote" : "Send Message"}
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4 py-4">
        {isQuote ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1 mb-2">
            Tell us about your product and we&apos;ll send Pro pricing or an Enterprise quote, AG
            Grid cost comparison, and next steps, usually within a day.
          </p>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Name *
          </label>
          <Input
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            size="large"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Work email *
          </label>
          <Input
            type="email"
            placeholder="your.email@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
            size="large"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Company *
          </label>
          <Input
            placeholder="Your company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={isSubmitting}
            size="large"
          />
        </div>

        {isQuote ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plan interest *
              </label>
              <Select
                size="large"
                className="w-full"
                value={formData.planInterest}
                disabled={isSubmitting}
                onChange={(value: PlanInterest) =>
                  setFormData({ ...formData, planInterest: value })
                }
                options={[
                  { value: "pro", label: "Pro" },
                  { value: "enterprise", label: "Enterprise" },
                  { value: "unsure", label: "Not sure yet" },
                ]}
              />
            </div>

            <Checkbox
              checked={formData.replacingAgGrid}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, replacingAgGrid: e.target.checked })
              }
            >
              Evaluating as an AG Grid alternative
            </Checkbox>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FontAwesomeIcon icon={faComment} className="mr-2" />
                Anything else? (optional)
              </label>
              <TextArea
                placeholder="Framework, timeline, team size, migration from another grid…"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isSubmitting}
                rows={4}
                size="large"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FontAwesomeIcon icon={faComment} className="mr-2" />
              Message *
            </label>
            <TextArea
              placeholder="Tell us about your needs, questions, or how we can help..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              disabled={isSubmitting}
              rows={6}
              size="large"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContactModal;
