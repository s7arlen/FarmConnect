import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-brand-green" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text mb-2">
          Verify your email
        </h1>
        <p className="text-brand-muted text-sm mb-6">
          We&apos;ve sent a verification link to your email address. Please
          check your inbox and click the link to activate your account.
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
      </div>
    </div>
  );
}
