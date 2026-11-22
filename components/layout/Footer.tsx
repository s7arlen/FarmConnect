import React from "react";
import Link from "next/link";
import { Leaf, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "Explore Produce", href: "/explore" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "For Farmers", href: "/register?role=FARMER" },
    { label: "For Buyers", href: "/register?role=BUYER" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Nearby Farmers", href: "/farmers" },
  ],
  Support: [
    { label: "Contact Support", href: "/contact" },
    { label: "Platform Guide", href: "/how-it-works" },
    { label: "Community", href: "/about" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white border-t border-emerald-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Top 5-Column Grid (Brand 2 cols + 3 Link cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-6">
          {/* Brand (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-green rounded-md flex items-center justify-center shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">FarmConnect</span>
            </Link>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-sm">
              Connecting local family farms directly with consumers and businesses across Karnataka. Zero middlemen markup.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors text-white/80 hover:text-white"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (3 cols) */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-xs tracking-wider uppercase text-white/90 mb-2.5">
                {section}
              </h3>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-white/50">
          <p>© {new Date().getFullYear()} FarmConnect. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-white/40 hidden md:block">
            Supporting verified local farmers across Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
