import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-8 h-8 text-brand-green" />
        </div>
        <h1 className="text-7xl font-black text-brand-border mb-4">404</h1>
        <h2 className="text-2xl font-bold text-brand-text mb-3">Page not found</h2>
        <p className="text-brand-muted mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
