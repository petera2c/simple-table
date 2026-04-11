import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

// Feature status component for comparison system
export const FeatureStatusBadge = ({
  status,
}: {
  status: "free" | "paid" | "in-development" | "not-available";
}) => {
  let icon: React.ReactNode;
  let bgColor: string;
  let textColor: string;

  switch (status) {
    case "free":
      icon = <FontAwesomeIcon icon={faCheck} className="text-white" />;
      bgColor = "bg-green-500";
      textColor = "text-white";
      break;
    case "paid":
      icon = <FontAwesomeIcon icon={faCheck} className="text-white" />;
      bgColor = "bg-yellow-500";
      textColor = "text-white";
      break;
    case "in-development":
      icon = <FontAwesomeIcon icon={faXmark} className="text-white" />;
      bgColor = "bg-blue-500";
      textColor = "text-white";
      break;
    case "not-available":
      icon = <FontAwesomeIcon icon={faXmark} className="text-white" />;
      bgColor = "bg-red-500";
      textColor = "text-white";
      break;
  }

  return (
    <div
      className={`${bgColor} ${textColor} rounded-md inline-flex items-center justify-center w-7 h-7`}
    >
      {icon}
    </div>
  );
};
