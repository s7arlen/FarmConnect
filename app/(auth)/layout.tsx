import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      {/* Header */}
      <header className="py-5 px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-brand-text">FarmConnect</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>

      <footer className="py-4 px-6 text-center">
        <p className="text-xs text-brand-muted">
          © {new Date().getFullYear()} FarmConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
