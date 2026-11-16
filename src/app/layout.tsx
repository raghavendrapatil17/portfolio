import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/portfolio";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

// Canonical address comes from the data file; override with NEXT_PUBLIC_SITE_URL for a custom domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? profile.site;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
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
    url: "/",
    siteName: "Raghavendra S Patil",
    images: ["/certs/profile photo.jpeg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  image: `${siteUrl}${encodeURI(profile.photo)}`,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: profile.company },
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "KLE Institute of Technology" },
  sameAs: [profile.socials.github, profile.socials.linkedin],
  knowsAbout: ["Retrieval-augmented generation", "Large language models", "Machine learning", "Angular", "Microsoft Dynamics 365", "Power Platform"],
};

export const viewport: Viewport = { themeColor: "#06070a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>
        {children}
        {/* Structured data so search engines can show a rich "Person" result */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
