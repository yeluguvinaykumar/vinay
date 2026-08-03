import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  return {
    name: `${settings.siteName} — Real Estate`,
    short_name: settings.siteName,
    description: settings.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#12255a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
