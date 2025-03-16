import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ProductHuntBadge from "./components/ProductHuntBadge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Animation Playground",
  description: "Interactive learning platform for frontend animations",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Animation Playground",
    description: "Interactive learning platform for frontend animations",
    url: "https://learn-animations.aayooluwa.com",
    siteName: "Animation Playground",
    images: [
      {
        url: "https://learn-animations.aayooluwa.com/logo_.png",
        width: 1200,
        height: 630,
        alt: "Animation Playground Logo",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Animation Playground",
    description: "Interactive learning platform for frontend animations",
    creator: "@codingpastor",
    images: ["https://learn-animations.aayooluwa.com/logo_.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        {children}
        <ProductHuntBadge />
      </body>
    </html>
  );
}
