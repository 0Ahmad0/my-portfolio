import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function Typewriter({ words }: { words: string[] }) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(words[0] ?? "");
  useEffect(() => {
    if (reduceMotion || !words.length) return;
    let word = 0,
      length = words[0].length,
      deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const text = words[word];
      length += deleting ? -1 : 1;
      setDisplayed(text.slice(0, length));
      let delay = deleting ? 40 : 75;
      if (length === 0) {
        deleting = false;
        word = (word + 1) % words.length;
      } else if (length === text.length) {
        deleting = true;
        delay = 1800;
      }
      timer = setTimeout(tick, delay);
    };
    setDisplayed(words[0]);
    timer = setTimeout(tick, 1800);
    return () => clearTimeout(timer);
  }, [words, reduceMotion]);
  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">
        {reduceMotion ? words[0] : displayed}
        <span className="typing-cursor">|</span>
      </span>
    </>
  );
}

export default function Hero() {
  const { language, personalInfo } = usePortfolio();
  const t = translations[language];
  const name = language === "ar" ? personalInfo.nameAr : personalInfo.name;
  const skills = personalInfo.floatingSkills?.length
    ? personalInfo.floatingSkills
    : ["React", "Flutter", "Node.js", "Figma", "TypeScript"];
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-20">
      <div className="container px-6 z-10 text-center flex flex-col items-center relative">
        <span className="mb-6 inline-block py-1.5 px-5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-widest">
          {language === "ar" ? "مرحباً، أنا" : "HELLO, I'M"}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[7rem] font-extrabold mb-6 leading-tight">
          {name}
        </h1>
        <div className="h-10 flex items-center justify-center mb-12 text-xl md:text-2xl font-semibold text-primary">
          <Typewriter key={language} words={t.hero.roles} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-semibold group shadow-xl shadow-primary/30"
            data-testid="button-hero-cta"
          >
            <a href="#projects">
              {t.hero.viewWork}
              <ArrowRight
                aria-hidden="true"
                className="ms-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </Button>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full border border-border bg-background/40 text-base font-medium hover:border-primary/60 hover:text-primary transition-colors"
          >
            {language === "ar" ? "تواصل معي" : "Contact Me"}
          </a>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-12 max-w-md">
          {skills.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono text-muted-foreground border border-border bg-background/40 px-3 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <a
        href="#about"
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 min-h-11 min-w-11 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
      >
        <span className="text-xs uppercase tracking-[0.2em]">
          {language === "ar" ? "اكتشف المزيد" : "Scroll"}
        </span>
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </a>
    </section>
  );
}
