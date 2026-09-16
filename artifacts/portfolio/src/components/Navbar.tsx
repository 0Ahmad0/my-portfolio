import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useTheme } from "next-themes";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Moon, Sun, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisitorCounter from "@/components/VisitorCounter";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = usePortfolio();
  const t = translations[language];
  const isRtl = language === "ar";
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isMobileMenuOpen]);

  const handleLogoTap = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setShowDashboard(true);
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 2000);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/40 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <a
          href="#"
          onClick={handleLogoTap}
          className="inline-flex items-center text-lg sm:text-xl font-bold tracking-tighter min-h-11 shrink-0 hover:opacity-80 transition-opacity"
          data-testid="link-home"
        >
          AHMAD<span className="text-primary">.DEV</span>
        </a>

        {/* Desktop Nav */}
        <nav
          className={`hidden lg:flex items-center gap-6 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <ul
            className={`flex items-center gap-5 text-sm font-medium ${isRtl ? "flex-row-reverse" : ""}`}
          >
            {orderedNavLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`hover:text-primary transition-colors text-muted-foreground hover:text-foreground ${isRtl ? "text-right" : "text-left"}`}
                  data-testid={`link-${link.id}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`flex items-center gap-1 ${isRtl ? "border-r border-border/50 pr-5" : "border-l border-border/50 pl-5"}`}
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label={isRtl ? "Switch to English" : "التبديل إلى العربية"}
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              data-testid="button-lang-toggle"
              className="text-xs font-bold tracking-wider w-11 h-11 px-0"
            >
              {language === "en" ? "ع" : "EN"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              aria-label={isRtl ? "تبديل المظهر" : "Toggle color theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <VisitorCounter />

            {showDashboard && (
              <div>
                <Button
                  asChild
                  size="sm"
                  className={`${isRtl ? "mr-1" : "ml-1"} gap-1.5 rounded-full`}
                >
                  <Link href="/dashboard" data-testid="link-dashboard">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {t.nav.dashboard}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile controls */}
        <div
          className={`flex items-center gap-2 lg:hidden ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <span className="hidden sm:block">
            <VisitorCounter />
          </span>
          <Button
            variant="ghost"
            size="sm"
            aria-label={isRtl ? "Switch to English" : "التبديل إلى العربية"}
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-xs font-bold w-11 h-11 px-0"
          >
            {language === "en" ? "ع" : "EN"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            aria-label={isRtl ? "تبديل المظهر" : "Toggle color theme"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            ref={menuButton}
            aria-label={isRtl ? "القائمة الرئيسية" : "Main menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="navigation"
          aria-label={isRtl ? "التنقل الرئيسي" : "Main navigation"}
          className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl overflow-hidden"
        >
          <div
            className={`container mx-auto px-6 py-5 flex flex-col gap-1 ${isRtl ? "items-end" : ""}`}
          >
            {orderedNavLinks.map((link, i) => (
              <a
                href={`#${link.id}`}
                key={link.id}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-2 text-base font-medium border-b border-border/40 last:border-0 hover:text-primary transition-colors ${isRtl ? "text-right" : "text-left"}`}
              >
                {link.name}
              </a>
            ))}
            {showDashboard && (
              <Button asChild className="w-full mt-4 gap-2 rounded-full">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.nav.dashboard}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
