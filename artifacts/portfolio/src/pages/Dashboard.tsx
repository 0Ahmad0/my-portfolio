import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio, Project, Experience, Education, Certificate, Testimonial } from "@/contexts/PortfolioContext";
import { supabase } from "@/utils/supabase";
import { translations } from "@/lib/i18n";
import { ArrowLeft, LayoutDashboard, Briefcase, GraduationCap, Award, User, LogOut, Code2, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CertificateDialog, EducationDialog, ExperienceDialog, ProjectDialog, TestimonialDialog } from "./dashboard/DashboardEditors";
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

/* ─── Main Dashboard ─────────────────────────────────── */
export default function Dashboard() {
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
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (!error && data) setMessages(data as ContactMessage[]);
    setLoadingMessages(false);
  };

  const updateMessageStatus = async (id: string, status: "read" | "archived") => {
    if (!supabase) return;
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
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

  const saveItem = async <T,>(id: string | undefined, data: T, add: (item: T) => Promise<void>, update: (id: string, item: T) => Promise<void>) => {
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
      <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm relative z-10">
          <Card className="glass border-border/60 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center pb-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <LayoutDashboard className="w-8 h-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">{d.login}</CardTitle>
              <CardDescription>{d.loginDescription}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input type="email" placeholder={t.dashboard.email} value={email} onChange={(e) => setEmail(e.target.value)} autoFocus className="h-12 text-base" />
                <Input
                  type="password"
                  placeholder={t.dashboard.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                  data-testid="input-password"
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-destructive text-center bg-destructive/10 py-2.5 rounded-xl border border-destructive/20"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <Button type="submit" className="w-full h-12 rounded-xl font-semibold text-base shadow-lg shadow-primary/25" data-testid="button-login">
                  {d.enter}
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2 hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> {d.returnToPortfolio}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">{d.headerTitle}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{d.headerSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                <Eye className="h-3.5 w-3.5" /> {d.viewSite}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-3.5 w-3.5" /> {d.logout}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mb-8">
          <StatBadge icon={Code2} label={d.stats.projects} value={projects.length} color="#7C3AED" />
          <StatBadge icon={Briefcase} label={d.stats.experience} value={experience.length} color="#3B82F6" />
          <StatBadge icon={GraduationCap} label={d.stats.education} value={education.length} color="#10B981" />
          <StatBadge icon={Award} label={d.stats.certificates} value={certificates.length} color="#F59E0B" />
          <StatBadge icon={MessageCircle} label={d.stats.messages} value={messages.filter((m) => m.status === "new").length} color="#06B6D4" />
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-muted/40 border border-border/40 p-1 rounded-xl">
            <TabsTrigger value="projects" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <Code2 className="w-3.5 h-3.5" /> {t.dashboard.projects}
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <User className="w-3.5 h-3.5" /> {t.dashboard.personalInfo}
            </TabsTrigger>
            <TabsTrigger value="experience" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <Briefcase className="w-3.5 h-3.5" /> {t.dashboard.experience}
            </TabsTrigger>
            <TabsTrigger value="education" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <GraduationCap className="w-3.5 h-3.5" /> {t.dashboard.education}
            </TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <Award className="w-3.5 h-3.5" /> {t.dashboard.certificates}
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm">
              <MessageCircle className="w-3.5 h-3.5" /> {d.tabs.testimonials}
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm relative">
              <MessageCircle className="w-3.5 h-3.5" /> {d.tabs.messages}
              {messages.filter((m) => m.status === "new").length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] text-white font-bold flex items-center justify-center">
                  {messages.filter((m) => m.status === "new").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <ProjectsSection onAdd={() => setProjectDialog({ open: true })} onEdit={(item) => setProjectDialog({ open: true, item })} />
          <PersonalInfoSection />
          <ExperienceSection onAdd={() => setExpDialog({ open: true })} onEdit={(item) => setExpDialog({ open: true, item })} />
          <EducationSection onAdd={() => setEduDialog({ open: true })} onEdit={(item) => setEduDialog({ open: true, item })} />
          <CertificatesSection onAdd={() => setCertDialog({ open: true })} onEdit={(item) => setCertDialog({ open: true, item })} />
          <MessagesSection messages={messages} loading={loadingMessages} updateStatus={updateMessageStatus} />
          <TestimonialsSection onAdd={() => setTestDialog({ open: true })} onEdit={(item) => setTestDialog({ open: true, item })} />
        </Tabs>
      </div>

      {/* ── Dialogs ── */}
      <ProjectDialog
        open={projectDialog.open}
        initial={projectDialog.item}
        onSave={(data) => saveItem(projectDialog.item?.id, data, addProject, updateProject)}
        onClose={() => setProjectDialog({ open: false })}
      />
      <ExperienceDialog
        open={expDialog.open}
        initial={expDialog.item}
        onSave={(data) => saveItem(expDialog.item?.id, data, addExperience, updateExperience)}
        onClose={() => setExpDialog({ open: false })}
      />
      <EducationDialog
        open={eduDialog.open}
        initial={eduDialog.item}
        onSave={(data) => saveItem(eduDialog.item?.id, data, addEducation, updateEducation)}
        onClose={() => setEduDialog({ open: false })}
      />
      <CertificateDialog
        open={certDialog.open}
        initial={certDialog.item}
        onSave={(data) => saveItem(certDialog.item?.id, data, addCertificate, updateCertificate)}
        onClose={() => setCertDialog({ open: false })}
      />
      <TestimonialDialog
        open={testDialog.open}
        initial={testDialog.item}
        onSave={(data) => saveItem(testDialog.item?.id, data, addTestimonial, updateTestimonial)}
        onClose={() => setTestDialog({ open: false })}
      />
    </motion.div>
  );
}
