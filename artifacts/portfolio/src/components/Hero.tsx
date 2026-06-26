import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function useTypewriter(words: string[], typingSpeed = 75, deletingSpeed = 40, pauseTime = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const currentWord = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < currentWord.length) {
          setDisplayed(currentWord.slice(0, displayed.length + 1));
        } else {
          setIsPaused(true);
          setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, pauseTime);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, isPaused, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return displayed;
}

function MagneticButton({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    setPosition({ x: (clientX - (left + width / 2)) * 0.12, y: (clientY - (top + height / 2)) * 0.12 });
  };

  return (
    <motion.div animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.1 }}>
      <Button
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={() => setPosition({ x: 0, y: 0 })}
        onClick={onClick}
        className={className}
        size="lg"
        data-testid="button-hero-cta"
      >
        {children}
      </Button>
    </motion.div>
  );
}

export default function Hero() {
  const { language, personalInfo } = usePortfolio();
  const t = translations[language];
  const typedRole = useTypewriter(t.hero.roles, 75, 40, 1800);
  const name = language === "ar" ? personalInfo.nameAr : personalInfo.name;
  const heroSkills = personalInfo.floatingSkills?.length
    ? personalInfo.floatingSkills
    : ["React", "Flutter", "Node.js", "Figma", "TypeScript"];

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
      <div className="container px-6 z-10 text-center flex flex-col items-center relative">
        {/* Greeting badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="inline-block py-1.5 px-5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-sm font-medium tracking-widest">
            {language === "ar" ? "مرحباً، أنا" : "HELLO, I'M"}
          </span>
        </motion.div>

        {/* Name — character reveal */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[7rem] font-extrabold mb-6 leading-tight"
        >
          {language === "ar" ? (
            // Arabic: animate word as a whole (avoid character splitting which breaks ligatures)
            <motion.span
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {name}
            </motion.span>
          ) : (
            // English: character-by-character animation
            name.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))
          )}
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="h-10 flex items-center justify-center mb-12"
        >
          <span className="text-xl md:text-2xl font-semibold text-primary tabular-nums">
            {typedRole}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-6 bg-primary ml-1 align-middle"
            />
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <MagneticButton
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full px-8 py-6 text-base font-semibold group shadow-xl shadow-primary/30"
          >
            {t.hero.viewWork}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-base font-medium hover:border-primary/60 hover:text-primary transition-all duration-300"
          >
            {language === "ar" ? "تواصل معي" : "Contact Me"}
          </motion.button>
        </motion.div>

        {/* Tech pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-wrap gap-2 justify-center mt-12 max-w-md"
        >
          {heroSkills.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + i * 0.08 }}
              className="text-xs font-mono text-muted-foreground border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
      >
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none"
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          type="button"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Scroll</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
        </motion.button>
      </motion.div>
    </section>
  );
}
