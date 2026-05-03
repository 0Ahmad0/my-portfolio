import { motion } from "framer-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { GraduationCap, Calendar, Award } from "lucide-react";

export default function Education() {
  const { language, education } = usePortfolio();
  const t = translations[language];

  return (
    <section id="education" className="py-28 relative bg-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "الخلفية الأكاديمية" : "ACADEMIC BACKGROUND"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.education.title}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass rounded-2xl p-8 group hover:border-primary/40 transition-all duration-300"
              data-testid={`education-${edu.id}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold">
                        {language === "ar" ? edu.degreeAr : edu.degree}
                        {" — "}
                        <span className="text-primary">{language === "ar" ? edu.fieldAr : edu.field}</span>
                      </h3>
                      <p className="text-muted-foreground font-medium mt-1">
                        {language === "ar" ? edu.institutionAr : edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {edu.gpa && (
                        <span className="flex items-center gap-1.5 text-sm font-mono bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <Award className="w-3.5 h-3.5" />
                          {t.education.gpa}: {edu.gpa}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.period}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {language === "ar" ? edu.descriptionAr : edu.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
