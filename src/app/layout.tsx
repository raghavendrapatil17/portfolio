import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raghavendra S Patil — Software Engineer & AI Developer",
  description:
    "Portfolio of Raghavendra S Patil — Software Development Engineer specializing in Angular, Microsoft Dynamics 365 CRM, Power Platform, LLMs, RAG, and Agentic AI. Based in Hyderabad, India.",
  keywords: [
    "Raghavendra Patil","Software Engineer","Angular","Dynamics 365","Power Platform",
    "AI Developer","LLM","RAG","Machine Learning","Full Stack Developer","Hyderabad",
  ],
  authors: [{ name: "Raghavendra S Patil" }],
  icons: {
    icon: "/certs/new logo.png",
    apple: "/certs/new logo.png",
  },
  openGraph: {
    title: "Raghavendra S Patil — Software Engineer & AI Developer",
    description: "Building enterprise-grade applications and intelligent AI systems.",
    type: "website",
    images: ["/certs/new logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#020408] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
