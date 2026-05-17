import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";

function PortfolioLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] flex items-center justify-center flex-col bg-[#0a0a12]"
    >
      <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px] top-[20%] left-[10%] animate-pulse" />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-purple-700/15 blur-[80px] bottom-[20%] right-[10%] animate-pulse [animation-delay:1s]" />
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-purple-400 animate-spin [animation-delay:-0.15s] [animation-duration:1.6s]" />
        <div className="absolute inset-4 rounded-full border-[3px] border-transparent border-t-purple-300 animate-spin [animation-delay:-0.3s] [animation-duration:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_20px_#8b5cf6,0_0_40px_rgba(139,92,246,0.3)] animate-pulse" />
      </div>
      <span className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase animate-pulse">Loading</span>
      <div className="mt-6 w-[120px] h-0.5 bg-white/[0.08] rounded overflow-hidden">
        <div className="h-full w-2/5 bg-gradient-to-r from-transparent via-primary to-transparent rounded animate-[slide_1.5s_ease-in-out_infinite]" />
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const { isLoading } = usePortfolio();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <AnimatePresence>
        {isLoading && <PortfolioLoader />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isLoading ? 0 : 0.5 }}
        className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/30"
      >
        <AnimatedBackground />

        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[60]"
          style={{ scaleX }}
        />

        <Navbar />

        <main>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Education />
          <Certificates />
          <Testimonials />
          <Contact />
        </main>

        <Footer />
      </motion.div>
    </>
  );
}
