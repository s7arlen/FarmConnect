import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FarmConnect",
  description: "Privacy Policy and Data Protection commitment for FarmConnect agricultural marketplace.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold text-brand-green uppercase tracking-wider">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight mt-1 mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-muted">
            Last Updated: November 2026 • Compliant with Information Technology Act (2000) & Digital Personal Data Protection Act
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">1. Information We Collect</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            FarmConnect collects personal details required to connect farmers directly with buyers: name, contact email address, verified phone number, farm location or delivery address, and crop harvest data. We do not store payment card credentials or sensitive financial numbers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">2. How Your Data Is Used</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Data is used exclusively to facilitate agricultural discovery, process orders, display proximity on localized farm maps, and verify authentic farmer KYC credentials. We do not sell or monetize personal user records to third-party ad networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">3. Cookies and Session Security</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            We use secure HTTP-only session cookies with cryptographic HMAC-SHA256 signatures to authenticate user sessions. No advertising trackers or cross-site fingerprinting cookies are loaded without consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">4. User Rights & Account Deletion</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Users retain full rights to inspect, update, or erase their personal profile and agricultural listings. You can request complete deletion of your account and related harvest records at any time via your account settings or by submitting an authenticated request to our support desk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">5. Contact Grievance Officer</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            For privacy inquiries or data rights requests, contact our designated Grievance Officer at: <span className="font-semibold text-brand-dark">support@demo.farmconnect.in</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
