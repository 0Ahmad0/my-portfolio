import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  usePortfolio,
  Project,
  Experience,
  Education,
  Certificate,
  Testimonial,
} from "@/contexts/PortfolioContext";
import { supabase } from "@/utils/supabase";
import { translations } from "@/lib/i18n";
import {
  ArrowLeft,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Award,
  User,
  LogOut,
  Code2,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  CertificateDialog,
  EducationDialog,
  ExperienceDialog,
  ProjectDialog,
  TestimonialDialog,
} from "./dashboard/DashboardEditors";
import { StatBadge } from "./dashboard/DashboardParts";
import {
  CertificatesSection,
  EducationSection,
  ExperienceSection,
  MessagesSection,
  PersonalInfoSection,
  ProjectsSection,
  TestimonialsSection,
  type ContactMessage,
} from "./dashboard/DashboardSections";

/* Tabs stay 44px-tall thumb targets and never shrink inside the mobile scroll strip.
   before:content-none drops .chamfer's cut-edge border redraw — a tab has no border
   so it paints nothing, but its skewed box inflates the strip's scrollHeight to 177px
   and lets focus/scrollIntoView shove the tabs out of view. */
const TAB =
  "shrink-0 snap-start chamfer [--cut:7px] before:content-none! gap-1.5 min-h-11 px-3 sm:min-h-9 data-[state=active]:shadow-sm";

/* ─── Main Dashboard ─────────────────────────────────── */
export default function Dashboard() {
  return (
    <MotionConfig reducedMotion="user">
      <DashboardContent />
    </MotionConfig>
  );
}

function DashboardContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const {
    language,
    projects,
    updateProject,
    addProject,
    experience,
    updateExperience,
    addExperience,
    education,
    updateEducation,
    addEducation,
    certificates,
    updateCertificate,
    addCertificate,
    testimonials,
    updateTestimonial,
    addTestimonial,
  } = usePortfolio();

  const t = translations[language];
  const d = t.dashboard;

  /* contact messages */
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async () => {
    if (!supabase) return;
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data as ContactMessage[]);
    setLoadingMessages(false);
  };

  const updateMessageStatus = async (
    id: string,
    status: "read" | "archived",
  ) => {
    if (!supabase) return;
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
    toast({ title: d.actions.saved });
  };

  useEffect(() => {
    if (isAuthenticated) fetchMessages();
  }, [isAuthenticated]);

  /* dialog state */
  const [projectDialog, setProjectDialog] = useState<{
    open: boolean;
    item?: Project;
  }>({ open: false });
  const [expDialog, setExpDialog] = useState<{
    open: boolean;
    item?: Experience;
  }>({ open: false });
  const [eduDialog, setEduDialog] = useState<{
    open: boolean;
    item?: Education;
  }>({ open: false });
  const [certDialog, setCertDialog] = useState<{
    open: boolean;
    item?: Certificate;
  }>({ open: false });
  const [testDialog, setTestDialog] = useState<{
    open: boolean;
    item?: Testimonial;
  }>({ open: false });

  const saveItem = async <T,>(
    id: string | undefined,
    data: T,
    add: (item: T) => Promise<void>,
    update: (id: string, item: T) => Promise<void>,
  ) => {
    try {
      if (id) await update(id, data);
      else await add(data);
      toast({ title: d.actions.saved });
    } catch (err: any) {
      toast({
        title: d.actions.error || "Error",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    if (!supabase) {
      setIsAuthenticated(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError(d.loginError);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(d.loginError);
      return;
    }
    setError("");
  };

  const handleLogout = async () => {
    if (!supabase) {
      setIsAuthenticated(false);
      return;
    }
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  /* ── Login screen ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          <Card className="glass chamfer [--cut:16px] border-border/60 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center px-5 pt-6 pb-2 sm:px-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 chamfer [--cut:12px] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <LayoutDashboard className="w-8 h-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">{d.login}</CardTitle>
              <CardDescription>{d.loginDescription}</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pt-4 pb-6 sm:px-6">
              <form onSubmit={handleLogin} className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium"
                >
                  {t.dashboard.email}
                </label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder={t.dashboard.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base !mb-4"
                />
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium"
                >
                  {t.dashboard.password}
                </label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder={t.dashboard.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                  data-testid="input-password"
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="!mt-4 text-sm text-destructive text-center bg-destructive/10 py-2.5 chamfer [--cut:8px] border border-destructive/20"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <Button
                  type="submit"
                  className="w-full !mt-5 min-h-12 font-semibold text-base shadow-lg shadow-primary/25"
                  data-testid="button-login"
                >
                  {d.enter}
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground gap-2 min-h-11 hover:text-foreground"
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" /> {d.returnToPortfolio}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      {/* Top bar — icon-only actions on mobile so the title never collides */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-2.5 sm:px-6 sm:py-3.5">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          <div className="flex items-center gap-2.5 min-w-0 sm:gap-3">
            <div className="w-10 h-10 shrink-0 chamfer [--cut:8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold leading-tight truncate sm:text-base">
                {d.headerTitle}
              </h1>
              <p className="hidden text-xs text-muted-foreground mt-0.5 truncate sm:block">
                {d.headerSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 sm:gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 min-h-11 px-3 sm:min-h-9"
            >
              <Link href="/" aria-label={d.viewSite} title={d.viewSite}>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">{d.viewSite}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label={d.logout}
              title={d.logout}
              className="gap-2 min-h-11 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 sm:min-h-9"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{d.logout}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        {/* Stats — even 2-up grid on mobile instead of a ragged wrap */}
        <div className="grid grid-cols-2 gap-2 mb-6 sm:flex sm:flex-wrap sm:gap-3 sm:mb-8">
          <StatBadge
            icon={Code2}
            label={d.stats.projects}
            value={projects.length}
            color="#7C3AED"
          />
          <StatBadge
            icon={Briefcase}
            label={d.stats.experience}
            value={experience.length}
            color="#3B82F6"
          />
          <StatBadge
            icon={GraduationCap}
            label={d.stats.education}
            value={education.length}
            color="#10B981"
          />
          <StatBadge
            icon={Award}
            label={d.stats.certificates}
            value={certificates.length}
            color="#F59E0B"
          />
          <StatBadge
            icon={MessageCircle}
            label={d.stats.messages}
            value={messages.filter((m) => m.status === "new").length}
            color="#06B6D4"
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* Radix defaults Tabs to dir="ltr", which forced every panel below it
            LTR on an Arabic page while the chamfers still cut RTL */}
        <Tabs
          defaultValue="projects"
          dir={language === "ar" ? "rtl" : "ltr"}
          className="w-full"
        >
          {/* Mobile: one scroll-snapping strip (7 tabs wrapped into a 4-row block
              of 28px targets before). Desktop: wraps as usual. */}
          {/* overflow-y-hidden matters: overflow-x-auto alone makes the strip
              vertically scrollable too, which scrolls the tabs out of view */}
          <TabsList className="flex h-auto w-full justify-start gap-1 mb-6 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x bg-muted/40 border border-border/40 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:mb-8">
            <TabsTrigger
              value="projects"
              className={TAB}
            >
              <Code2 className="w-4 h-4" /> {t.dashboard.projects}
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className={TAB}
            >
              <User className="w-4 h-4" /> {t.dashboard.personalInfo}
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className={TAB}
            >
              <Briefcase className="w-4 h-4" /> {t.dashboard.experience}
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className={TAB}
            >
              <GraduationCap className="w-4 h-4" /> {t.dashboard.education}
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className={TAB}
            >
              <Award className="w-4 h-4" /> {t.dashboard.certificates}
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className={TAB}
            >
              <MessageCircle className="w-4 h-4" /> {d.tabs.testimonials}
            </TabsTrigger>
            <TabsTrigger value="messages" className={TAB}>
              <MessageCircle className="w-4 h-4" /> {d.tabs.messages}
              {/* inline, not absolute: an absolute badge is clipped by the scroll strip */}
              {messages.filter((m) => m.status === "new").length > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-primary text-[9px] text-primary-foreground font-bold flex items-center justify-center">
                  {messages.filter((m) => m.status === "new").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <ProjectsSection
            onAdd={() => setProjectDialog({ open: true })}
            onEdit={(item) => setProjectDialog({ open: true, item })}
          />
          <PersonalInfoSection />
          <ExperienceSection
            onAdd={() => setExpDialog({ open: true })}
            onEdit={(item) => setExpDialog({ open: true, item })}
          />
          <EducationSection
            onAdd={() => setEduDialog({ open: true })}
            onEdit={(item) => setEduDialog({ open: true, item })}
          />
          <CertificatesSection
            onAdd={() => setCertDialog({ open: true })}
            onEdit={(item) => setCertDialog({ open: true, item })}
          />
          <MessagesSection
            messages={messages}
            loading={loadingMessages}
            updateStatus={updateMessageStatus}
          />
          <TestimonialsSection
            onAdd={() => setTestDialog({ open: true })}
            onEdit={(item) => setTestDialog({ open: true, item })}
          />
        </Tabs>
      </div>

      {/* ── Dialogs ── */}
      <ProjectDialog
        open={projectDialog.open}
        initial={projectDialog.item}
        onSave={(data) =>
          saveItem(projectDialog.item?.id, data, addProject, updateProject)
        }
        onClose={() => setProjectDialog({ open: false })}
      />
      <ExperienceDialog
        open={expDialog.open}
        initial={expDialog.item}
        onSave={(data) =>
          saveItem(expDialog.item?.id, data, addExperience, updateExperience)
        }
        onClose={() => setExpDialog({ open: false })}
      />
      <EducationDialog
        open={eduDialog.open}
        initial={eduDialog.item}
        onSave={(data) =>
          saveItem(eduDialog.item?.id, data, addEducation, updateEducation)
        }
        onClose={() => setEduDialog({ open: false })}
      />
      <CertificateDialog
        open={certDialog.open}
        initial={certDialog.item}
        onSave={(data) =>
          saveItem(certDialog.item?.id, data, addCertificate, updateCertificate)
        }
        onClose={() => setCertDialog({ open: false })}
      />
      <TestimonialDialog
        open={testDialog.open}
        initial={testDialog.item}
        onSave={(data) =>
          saveItem(testDialog.item?.id, data, addTestimonial, updateTestimonial)
        }
        onClose={() => setTestDialog({ open: false })}
      />
    </motion.div>
  );
}
