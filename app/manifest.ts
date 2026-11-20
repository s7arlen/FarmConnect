import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FarmConnect — Agricultural Marketplace",
    short_name: "FarmConnect",
    description: "Direct farmer-to-buyer agricultural marketplace connecting local farms with retail and bulk consumers.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9F2",
    theme_color: "#4D8B38",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
