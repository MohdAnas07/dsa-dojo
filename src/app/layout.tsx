import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: { default: "DSA Dojo", template: "%s · DSA Dojo" },
  description: "Learn Data Structures & Algorithms from scratch: lessons, visualizers, runnable code, interview problems with a built-in judge, flashcards and revision.",
  icons: { icon: "/icon.svg" }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#101218" };

// Applies the saved theme before first paint to avoid a flash.
const themeScript = `try{var s=JSON.parse(localStorage.getItem("dsa-dojo-v2")||localStorage.getItem("dsa-dojo-v1")||"{}");if(s.theme)document.documentElement.setAttribute("data-theme",s.theme)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        {/* Anonymous visitor and page-view counts, shown in the Vercel dashboard → Analytics. No cookies. */}
        <Analytics />
      </body>
    </html>
  );
}
