import { createSafeDate } from "./dateUtils";

export const formatDate = (dateString: string | number | Date): string => {
  const date = createSafeDate(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
