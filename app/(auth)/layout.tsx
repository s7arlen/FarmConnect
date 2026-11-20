import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F6EC] text-brand-text">
      {children}
    </div>
  );
}
