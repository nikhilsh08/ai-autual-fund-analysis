import type { Metadata } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartSync } from "@/components/cart/cart-sync";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManager";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { siteConfig } from "@/config/seo";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@cashflowcrew", // Update this to actual twitter handle if known
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      "url": siteConfig.url,
      "name": siteConfig.name,
      "description": siteConfig.description,
      "publisher": {
        "@id": `${siteConfig.url}/#organization`
      }
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name,
      "url": siteConfig.url,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`
      },
      "sameAs": [
        siteConfig.links.twitter,
        siteConfig.links.instagram,
        siteConfig.links.youtube
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManagerNoScript gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        <SessionProvider>
          <CartSync />
          {children}
          <Toaster />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID!} />
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
          <MicrosoftClarity clarityId={process.env.NEXT_PUBLIC_CLARITY_ID!} />
        </SessionProvider>
      </body>
    </html>
  );
}
