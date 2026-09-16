import { useRef, useState } from "react";
import { usePortfolio, type Project } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Smartphone,
  Apple,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ResponsiveImage from "@/components/ResponsiveImage";

function Carousel({
  images,
  title,
  language,
  large = false,
}: {
  images: string[];
  title: string;
  language: string;
  large?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const index = current < total ? current : 0;
  if (!total) return <div className="aspect-video bg-muted" />;
  return (
    <div className="relative aspect-video bg-muted overflow-hidden">
      <ResponsiveImage
        src={images[index]}
        alt={`${title} — ${index + 1}`}
        loading={large ? "eager" : "lazy"}
        sizes={
          large
            ? "(min-width: 768px) 720px, 90vw"
            : "(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
        }
        className="absolute inset-0 w-full h-full object-cover"
      />
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrent((index - 1 + total) % total)}
            aria-label={
              language === "ar"
                ? `الصورة السابقة: ${title}`
                : `Previous image: ${title}`
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 chamfer rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-black"
          >
            <ChevronLeft aria-hidden="true" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((index + 1) % total)}
            aria-label={
              language === "ar"
                ? `الصورة التالية: ${title}`
                : `Next image: ${title}`
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 chamfer rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-black"
          >
            <ChevronRight aria-hidden="true" className="w-5 h-5" />
          </button>
          <span
            className="absolute bottom-2 left-1/2 -translate-x-1/2 chamfer rounded-full bg-black/75 text-white text-xs px-3 py-1 tabular-nums"
            aria-live={large ? "polite" : "off"}
          >
            {index + 1} / {total}
          </span>
        </>
      )}
    </div>
  );
}

function ProjectLinks({
  project,
  title,
  language,
}: {
  project: Project;
  title: string;
  language: "ar" | "en";
}) {
  const links = [
    {
      href: project.liveUrl,
      label: translations[language].projects.viewLive,
      Icon: ArrowUpRight,
    },
    { href: project.githubUrl, label: "GitHub", Icon: Github },
    { href: project.androidUrl, label: "Android", Icon: Smartphone },
    { href: project.iosUrl, label: "iOS", Icon: Apple },
  ].filter((link) => link.href && link.href !== "#");
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ href, label, Icon }) => (
        <Button
          asChild
          key={label}
          variant="outline"
          size="sm"
          className="min-h-11 rounded-full"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}: ${title}`}
          >
            <Icon aria-hidden="true" className="w-4 h-4" />
            {label}
          </a>
        </Button>
      ))}
    </div>
  );
}

export default function Projects() {
  const { language, projects } = usePortfolio();
  const t = translations[language];
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const categories = [
    { id: "All", label: t.projects.filterAll },
    { id: "Web", label: t.projects.filterWeb },
    { id: "Mobile", label: t.projects.filterMobile },
    { id: "Design", label: t.projects.filterDesign },
  ];
  const visible = projects.filter(
    (p) => p.isPublished && (filter === "All" || p.category === filter),
  );
  const projectImages = (p: Project) => [
    ...new Set((p.images?.length ? p.images : [p.imageUrl]).filter(Boolean)),
  ];
  const titleOf = (p: Project) =>
    language === "ar" ? p.titleAr || p.title : p.title;
  return (
    <section id="projects" className="py-28 relative bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <span className="inline-block py-1 px-3 chamfer rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "معرض الأعمال" : "PORTFOLIO"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.projects.title}
          </h2>
        </div>
        <div
          className="flex justify-center flex-wrap gap-2 mb-12"
          role="group"
          aria-label={language === "ar" ? "تصفية المشاريع" : "Filter projects"}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              aria-pressed={filter === cat.id}
              className={`min-h-11 px-5 py-2 chamfer rounded-full text-sm font-medium transition-colors ${filter === cat.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-border"}`}
              data-testid={`filter-${cat.id.toLowerCase()}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((project) => (
            <article
              key={project.id}
              className="engineering-card group flex flex-col transition-[transform,border-color,box-shadow] hover:border-primary/50"
              data-testid={`project-card-${project.id}`}
            >
              <Carousel
                key={project.id}
                images={projectImages(project)}
                title={titleOf(project)}
                language={language}
              />
              <div className="p-5 flex-1 flex flex-col gap-3">
                <Badge variant="secondary" className="self-start">
                  {project.category}
                </Badge>
                <h3 className="text-base font-bold leading-snug">
                  <button
                    type="button"
                    onClick={(event) => {
                      trigger.current = event.currentTarget;
                      setSelected(project);
                    }}
                    aria-haspopup="dialog"
                    className="min-h-11 w-full text-start hover:text-primary flex items-center justify-between gap-2"
                  >
                    {titleOf(project)}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="w-5 h-5 shrink-0"
                    />
                  </button>
                </h3>
                <p className="text-muted-foreground text-sm flex-1 leading-relaxed line-clamp-2">
                  {language === "ar"
                    ? project.descriptionAr || project.description
                    : project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 chamfer rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ProjectLinks
                  project={project}
                  title={titleOf(project)}
                  language={language}
                />
              </div>
            </article>
          ))}
        </div>
        {!visible.length && (
          <p className="text-center py-20 text-muted-foreground">
            {language === "ar"
              ? "لا توجد مشاريع في هذه الفئة"
              : "No projects in this category yet"}
          </p>
        )}
      </div>
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        {selected && (
          <DialogContent
            closeLabel={language === "ar" ? "إغلاق" : "Close"}
            className="max-w-3xl rounded-3xl"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              trigger.current?.focus();
            }}
          >
            <DialogTitle className="text-2xl font-bold pe-10 mb-4">
              {titleOf(selected)}
            </DialogTitle>
            <Carousel
              key={selected.id}
              images={projectImages(selected)}
              title={titleOf(selected)}
              language={language}
              large
            />
            <DialogDescription className="my-6 text-base leading-relaxed">
              {language === "ar"
                ? selected.descriptionAr || selected.description
                : selected.description}
            </DialogDescription>
            <ProjectLinks
              project={selected}
              title={titleOf(selected)}
              language={language}
            />
            <div className="flex flex-wrap gap-2 mt-5">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 chamfer rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            {projectImages(selected).length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
                {projectImages(selected).map((src, i) => (
                  <ResponsiveImage
                    key={src}
                    src={src}
                    alt={`${titleOf(selected)} — ${i + 1}`}
                    sizes="(min-width: 640px) 230px, 42vw"
                    className="aspect-video w-full object-cover chamfer rounded-xl"
                  />
                ))}
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
