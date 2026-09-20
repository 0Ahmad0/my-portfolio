import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "wouter";
import { useTheme } from "next-themes";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import {
  Moon,
  Sun,
  Menu,
  X,
  LayoutDashboard,
  House,
  UserRound,
  FolderKanban,
  BriefcaseBusiness,
  GraduationCap,
  BadgeCheck,
  MessageSquareQuote,
  Mail,
  ChevronRight,
  Languages,
} from "lucide-react";
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
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMobileMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

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
    { name: t.nav.about, id: "about", icon: UserRound },
    { name: t.nav.projects, id: "projects", icon: FolderKanban },
    { name: t.nav.experience, id: "experience", icon: BriefcaseBusiness },
    { name: t.nav.education, id: "education", icon: GraduationCap },
    { name: t.nav.certificates, id: "certificates", icon: BadgeCheck },
    {
      name: t.nav.testimonials,
      id: "testimonials",
      icon: MessageSquareQuote,
    },
    { name: t.nav.contact, id: "contact", icon: Mail },
  ];

  return (
    <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <header
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border/40 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <Dialog.Trigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-11 shrink-0 rounded-xl bg-card lg:hidden"
              aria-label={isRtl ? "فتح القائمة الرئيسية" : "Open main menu"}
              data-testid="button-mobile-menu"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Button>
          </Dialog.Trigger>
          <a
            href="#"
            onClick={handleLogoTap}
            className="inline-flex items-center me-auto lg:me-0 text-lg sm:text-xl font-bold tracking-tighter min-h-11 shrink-0 hover:opacity-80 transition-opacity"
            data-testid="link-home"
          >
            <span dir="ltr">
              AHMAD<span className="text-primary">.DEV</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4">
            <ul className="flex items-center gap-4 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-start text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-${link.id}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1 border-s border-border/50 ps-5">
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
          <div className="flex items-center gap-2 lg:hidden">
            <VisitorCounter />
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
          </div>
        </div>
      </header>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[60] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-200"
          data-testid="mobile-menu-overlay"
        />
        <Dialog.Content
          dir={isRtl ? "rtl" : "ltr"}
          className={`fixed top-0 z-[70] flex h-dvh w-[calc(100%-2.5rem)] max-w-sm flex-col overflow-hidden bg-card text-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out duration-300 ${isRtl ? "right-0 rounded-e-3xl border-e border-border data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right" : "left-0 rounded-e-3xl border-e border-border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"}`}
          data-testid="mobile-drawer"
        >
          <div className="shrink-0 border-b border-border bg-primary/5 px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span dir="ltr" className="text-lg font-bold tracking-tight">
                AHMAD<span className="text-primary">.DEV</span>
              </span>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 rounded-full bg-card"
                  aria-label={isRtl ? "إغلاق القائمة" : "Close menu"}
                  data-testid="button-menu-close"
                >
                  <X aria-hidden="true" className="size-5" />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Title className="text-start text-xl font-bold">
              {isRtl ? "استكشف الموقع" : "Explore the site"}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-start text-sm leading-relaxed text-muted-foreground">
              {isRtl
                ? "أعمالي، خبراتي، وطرق التواصل معي."
                : "My work, experience, and ways to connect."}
            </Dialog.Description>
          </div>
          <nav
            id="mobile-navigation"
            aria-label={isRtl ? "التنقل الرئيسي" : "Main navigation"}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
          >
            <ul className="space-y-1">
              {[
                {
                  name: isRtl ? "الرئيسية" : "Home",
                  id: "main-content",
                  icon: House,
                },
                ...navLinks,
              ].map(({ name, id, icon: Icon }) => (
                <li key={id}>
                  <Dialog.Close asChild>
                    <a
                      href={`#${id}`}
                      className="group flex min-h-14 items-center gap-3 chamfer rounded-2xl px-3 py-2 text-start font-medium hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:outline-offset-[-2px] transition-colors"
                    >
                      <span className="grid size-10 shrink-0 place-items-center chamfer rounded-xl bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span className="flex-1">{name}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
                      />
                    </a>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
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
          </nav>
          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-border px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Button
              variant="outline"
              className="min-h-20 flex-col gap-2 rounded-2xl px-2 py-3"
              onClick={() => setLanguage(isRtl ? "en" : "ar")}
              data-testid="button-drawer-language"
            >
              <Languages aria-hidden="true" className="size-5 text-primary" />
              <span lang={isRtl ? "en" : "ar"}>
                {isRtl ? "English" : "العربية"}
              </span>
            </Button>
            <Button
              variant="outline"
              className="min-h-20 flex-col gap-2 rounded-2xl px-2 py-3"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-drawer-theme"
            >
              {theme === "dark" ? (
                <Sun aria-hidden="true" className="size-5 text-primary" />
              ) : (
                <Moon aria-hidden="true" className="size-5 text-primary" />
              )}
              <span>
                {theme === "dark"
                  ? isRtl
                    ? "الوضع الفاتح"
                    : "Light mode"
                  : isRtl
                    ? "الوضع الداكن"
                    : "Dark mode"}
              </span>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
