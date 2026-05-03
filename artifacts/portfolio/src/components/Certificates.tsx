import { motion } from "framer-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function Certificates() {
  const { language, certificates } = usePortfolio();
  const t = translations[language];

  return (
    <section id="certificates" className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "الإنجازات والشهادات" : "ACHIEVEMENTS & CREDENTIALS"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.certificates.title}
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 group relative overflow-hidden cursor-default"
              data-testid={`certificate-${cert.id}`}
            >
              {/* Colored top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: cert.badgeColor }}
              />

              <div className="flex items-start justify-between gap-3 mb-4 mt-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${cert.badgeColor}20`, border: `1px solid ${cert.badgeColor}40` }}
                >
                  <ShieldCheck className="w-6 h-6" style={{ color: cert.badgeColor }} />
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-muted"
                    title={t.certificates.verify}
                    data-testid={`cert-link-${cert.id}`}
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </div>

              <h3 className="font-bold text-base leading-snug mb-1">
                {language === "ar" ? cert.titleAr : cert.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {language === "ar" ? cert.issuerAr : cert.issuer}
              </p>
              <span
                className="inline-block text-xs font-mono px-2 py-0.5 rounded"
                style={{ background: `${cert.badgeColor}15`, color: cert.badgeColor }}
              >
                {cert.date}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
