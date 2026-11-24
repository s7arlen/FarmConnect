import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | FarmConnect",
  description: "Terms and Conditions governing the use of FarmConnect direct marketplace.",
};

export default function TermsPage() {
  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold text-brand-green uppercase tracking-wider">
            Terms & Agreements
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight mt-1 mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-brand-muted">
            Last Updated: November 2026 • FarmConnect Community Marketplace
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">1. Acceptance of Terms</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            By creating an account or accessing FarmConnect, you agree to comply with these Terms of Service. If you disagree with any part of these terms, you must discontinue use immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">2. Farmer Conduct & Authenticity</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Registered farmers represent that listed produce is cultivated honestly and complies with regional agricultural health standards. FarmConnect reserves the right to suspend or remove accounts found to be fraudulent or misrepresenting produce quality.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">3. Orders, Pricing & Farmgate Settlement</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            All produce prices are set directly by individual farmers. Orders placed through FarmConnect represent binding agreements between the respective buyer and farmer. Fulfillment occurs via direct farmgate pickup or localized delivery as agreed during checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-dark">4. Limitation of Liability</h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            FarmConnect operates as a disintermediated technology facilitator. While we verify farmer credentials, natural weather conditions, transport delays, and perishable crop lifecycles are subject to agricultural realities.
          </p>
        </section>
      </div>
    </div>
  );
}
