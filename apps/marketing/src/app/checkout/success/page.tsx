import { Metadata } from "next";
import CheckoutSuccessContent from "@/components/pages/CheckoutSuccessContent";

export const metadata: Metadata = {
  title: "Checkout complete | Simple Table",
  description: "Thanks for purchasing Simple Table.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent />;
}
