import { usePortfolio } from "@/contexts/PortfolioContext";
import { Linkedin } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const { language, personalInfo } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tighter mb-2">
              ALEX<span className="text-primary">.DEV</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              © {year} {language === "ar" ? personalInfo.nameAr : personalInfo.name}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:bg-muted transition-colors"
                aria-label="GitHub"
                data-testid="link-github"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:bg-muted transition-colors text-[#0A66C2]"
                aria-label="LinkedIn"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {personalInfo.twitter && (
              <a
                href={personalInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:bg-muted transition-colors"
                aria-label="X (Twitter)"
                data-testid="link-twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}
