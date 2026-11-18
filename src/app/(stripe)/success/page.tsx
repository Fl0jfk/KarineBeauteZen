// src/app/(stripe)/success/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
