import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    default: "FarmConnect — Know your farmer. Know your food.",
    template: "%s | FarmConnect",
  },
  description:
    "Discover fresh produce from local farmers near you. Connect directly with verified farmers and buy with confidence.",
  keywords: [
    "local farm",
    "fresh produce",
    "farmers market",
    "local food",
    "Karnataka",
    "organic",
    "direct farm",
  ],
  openGraph: {
    title: "FarmConnect — Local Farmer Market Platform",
    description:
      "Fresh from local farms. Directly to your community. Discover produce from verified local farmers.",
    type: "website",
    locale: "en_IN",
    siteName: "FarmConnect",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmConnect",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4D8B38",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-brand-text">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              border: "1px solid #E1E6DF",
            },
          }}
        />
      </body>
    </html>
  );
}
