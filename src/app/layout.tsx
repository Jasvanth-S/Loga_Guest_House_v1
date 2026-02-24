import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { WhatsAppButton } from "@/components/organisms/WhatsAppButton";
import { ChatbotWidget } from "@/components/organisms/ChatbotWidget";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/QueryProvider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://logaguesthouse.lk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Loga Guest House | Boutique Stay in Sri Lanka",
    template: "%s | Loga Guest House Sri Lanka",
  },
  description:
    "Loga Guest House — A premium boutique guesthouse in Sri Lanka. Experience tropical luxury, warm hospitality, and authentic Sri Lankan charm. Book your stay today.",
  keywords: [
    "Sri Lanka guest house",
    "boutique guesthouse Sri Lanka",
    "Ella guest house",
    "beach stay Sri Lanka",
    "Sri Lanka accommodation",
    "Loga guest house",
    "tropical stay Sri Lanka",
    "luxury guesthouse Sri Lanka",
  ],
  authors: [{ name: "Loga Guest House" }],
  creator: "Loga Guest House",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Loga Guest House",
    title: "Loga Guest House | Boutique Stay in Sri Lanka",
    description:
      "A premium boutique guesthouse in Sri Lanka. Experience tropical luxury and authentic Sri Lankan hospitality.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Loga Guest House Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loga Guest House | Boutique Stay in Sri Lanka",
    description:
      "Experience tropical luxury and authentic Sri Lankan hospitality at Loga Guest House.",
    images: ["/og-default.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

// JSON-LD Hotel Schema
const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Loga Guest House",
  description:
    "A premium boutique guesthouse in Sri Lanka offering tropical luxury and authentic Sri Lankan hospitality.",
  url: SITE_URL,
  telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  email: process.env.NEXT_PUBLIC_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "LK",
    addressLocality: "Sri Lanka",
  },
  priceRange: "$$$",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Airport pickup", value: true },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0B3D6B" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="bg-coconut antialiased">
        <QueryProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <ChatbotWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-dm-sans)",
                borderRadius: "12px",
                background: "#FAF7F2",
                color: "#1C1C1E",
                border: "1px solid rgba(201,169,110,0.3)",
                boxShadow: "0 4px 24px rgba(11,61,107,0.08)",
              },
              success: {
                iconTheme: { primary: "#2D6A4F", secondary: "#FAF7F2" },
              },
              error: {
                iconTheme: { primary: "#DC2626", secondary: "#FAF7F2" },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
