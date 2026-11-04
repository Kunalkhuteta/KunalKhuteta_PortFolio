import { createFileRoute } from "@tanstack/react-router";
import { Preloader } from "@/components/portfolio/preloader";
import { CustomCursor } from "@/components/portfolio/custom-cursor";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";
import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Journey } from "@/components/portfolio/journey";
import { Projects } from "@/components/portfolio/projects";
import { Systems } from "@/components/portfolio/systems";
import { AiLab } from "@/components/portfolio/ai-lab";
import { InterfaceLab } from "@/components/portfolio/interface-lab";
import { Experience } from "@/components/portfolio/experience";
import { Achievements } from "@/components/portfolio/achievements";
import { Tools } from "@/components/portfolio/tools";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kunal Khuteta — Full Stack AI Developer" },
      {
        name: "description",
        content:
          "Full-stack developer building scalable applications, GenAI and agentic automation tools, and developer infrastructure.",
      },
      { property: "og:title", content: "Kunal Khuteta — Full Stack AI Developer" },
      {
        property: "og:description",
        content:
          "Full-stack developer building scalable applications, GenAI and agentic automation tools, and developer infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Film grain over the whole page */}
      <div className="grain pointer-events-none fixed inset-0 z-[85] opacity-[0.05]" aria-hidden="true" />

      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Systems />
        <AiLab />
        <InterfaceLab />
        <Experience />
        <Achievements />
        <Tools />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
