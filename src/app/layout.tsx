import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "3D Printing Wallah — Ideas into objects, layer by layer.",
    template: "%s | 3D Printing Wallah",
  },
  description:
    "3D Printing Wallah creates custom 3D-printed products and brings your ideas to life. Find an everyday object, make it personal, or start something of your own.",
  keywords: [
    "3D printing",
    "custom 3D print",
    "3D printing service India",
    "personalised 3D prints",
    "rapid prototyping",
    "FDM printing",
    "3D printed products",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://3dprintingwallah.com",
    siteName: "3D Printing Wallah",
    title: "3D Printing Wallah — Ideas into objects, layer by layer.",
    description:
      "Custom 3D printing, ready-to-order products, and personalised prints — made in India.",
  },
  icons: {
    icon: "/images/Logo.png",
    shortcut: "/images/Logo.png",
    apple: "/images/Logo.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Printing Wallah",
    description: "Ideas into objects, layer by layer.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
