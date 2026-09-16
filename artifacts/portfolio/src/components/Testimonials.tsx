import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ChevronLeft, ChevronRight, MapPin, Quote, Star } from "lucide-react";
import { usePortfolio, type Testimonial } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import ResponsiveImage from "@/components/ResponsiveImage";
import { countryName } from "@/lib/countries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Testimonials() {
  const { language, testimonials } = usePortfolio();
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [current, setCurrent] = useState(0);
  const reviewTrigger = useRef<HTMLButtonElement | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const t = translations[language];

  const localized = (testimonial: Testimonial) => ({
    name:
      language === "ar"
        ? testimonial.nameAr || testimonial.name
        : testimonial.name,
    role:
      language === "ar"
        ? testimonial.roleAr || testimonial.role
        : testimonial.role,
    company:
      language === "ar"
        ? testimonial.companyAr || testimonial.company
        : testimonial.company,
    text:
      language === "ar"
        ? testimonial.textAr || testimonial.text
        : testimonial.text,
    highlight:
      language === "ar"
        ? testimonial.highlightAr || testimonial.highlight
        : testimonial.highlight,
    country: countryName(testimonial.countryCode, language),
  });

  const goTo = (index: number) => {
    if (!testimonials.length) return;
    const next = (index + testimonials.length) % testimonials.length;
    const slider = sliderRef.current;
    const card = slider?.children[next];
    if (!slider || !card) return;
    const sliderBox = slider.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    setCurrent(next);
    slider.scrollBy({
      behavior: reduceMotion ? "auto" : "smooth",
      left:
        language === "ar"
          ? cardBox.right - sliderBox.right
          : cardBox.left - sliderBox.left,
    });
  };

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/15 via-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-500/10 via-primary/8 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "الآراء" : "FEEDBACK"}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div
          ref={sliderRef}
          onScroll={(event) => {
            const container = event.currentTarget.getBoundingClientRect();
            const index = Array.from(event.currentTarget.children).findIndex(
              (child) => {
                const card = child.getBoundingClientRect();
                return (
                  card.left >= container.left - 2 &&
                  card.right <= container.right + 2
                );
              },
            );
            if (index >= 0) setCurrent(index);
          }}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth max-w-7xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-label={
            language === "ar" ? "تقييمات العملاء" : "Client testimonials"
          }
        >
          {testimonials.map((testimonial, index) => {
            const content = localized(testimonial);
            const highlights = content.highlight
              .split("·")
              .map((item) => item.trim())
              .filter(Boolean);

            return (
              <article
                key={testimonial.id}
                className="w-full md:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)] flex-none snap-start min-h-[350px] rounded-3xl border border-primary/25 bg-background/65 backdrop-blur-xl p-5 flex flex-col shadow-lg shadow-primary/5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div
                    className="flex items-center gap-1"
                    role="img"
                    aria-label={`${testimonial.rating} / 5`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`w-4 h-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 border border-border/60 rounded-full px-2.5 py-1">
                    <MapPin
                      aria-hidden="true"
                      className="w-3.5 h-3.5 text-primary"
                    />
                    {content.country}
                  </span>
                </div>

                <Quote
                  aria-hidden="true"
                  className="w-8 h-8 text-primary/35 mb-3"
                />
                <p className="text-sm leading-relaxed text-foreground/90 line-clamp-4 mb-2">
                  {content.text}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    reviewTrigger.current = event.currentTarget;
                    setSelected(testimonial);
                  }}
                  className="self-start min-h-11 text-sm font-semibold text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1"
                >
                  {language === "ar"
                    ? "قراءة التقييم كاملًا"
                    : "Read full review"}
                </button>

                <div className="min-h-14 mt-1">
                  {highlights.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        {language === "ar"
                          ? "أبرز ما يميّز التجربة"
                          : "Experience highlights"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="text-xs rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-auto pt-5 border-t border-border/60 flex items-center gap-3">
                  {testimonial.imageUrl ? (
                    <ResponsiveImage
                      src={testimonial.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                      sizes="48px"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 shrink-0"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/25 text-primary flex items-center justify-center text-lg font-bold shrink-0"
                    >
                      {content.name.trim().charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{content.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {content.role}
                      {content.company ? ` · ${content.company}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* No dir override: in RTL the row flips, so "previous" sits on the right — where Arabic readers expect it. */}
        <div className="flex items-center justify-center gap-3 mt-7">
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            aria-label={
              language === "ar" ? "التقييم السابق" : "Previous testimonial"
            }
            className="w-11 h-11 rounded-full border border-primary/30 bg-background/70 text-primary flex items-center justify-center hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          >
            {language === "ar" ? (
              <ChevronRight aria-hidden="true" className="w-5 h-5" />
            ) : (
              <ChevronLeft aria-hidden="true" className="w-5 h-5" />
            )}
          </button>
          <span
            className="min-w-14 text-center text-sm text-muted-foreground"
            aria-live="polite"
          >
            {current + 1} / {testimonials.length}
          </span>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            aria-label={
              language === "ar" ? "التقييم التالي" : "Next testimonial"
            }
            className="w-11 h-11 rounded-full border border-primary/30 bg-background/70 text-primary flex items-center justify-center hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          >
            {language === "ar" ? (
              <ChevronLeft aria-hidden="true" className="w-5 h-5" />
            ) : (
              <ChevronRight aria-hidden="true" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        {selected &&
          (() => {
            const content = localized(selected);
            return (
              <DialogContent
                closeLabel={language === "ar" ? "إغلاق" : "Close"}
                className="max-w-2xl max-h-[85vh]"
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  reviewTrigger.current?.focus();
                }}
              >
                <DialogHeader>
                  <DialogTitle>{content.name}</DialogTitle>
                  <DialogDescription>
                    {content.role}
                    {content.company ? ` · ${content.company}` : ""} ·{" "}
                    {content.country}
                  </DialogDescription>
                </DialogHeader>
                <div
                  className="flex items-center gap-1 my-5"
                  role="img"
                  aria-label={`${selected.rating} / 5`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={`w-5 h-5 ${i < selected.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-foreground/90">
                  {content.text}
                </p>
              </DialogContent>
            );
          })()}
      </Dialog>
    </section>
  );
}
