import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio, Project } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { ExternalLink, Github, ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ─── Image Carousel (used both on cards and in modal) ─── */
function Carousel({
  images,
  autoPlay = false,
  interval = 3000,
  className = "",
  aspectClass = "aspect-video",
  showDots = true,
}: {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  aspectClass?: string;
  showDots?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const next = useCallback(() => setCurrent(p => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, next, interval, total]);

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={current}
          src={images[current]}
          alt=""
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          {showDots && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Project Detail Modal ─── */
function ProjectModal({ project, language, t, onClose }: { project: Project; language: string; t: any; onClose: () => void }) {
  const images = project.images?.length ? project.images : [project.imageUrl];
  const title = language === "ar" ? project.titleAr : project.title;
  const description = language === "ar" ? project.descriptionAr : project.description;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative z-10 w-full max-w-3xl modal-glass rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Carousel */}
        <div className="relative">
          <Carousel images={images} autoPlay interval={4000} aspectClass="aspect-video" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute top-3 left-3 z-30">
            <Badge variant="secondary" className="backdrop-blur-md bg-background/70">{project.category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold leading-snug">{title}</h2>
            <div className="flex gap-2 shrink-0">
              {project.liveUrl && project.liveUrl !== "#" && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="gap-1.5 rounded-full">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {t.projects.viewLive}
                  </Button>
                </a>
              )}
              {project.githubUrl && project.githubUrl !== "#" && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </Button>
                </a>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-primary/90 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {tag}
              </span>
            ))}
          </div>

          {images.length > 1 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {language === "ar" ? "صور المشروع" : "Project Screenshots"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-border/40">
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, language, t, onOpen }: { project: Project; language: string; t: any; onOpen: () => void }) {
  const images = project.images?.length ? project.images : [project.imageUrl];
  const title = language === "ar" ? project.titleAr : project.title;
  const description = language === "ar" ? project.descriptionAr : project.description;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group glass rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
      data-testid={`project-card-${project.id}`}
      onClick={onOpen}
    >
      {/* Carousel image area */}
      <div className="relative aspect-video overflow-hidden">
        <Carousel images={images} autoPlay={false} showDots={images.length > 1} />
        {/* hover overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 backdrop-blur-sm">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
          >
            {language === "ar" ? "عرض التفاصيل" : "View Details"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
          {project.liveUrl && project.liveUrl !== "#" && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-white/20 backdrop-blur border border-white/30 text-white rounded-full hover:bg-white/30 transition-colors"
              onClick={(e) => e.stopPropagation()}
              title={t.projects.viewLive}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
          {project.githubUrl && project.githubUrl !== "#" && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 bg-white/20 backdrop-blur border border-white/30 text-white rounded-full hover:bg-white/30 transition-colors"
              onClick={(e) => e.stopPropagation()}
              title={t.projects.viewGithub}
            >
              <Github className="w-4 h-4" />
            </motion.a>
          )}
        </div>
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-[15]">
          <Badge variant="secondary" className="text-xs backdrop-blur-md bg-background/70">{project.category}</Badge>
        </div>
        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-[15] text-xs font-mono bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {images.length} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold mb-2 leading-snug group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-[10px] font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function Projects() {
  const { language, projects } = usePortfolio();
  const t = translations[language];
  const [filter, setFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: "All", label: t.projects.filterAll },
    { id: "Web", label: t.projects.filterWeb },
    { id: "Mobile", label: t.projects.filterMobile },
    { id: "Design", label: t.projects.filterDesign },
  ];

  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-28 relative bg-muted/20">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "معرض الأعمال" : "PORTFOLIO"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{t.projects.title}</h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
              }`}
              data-testid={`filter-${cat.id.toLowerCase()}`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: index * 0.07 } }}
                exit={{ opacity: 0 }}
              >
                <ProjectCard
                  project={project}
                  language={language}
                  t={t}
                  onOpen={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-muted-foreground">
            {language === "ar" ? "لا توجد مشاريع في هذه الفئة" : "No projects in this category yet"}
          </motion.div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            language={language}
            t={t}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
