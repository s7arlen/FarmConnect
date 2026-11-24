import type { Metadata } from "next";
import { Leaf, Users, TrendingUp, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About FarmConnect",
  description: "FarmConnect connects local farmers directly with consumers and bulk buyers across Karnataka.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="section bg-brand-cream pt-8 sm:pt-12">
        <div className="container-page max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-brand-green text-sm font-semibold uppercase tracking-wide mb-2">Our Story</p>
            <h1 className="text-5xl font-bold text-brand-text mb-4">About FarmConnect</h1>
            <p className="text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
              We believe that the freshest food comes from knowing the farmer who grew it.
              FarmConnect was built to remove unnecessary layers between local farms and the people who need their produce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[
              { icon: Leaf, title: "Supporting Local Farmers", desc: "We give farmers a direct channel to reach buyers — without the traditional market markup. Farmers set their own prices and keep more of what they earn." },
              { icon: Users, title: "Community First", desc: "Built for the farming communities of Karnataka, with a focus on coastal Karnataka, the Dakshina Kannada region, and the surrounding agricultural belt." },
              { icon: ShieldCheck, title: "Trusted & Verified", desc: "Every farmer on FarmConnect is verified by our team. Buyers can be confident they're dealing with legitimate local farms." },
              { icon: TrendingUp, title: "Fair & Transparent", desc: "No hidden fees, no surprise costs. What you see on the platform is what you pay — directly to the farmer." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl border border-brand-border p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="font-bold text-brand-text mb-2">{item.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-brand-dark text-white rounded-2xl p-8 text-center">
            <p className="text-2xl font-bold mb-3">
              &ldquo;Know your farmer. Know your food.&rdquo;
            </p>
            <p className="text-white/60">FarmConnect — Connecting local farms, directly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
