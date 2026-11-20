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
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">FarmConnect</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting local farmers directly with consumers and businesses.
              Know your farmer. Know your food.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-sm mb-4 text-white/90">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} FarmConnect. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            Supporting local farmers across Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
