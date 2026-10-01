import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Famous Kitchen | Food & Pre-Orders",
    template: "%s | Famous Kitchen",
  },
  description:
    "Order meals from Famous Kitchen. Pre-order your food, make payment, upload your receipt and choose pickup or delivery.",
  icons: {
    icon: "https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_23%20AM.png",
    shortcut: "https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_23%20AM.png",
    apple: "https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_23%20AM.png",
  },
  openGraph: {
    title: "Famous Kitchen | Food & Pre-Orders",
    description:
      "Pre-order your meal from Famous Kitchen and get it delivered around camp or pick it up.",
    type: "website",
    siteName: "Famous Kitchen",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
