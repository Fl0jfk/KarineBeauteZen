import type { Metadata } from "next";
import CancelContent from "./CancelContent";

export const metadata: Metadata = {
  title: "Commande annulée",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return <CancelContent />;
}
