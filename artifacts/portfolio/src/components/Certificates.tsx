import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function Certificates() {
  const { language, certificates } = usePortfolio();
  const t = translations[language];

  return (
    <section id="certificates" className="py-28 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 chamfer rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar"
              ? "الإنجازات والشهادات"
              : "ACHIEVEMENTS & CREDENTIALS"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.certificates.title}
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="engineering-card p-6 sm:p-7 group flex flex-col"
              data-testid={`certificate-${cert.id}`}
            >
              <div className="flex items-center justify-between gap-3 mb-6 mt-2">
                <div className="certificate-mark size-16 bg-primary/10 grid place-items-center shrink-0 text-primary">
                  <ShieldCheck aria-hidden="true" className="size-7" />
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-xs tracking-widest text-muted-foreground me-4"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-bold text-lg leading-snug mb-2">
                {language === "ar" ? cert.titleAr : cert.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {language === "ar" ? cert.issuerAr : cert.issuer}
              </p>
              <span className="text-xs font-mono text-muted-foreground mb-6">
                {cert.date}
              </span>
              <div className="mt-auto border-t border-border pt-4">
                {cert.credentialUrl?.trim() &&
                cert.credentialUrl.trim() !== "#" ? (
                  <a
                    href={cert.credentialUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 min-h-12 chamfer rounded-lg px-3 bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
                    aria-label={`${language === "ar" ? "عرض الشهادة" : "View certificate"}: ${language === "ar" ? cert.titleAr : cert.title}`}
                    data-testid={`cert-link-${cert.id}`}
                  >
                    <span>
                      {language === "ar" ? "عرض الشهادة" : "View certificate"}
                    </span>
                    <ExternalLink
                      aria-hidden="true"
                      className="size-5 shrink-0 rtl:-scale-x-100"
                    />
                  </a>
                ) : (
                  <div>
                    <button
                      type="button"
                      disabled
                      aria-describedby={`cert-unavailable-${cert.id}`}
                      className="flex w-full min-h-12 items-center justify-between gap-3 chamfer rounded-lg bg-muted px-3 text-sm font-medium text-muted-foreground cursor-not-allowed"
                    >
                      <span>
                        {language === "ar" ? "عرض الشهادة" : "View certificate"}
                      </span>
                      <ExternalLink
                        aria-hidden="true"
                        className="size-5 shrink-0 rtl:-scale-x-100"
                      />
                    </button>
                  </div>
                )}
                <p
                  id={`cert-unavailable-${cert.id}`}
                  className="mt-2 text-xs leading-relaxed text-muted-foreground"
                >
                  {cert.credentialUrl?.trim() &&
                  cert.credentialUrl.trim() !== "#"
                    ? language === "ar"
                      ? "يفتح في تبويب جديد"
                      : "Opens in a new tab"
                    : language === "ar"
                      ? "لم يُضف رابط الشهادة بعد"
                      : "Certificate link not added yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
