import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useInView, animate } from "framer-motion";

import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import {
  SiReact, SiTypescript, SiNodedotjs, SiPython, SiFlutter, SiAndroid,
  SiFigma, SiDocker, SiMongodb, SiPostgresql, SiFirebase, SiGit,
  SiKotlin, SiSwift, SiCplusplus, SiNextdotjs, SiTailwindcss, SiDart
} from "react-icons/si";

/* ─── Skills list ──────────────────────────────────────── */
const SKILLS = [
  { icon: SiReact,       label: "React",      color: "#61DAFB" },
  { icon: SiFlutter,     label: "Flutter",    color: "#54C5F8" },
  { icon: SiNextdotjs,   label: "Next.js",    color: "#ffffff" },
  { icon: SiTypescript,  label: "TypeScript", color: "#3178C6" },
  { icon: SiNodedotjs,   label: "Node.js",    color: "#6CC24A" },
  { icon: SiPython,      label: "Python",     color: "#FFD43B" },
  { icon: SiCplusplus,   label: "C++",        color: "#00599C" },
  { icon: SiDart,        label: "Dart",       color: "#0175C2" },
  { icon: SiAndroid,     label: "Android",    color: "#3DDC84" },
  { icon: SiKotlin,      label: "Kotlin",     color: "#7F52FF" },
  { icon: SiSwift,       label: "Swift",      color: "#FA7343" },
  { icon: SiFigma,       label: "Figma",      color: "#F24E1E" },
  { icon: SiTailwindcss, label: "Tailwind",   color: "#06B6D4" },
  { icon: SiDocker,      label: "Docker",     color: "#2496ED" },
  { icon: SiMongodb,     label: "MongoDB",    color: "#47A248" },
  { icon: SiPostgresql,  label: "PostgreSQL", color: "#4169E1" },
  { icon: SiFirebase,    label: "Firebase",   color: "#FFCA28" },
  { icon: SiGit,         label: "Git",        color: "#F05032" },
];


/* ─── Hexagon avatar with animated border radius ──────────────── */
const HEX = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

function HexAvatar({ src, alt, floatingSkills }: { src: string; alt: string; floatingSkills: string[] }) {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 90, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 90, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    rotateY.set(x * 12);
    rotateX.set(-y * 12);
  };
  const onLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className="relative w-64 h-64 md:w-72 md:h-72 mx-auto select-none"
    >
      {/* outer glow pulse */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-8px] bg-primary/30 blur-2xl -z-10"
        style={{ clipPath: HEX }}
      />

      {/* spinning conic border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
        style={{
          clipPath: HEX,
          background: "conic-gradient(from 0deg, hsl(250 89% 70%), hsl(180 89% 70%), hsl(290 89% 70%), hsl(250 89% 70%))",
        }}
      />

      {/* image inset with animated border radius */}
      <motion.div
        animate={{ borderRadius: ["0%", "25%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[4px] overflow-hidden"
        style={{ clipPath: HEX }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110"
          data-testid="img-avatar"
        />
      </motion.div>

      {/* floating skill icons from personalInfo */}
      {floatingSkills.map((skillName, i) => {
        const skill = SKILLS.find(s => s.label === skillName);
        if (!skill) return null;
        
        const Icon = skill.icon;
        const angle = (i / floatingSkills.length) * Math.PI * 2;
        const distance = 140;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        return (
          <motion.div
            key={skill.label}
            animate={{ 
              rotate: 360,
              x: [x, x * 1.15, x],
              y: [y, y * 1.15, y],
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute w-12 h-12 rounded-lg bg-background/60 border border-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all group"
            style={{ left: "50%", top: "50%", marginLeft: "-24px", marginTop: "-24px" }}
            title={skill.label}
          >
            <Icon style={{ color: skill.color, fontSize: 20 }} className="group-hover:scale-110 transition-transform" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ─── Animated counter ─────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(motionVal, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return ctrl.stop;
  }, [inView, to, motionVal]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

/* ─── Stat card ────────────────────────────────────────── */
function StatCard({ to, suffix, label, delay }: { to: number; suffix: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="flex flex-col items-center px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 group"
    >
      <p className="text-3xl font-extrabold text-primary leading-none group-hover:scale-110 transition-transform duration-300">
        <CountUp to={to} suffix={suffix} />
      </p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-2 text-center leading-tight">
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Skill icon ───────────────────────────────────────── */
function SkillIcon({ icon: Icon, label, color, index }: { icon: any; label: string; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -4, scale: 1.1 }}
      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-colors group cursor-default"
    >
      <Icon style={{ color, fontSize: 26 }} className="transition-transform group-hover:scale-110 drop-shadow-sm" />
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors tracking-wide leading-none">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Main section ─────────────────────────────────────── */
export default function About() {
  const { language, personalInfo } = usePortfolio();
  const t = translations[language];
  const bio = language === "ar" ? personalInfo.bioAr : personalInfo.bio;

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* Soft ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — avatar + stats */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-8"
          >
            <HexAvatar src={personalInfo.avatarUrl} alt={personalInfo.name} floatingSkills={personalInfo.floatingSkills || ["React", "Flutter", "TypeScript", "Node.js", "Figma", "Next.js"]} />

            {/* Animated stat counters */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              <StatCard to={5}  suffix="+" label={t.about.yearsExp}      delay={0.1} />
              <StatCard to={50} suffix="+" label={t.about.projectsDone}  delay={0.2} />
              <StatCard to={30} suffix="+" label={t.about.happyClients}  delay={0.3} />
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-5">
              {language === "ar" ? "من أنا" : "ABOUT ME"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
              {t.about.title}
            </h2>
            <p className="text-base text-muted-foreground mb-10 leading-relaxed" data-testid="text-bio">
              {bio}
            </p>

            {/* Skill icons */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-primary/60 inline-block" />
                {t.about.skills}
                <span className="w-4 h-px bg-primary/60 inline-block" />
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {SKILLS.map((skill, i) => (
                  <SkillIcon key={skill.label} {...skill} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
