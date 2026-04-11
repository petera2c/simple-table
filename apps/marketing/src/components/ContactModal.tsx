"use client";

import { useState } from "react";
import { Modal, Input, Button, App } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faBuilding, faComment } from "@fortawesome/free-solid-svg-icons";

const { TextArea } = Input;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const { message } = App.useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate fields
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      message.error("Please fill in all fields");
      return;
    }

    // Validate email format
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        message.success({
          content: "Message sent successfully! We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", company: "", message: "" });
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
    setFormData({ name: "", email: "", company: "", message: "" });
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
          <span>Contact Us</span>
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
          Send Message
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4 py-4">
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
            Email *
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
            Company Name *
          </label>
          <Input
            placeholder="Your company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={isSubmitting}
            size="large"
          />
        </div>

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
      </div>
    </Modal>
  );
};

export default ContactModal;
