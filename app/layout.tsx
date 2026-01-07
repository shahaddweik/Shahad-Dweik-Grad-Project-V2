import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shahad D Graduation Project | Shipment Analysis",
  description: "Comprehensive Shipment Analysis Dashboard for Shahad D Graduation Project, featuring AI-driven insights, logistics metrics, and carrier performance auditing.",
  openGraph: {
    title: "Shahad D Graduation Project Shipment Analysis Dashboard",
    description: "Insights into logistics data including delays, route optimization, and carrier performance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shahad D Graduation Project Shipment Analysis",
    description: "AI-driven data analysis of shipment logistics.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
