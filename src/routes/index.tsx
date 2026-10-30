import { createFileRoute } from "@tanstack/react-router";
import { Preloader } from "@/components/portfolio/preloader";
import { CustomCursor } from "@/components/portfolio/custom-cursor";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";
import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Projects } from "@/components/portfolio/projects";
import { Experience } from "@/components/portfolio/experience";
import { Achievements } from "@/components/portfolio/achievements";
import { Tools } from "@/components/portfolio/tools";
import { Testimonials } from "@/components/portfolio/testimonials";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kunal Khuteta — Full Stack Developer Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Kunal Khuteta, full-stack developer in Jaipur building web apps, mobile apps, APIs and automation tools.",
      },
      { property: "og:title", content: "Kunal Khuteta — Full Stack Developer Portfolio" },
      {
        property: "og:description",
        content:
          "Scalable applications, automation tools and developer infrastructure — selected work, experience and achievements.",
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
        <Projects />
        <Experience />
        <Achievements />
        <Tools />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
