import ResponsiveImage from "@/components/ResponsiveImage";
import { Code2 } from "lucide-react";

import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiFlutter,
  SiAndroid,
  SiFigma,
  SiDocker,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiGit,
  SiKotlin,
  SiSwift,
  SiCplusplus,
  SiNextdotjs,
  SiTailwindcss,
  SiDart,
} from "react-icons/si";

/* ─── Skills list ──────────────────────────────────────── */
const SKILLS = [
  { icon: SiReact, label: "React", color: "#61DAFB" },
  { icon: SiFlutter, label: "Flutter", color: "#54C5F8" },
  { icon: SiNextdotjs, label: "Next.js", color: "currentColor" },
  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { icon: SiNodedotjs, label: "Node.js", color: "#6CC24A" },
  { icon: SiPython, label: "Python", color: "#FFD43B" },
  { icon: SiCplusplus, label: "C++", color: "#00599C" },
  { icon: SiDart, label: "Dart", color: "#0175C2" },
  { icon: SiAndroid, label: "Android", color: "#3DDC84" },
  { icon: SiKotlin, label: "Kotlin", color: "#7F52FF" },
  { icon: SiSwift, label: "Swift", color: "#FA7343" },
  { icon: SiFigma, label: "Figma", color: "#F24E1E" },
  { icon: SiTailwindcss, label: "Tailwind", color: "#06B6D4" },
  { icon: SiDocker, label: "Docker", color: "#2496ED" },
  { icon: SiMongodb, label: "MongoDB", color: "#47A248" },
  { icon: SiPostgresql, label: "PostgreSQL", color: "#4169E1" },
  { icon: SiFirebase, label: "Firebase", color: "#FFCA28" },
  { icon: SiGit, label: "Git", color: "#F05032" },
];

const getSkill = (label: string) =>
  SKILLS.find((s) => s.label.toLowerCase() === label.toLowerCase()) || {
    icon: Code2,
    label,
    color: "hsl(var(--primary))",
  };

/* ─── Hexagon avatar ───────────────────────────────────── */
const HEX = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

function HexAvatar({
  src,
  alt,
  floatingSkills,
}: {
  src: string;
  alt: string;
  floatingSkills: string[];
}) {
  return (
    <div className="relative w-64 h-64 md:w-72 md:h-72 mx-auto select-none">
      {/* outer glow */}
      <div
        className="absolute inset-[-8px] bg-primary/30 blur-2xl -z-10"
        style={{ clipPath: HEX }}
      />

      {/* conic border */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: HEX,
          background:
            "conic-gradient(from 0deg, hsl(250 89% 70%), hsl(180 89% 70%), hsl(290 89% 70%), hsl(250 89% 70%))",
        }}
      />

      {/* image inset */}
      <div
        className="absolute inset-[4px] overflow-hidden"
        style={{ clipPath: HEX }}
      >
        <ResponsiveImage
          src={src}
          sizes="(min-width: 768px) 288px, 256px"
          alt={alt}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-300 scale-110"
          data-testid="img-avatar"
        />
      </div>

      {/* floating skill icons from personalInfo */}
      {floatingSkills.map((skillName, i) => {
        const skill = getSkill(skillName);

        const Icon = skill.icon;
        const angle = (i / floatingSkills.length) * Math.PI * 2;
        const distance = 140;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <div
            key={`${skill.label}-${i}`}
            className="absolute w-12 h-12 rounded-lg bg-background/60 border border-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all group"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-24px",
              marginTop: "-24px",
              transform: `translate(${x}px, ${y}px)`,
            }}
            aria-hidden="true"
            title={skill.label}
          >
            <Icon
              aria-hidden="true"
              style={{ color: skill.color, fontSize: 20 }}
              className="group-hover:scale-110 transition-transform"
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Stat card ────────────────────────────────────────── */
function StatCard({
  to,
  suffix,
  label,
}: {
  to: number;
  suffix: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 group">
      <p className="text-3xl font-extrabold text-primary leading-none group-hover:scale-110 transition-transform duration-300">
        <span className="tabular-nums">
          {to}
          {suffix}
        </span>
      </p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-2 text-center leading-tight">
        {label}
      </p>
    </div>
  );
}

/* ─── Skill icon ───────────────────────────────────────── */
function SkillIcon({
  icon: Icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-colors group cursor-default">
      <Icon
        aria-hidden="true"
        style={{ color, fontSize: 26 }}
        className="transition-transform group-hover:scale-110 drop-shadow-sm"
      />
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors tracking-wide leading-none">
        {label}
      </span>
    </div>
  );
}

/* ─── Main section ─────────────────────────────────────── */
export default function About() {
  const { language, personalInfo } = usePortfolio();
  const t = translations[language];
  const bio = t.about.description;
  const floatingSkills = personalInfo.floatingSkills
    .filter(Boolean)
    .slice(0, 6);
  const coreSkills = personalInfo.coreSkills.filter(Boolean);

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* Soft ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — avatar + stats */}
          <div className="flex flex-col items-center gap-8">
            <HexAvatar
              src={personalInfo.avatarUrl}
              alt={personalInfo.name}
              floatingSkills={floatingSkills}
            />

            {/* Experience statistics */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              <StatCard to={4} suffix="+" label={t.about.yearsExp} />
              <StatCard to={20} suffix="+" label={t.about.projectsDone} />
              <StatCard to={15} suffix="+" label={t.about.happyClients} />
            </div>
          </div>

          {/* Right — content */}
          <div>
            <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-5">
              {language === "ar" ? "من أنا" : "ABOUT ME"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
              {t.about.title}
            </h2>
            <p
              className="text-base text-muted-foreground mb-10 leading-relaxed"
              data-testid="text-bio"
            >
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
                {coreSkills.map((skillName, i) => (
                  <SkillIcon
                    key={`${skillName}-${i}`}
                    {...getSkill(skillName)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
