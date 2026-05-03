import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Briefcase } from "lucide-react";

function ExperienceItem({ exp, index, language }: { exp: any; index: number; language: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["0 1", "0.6 1"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className={`flex flex-col md:flex-row w-full md:items-center gap-0 mb-8 md:mb-16 group`}
      data-testid={`experience-${exp.id}`}
    >
      {/* Desktop Layout */}
      {isLeft ? (
        <>
          {/* Content Card - Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="hidden md:flex md:w-[calc(50%-40px)] md:justify-end md:pr-8 group/card"
          >
            <div className="glass rounded-2xl p-6 w-full group-hover/card:border-primary/50 group-hover/card:shadow-lg group-hover/card:shadow-primary/20 transition-all duration-300 border-l-2 border-primary/30">
              <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">{exp.period}</span>
              <h3 className="text-xl font-bold mt-3 mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {language === "ar" ? exp.roleAr : exp.role}
              </h3>
              <h4 className="text-base text-primary font-bold mb-4">{exp.company}</h4>
              <p className="text-muted-foreground/90 text-sm leading-relaxed">
                {language === "ar" ? exp.descriptionAr : exp.description}
              </p>
            </div>
          </motion.div>

          {/* Center Icon + Line */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 }}
            className="hidden md:flex md:w-20 md:justify-center md:relative md:z-10 md:flex-col md:items-center"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 border-4 border-background flex items-center justify-center shadow-xl shadow-primary/40">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            {/* Connection line to card */}
            <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/0" />
          </motion.div>

          {/* Right side (empty for left items) */}
          <div className="hidden md:flex md:w-[calc(50%-40px)] md:pl-8" />
        </>
      ) : (
        <>
          {/* Left side (empty for right items) */}
          <div className="hidden md:flex md:w-[calc(50%-40px)] md:pr-8" />

          {/* Center Icon + Line */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 }}
            className="hidden md:flex md:w-20 md:justify-center md:relative md:z-10 md:flex-col md:items-center"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 border-4 border-background flex items-center justify-center shadow-xl shadow-primary/40">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            {/* Connection line to card */}
            <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-gradient-to-l from-primary/60 to-primary/0" />
          </motion.div>

          {/* Content Card - Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="hidden md:flex md:w-[calc(50%-40px)] md:justify-start md:pl-8 group/card"
          >
            <div className="glass rounded-2xl p-6 w-full group-hover/card:border-primary/50 group-hover/card:shadow-lg group-hover/card:shadow-primary/20 transition-all duration-300 border-r-2 border-primary/30">
              <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">{exp.period}</span>
              <h3 className="text-xl font-bold mt-3 mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {language === "ar" ? exp.roleAr : exp.role}
              </h3>
              <h4 className="text-base text-primary font-bold mb-4">{exp.company}</h4>
              <p className="text-muted-foreground/90 text-sm leading-relaxed">
                {language === "ar" ? exp.descriptionAr : exp.description}
              </p>
            </div>
          </motion.div>
        </>
      )}

      {/* Mobile layout — styled like Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="md:hidden glass rounded-2xl p-6 group hover:border-primary/40 transition-all duration-300"
      >
        <div className="flex gap-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 }}
            className="flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-bold">
                  {language === "ar" ? exp.roleAr : exp.role}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {exp.company}
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{exp.period}</span>
            <p className="text-muted-foreground leading-relaxed text-sm mt-3">
              {language === "ar" ? exp.descriptionAr : exp.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Experience() {
  const { language, experience } = usePortfolio();
  const t = translations[language];

  return (
    <section id="experience" className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "مسيرتي المهنية" : "CAREER PATH"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.experience.title}
          </h2>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Vertical center line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
          {/* Glow effect around line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 blur-xl" />
          
          {experience.map((exp, index) => (
            <ExperienceItem key={exp.id} exp={exp} index={index} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}
