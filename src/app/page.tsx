import { getGitHubData } from "@/lib/github";
import { profile } from "@/data/portfolio";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Re-generate the page at most once an hour with fresh GitHub data (ISR).
export const revalidate = 3600;

export default async function Home() {
  const gh = await getGitHubData(profile.githubUser);

  return (
    <div className="noise">
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Navbar />
      <main>
        <Hero
          stats={gh ? { repos: gh.user.publicRepos, stars: gh.totalStars, followers: gh.user.followers, topLanguage: gh.languages[0]?.name ?? null, lastPush: gh.recent[0]?.pushedAt ?? null } : null}
        />
        <Marquee />
        <About />
        <Skills languages={gh?.languages ?? null} />
        <Projects live={gh?.repos ?? null} recent={gh?.recent ?? null} />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer updatedAt={gh?.fetchedAt ?? null} />
    </div>
  );
}
