"use client";
import dynamic from "next/dynamic";
import LoadingScreen      from "@/components/LoadingScreen";
import ScrollProgress     from "@/components/ScrollProgress";
import ScrollProgressBar  from "@/components/ScrollProgressBar";
import Navbar             from "@/components/Navbar";
import Hero               from "@/components/Hero";
import About              from "@/components/About";
import Skills             from "@/components/Skills";
import Projects           from "@/components/Projects";
import Experience         from "@/components/Experience";
import Achievements       from "@/components/Achievements";
import Contact            from "@/components/Contact";
import Footer             from "@/components/Footer";
import FloatingBackToTop  from "@/components/FloatingBackToTop";

// Client-only components (need browser APIs)
const Cursor              = dynamic(() => import("@/components/Cursor"),              { ssr: false });
const ParticlesBackground = dynamic(() => import("@/components/ParticlesBackground"), { ssr: false });
const VisitorCounter      = dynamic(() => import("@/components/VisitorCounter"),      { ssr: false });

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Cursor />
      <ScrollProgress />
      <ScrollProgressBar />
      <ParticlesBackground />
      <VisitorCounter />
      <FloatingBackToTop />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
