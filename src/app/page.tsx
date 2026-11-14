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
import StackSection from "@/components/ui/StackSection";
import Providers from "@/components/ui/Providers";

// Re-generate the page at most once an hour with fresh GitHub data (ISR).
export const revalidate = 3600;

export default async function Home() {
  const gh = await getGitHubData(profile.githubUser);

  return (
    <Providers>
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
        {/* Each section slides over the last; tints shift the mood down the page */}
        <StackSection z={1} tint="rgb(139 123 255 / 0.10)"><About /></StackSection>
        <StackSection z={2} tint="rgb(34 211 238 / 0.08)"><Skills languages={gh?.languages ?? null} /></StackSection>
        {/* No recede: the pinned gallery and project panel need an untransformed ancestor */}
        <StackSection z={3} tint="rgb(96 165 250 / 0.09)" recede={false}><Projects live={gh?.repos ?? null} recent={gh?.recent ?? null} /></StackSection>
        <StackSection z={4} tint="rgb(52 211 153 / 0.07)"><Experience /></StackSection>
        <StackSection z={5} tint="rgb(251 191 36 / 0.06)"><Achievements /></StackSection>
        <StackSection z={6} tint="rgb(196 181 253 / 0.12)" recede={false}><Contact /></StackSection>
      </main>
      <Footer updatedAt={gh?.fetchedAt ?? null} />
    </div>
    </Providers>
  );
}
