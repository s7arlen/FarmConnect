import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to FarmConnect — Fresh food. Local roots.",
  description:
    "Connect with nearby farmers and bring fresh produce straight to your table.",
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-text flex flex-col justify-between">
      {children}
    </div>
  );
}
