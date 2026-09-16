import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { usePortfolio } from "@/contexts/PortfolioContext";

const Contact = lazy(() => import("@/components/Contact"));

export default function Portfolio() {
  const { language, isLoading } = usePortfolio();
  useEffect(() => {
    // Keep early anchor navigation aligned when asynchronous sections finish loading.
    if (!isLoading && window.location.hash) {
      document
        .getElementById(window.location.hash.slice(1))
        ?.scrollIntoView({ behavior: "instant" });
    }
  }, [isLoading]);
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/30">
      <a href="#main-content" className="skip-link">
        {language === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <AnimatedBackground />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Education />
        <Certificates />
        <Testimonials />
        <Suspense
          fallback={
            <section
              id="contact"
              className="min-h-[900px]"
              aria-busy="true"
              aria-label={
                language === "ar"
                  ? "جارٍ تحميل قسم التواصل"
                  : "Loading contact section"
              }
            />
          }
        >
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
