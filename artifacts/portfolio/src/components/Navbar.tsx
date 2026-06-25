import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTheme } from "next-themes";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Moon, Sun, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import VisitorCounter from "@/components/VisitorCounter";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = usePortfolio();
  const t = translations[language];
  const isRtl = language === "ar";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string, closeMenu = false) => {
    if (closeMenu) setIsMobileMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const navLinks = [
    { name: t.nav.about, id: "about" },
    { name: t.nav.projects, id: "projects" },
    { name: t.nav.experience, id: "experience" },
    { name: t.nav.education, id: "education" },
    { name: t.nav.certificates, id: "certificates" },
    { name: t.nav.contact, id: "contact" },
  ];
  const orderedNavLinks = isRtl ? [...navLinks].reverse() : navLinks;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/40 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
        <div className={`container mx-auto px-6 flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
          data-testid="link-home"
        >
          AHMAD<span className="text-primary">.DEV</span>
        </button>

        {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-6 ${isRtl ? "flex-row-reverse" : ""}`}>
            <ul className={`flex items-center gap-5 text-sm font-medium ${isRtl ? "flex-row-reverse" : ""}`}>
              {orderedNavLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo(link.id);
                    }}
                    className={`hover:text-primary transition-colors text-muted-foreground hover:text-foreground ${isRtl ? "text-right" : "text-left"}`}
                    data-testid={`link-${link.id}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className={`flex items-center gap-1 ${isRtl ? "border-r border-border/50 pr-5" : "border-l border-border/50 pl-5"}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                data-testid="button-lang-toggle"
                className="text-xs font-bold tracking-wider w-10 h-9 px-0"
            >
              {language === "en" ? "ع" : "EN"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <VisitorCounter />

            <Link href="/dashboard" data-testid="link-dashboard">
              <Button size="sm" className={`${isRtl ? "mr-1" : "ml-1"} gap-1.5 rounded-full`}>
                <LayoutDashboard className="w-3.5 h-3.5" />
                {t.nav.dashboard}
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile controls */}
        <div className={`flex items-center gap-2 lg:hidden ${isRtl ? "flex-row-reverse" : ""}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-xs font-bold w-9 h-9 px-0"
          >
            {language === "en" ? "ع" : "EN"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className={`container mx-auto px-6 py-5 flex flex-col gap-1 ${isRtl ? "items-end" : ""}`}>
              {orderedNavLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.id, true)}
                  type="button"
                  className={`py-3 px-2 text-base font-medium border-b border-border/40 last:border-0 hover:text-primary transition-colors ${isRtl ? "text-right" : "text-left"}`}
                >
                  {link.name}
                </motion.button>
              ))}
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full mt-4 gap-2 rounded-full">
                  <LayoutDashboard className="w-4 h-4" />
                  {t.nav.dashboard}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
