import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Raghavendra S Patil — Software Engineer & AI Developer",
  description:
    "Portfolio of Raghavendra S Patil — Software Development Engineer specializing in Angular, Microsoft Dynamics 365 CRM, Power Platform, LLMs, RAG and Agentic AI. Based in Hyderabad, India.",
  keywords: [
    "Raghavendra Patil", "Software Engineer", "Angular", "Dynamics 365", "Power Platform",
    "AI Developer", "LLM", "RAG", "Machine Learning", "Full Stack Developer", "Hyderabad",
  ],
  authors: [{ name: "Raghavendra S Patil" }],
  icons: { icon: "/certs/new logo.png", apple: "/certs/new logo.png" },
  openGraph: {
    title: "Raghavendra S Patil — Software Engineer & AI Developer",
    description: "Building enterprise-grade applications and intelligent AI systems.",
    type: "website",
    images: ["/certs/profile photo.jpeg"],
  },
};

export const viewport: Viewport = { themeColor: "#06070a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
