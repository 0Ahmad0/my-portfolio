import { useSensor, useSensors, MouseSensor, TouchSensor, DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Github,
  GraduationCap,
  Image,
  MessageCircle,
  Smartphone,
  Star,
  Trash2,
} from "lucide-react";
import { usePortfolio, type Certificate, type Education, type Experience, type Project, type Testimonial } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState, ItemCard, SectionHeader } from "./DashboardParts";
import { PersonalInfoEditor } from "./PersonalInfoEditor";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

function useDashboardOrdering() {
  const { language } = usePortfolio();
  const { toast } = useToast();
  const d = translations[language].dashboard;
  const dragSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
  );

  const persistOrder = async <T extends { id: string; sortOrder?: number }>(items: T[], table: string, setItems: (items: T[]) => void) => {
    const ordered = items.map((item, index) => ({ ...item, sortOrder: index }));
    setItems(ordered);
    if (!supabase) return;
    const updates = ordered
      .filter((item) => item.sortOrder !== items.find((current) => current.id === item.id)?.sortOrder)
      .map((item) => supabase.from(table).update({ sort_order: item.sortOrder }).eq("id", item.id));
    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;
    if (error) throw new Error(error.message);
  };

  const moveOrderedItem = async <T extends { id: string; sortOrder?: number }>(items: T[], index: number, direction: -1 | 1, table: string, setItems: (items: T[]) => void) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    await persistOrder(next, table, setItems);
  };

  const handleOrderedDragEnd = async <T extends { id: string; sortOrder?: number }>({ active, over }: DragEndEvent, items: T[], table: string, setItems: (items: T[]) => void) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;
    try {
      await persistOrder(arrayMove(items, from, to), table, setItems);
    } catch (err: any) {
      toast({
        title: d.actions.error || "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return { dragSensors, handleOrderedDragEnd, moveOrderedItem };
}

export function ProjectsSection({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: Project) => void }) {
  const { language, projects, setProjects, updateProject, deleteProject } = usePortfolio();
  const { toast } = useToast();
  const d = translations[language].dashboard;
  const categoryLabels: Record<Project["category"], string> = {
    Web: d.categories.web,
    Mobile: d.categories.mobile,
    Design: d.categories.design,
  };
  const { dragSensors, handleOrderedDragEnd, moveOrderedItem } = useDashboardOrdering();
  return (
    <TabsContent value="projects">
      <SectionHeader
        icon={Code2}
        title={d.sections.projects.title}
        count={projects.length}
        color="#7C3AED"
        onAdd={() => onAdd()}
        addLabel={d.sections.projects.add}
        itemLabel={projects.length === 1 ? d.itemCount.one : d.itemCount.many}
      />
      <AnimatePresence mode="popLayout">
        {projects.length === 0 ? (
          <EmptyState
            key="empty-projects"
            icon={FolderOpen}
            title={d.sections.projects.emptyTitle}
            description={d.sections.projects.emptyDescription}
            onAdd={() => onAdd()}
            addLabel={d.sections.projects.emptyAdd}
          />
        ) : (
          <DndContext sensors={dragSensors} collisionDetection={closestCenter} onDragEnd={(event) => handleOrderedDragEnd(event, projects, "portfolio_projects", setProjects)}>
            <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {projects.map((p, i) => (
                  <ItemCard
                    key={p.id}
                    index={i}
                    sortableId={p.id}
                    onMoveUp={async () => {
                      try {
                        await moveOrderedItem(projects, i, -1, "portfolio_projects", setProjects);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    onMoveDown={async () => {
                      try {
                        await moveOrderedItem(projects, i, 1, "portfolio_projects", setProjects);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    canMoveUp={i > 0}
                    canMoveDown={i < projects.length - 1}
                    onEdit={() => onEdit(p)}
                    onDelete={async () => {
                      try {
                        await deleteProject(p.id);
                        toast({ title: d.actions.deleted });
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl || (p.images?.[0] ?? "")} alt="" className="w-14 h-12 rounded-xl object-cover bg-muted shrink-0 border border-border/40" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{p.title}</h3>
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {categoryLabels[p.category] ?? p.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2 text-[11px]"
                            title={p.isPublished ? (language === "ar" ? "إخفاء المشروع" : "Hide project") : language === "ar" ? "إظهار المشروع" : "Show project"}
                            onClick={async () => {
                              try {
                                await updateProject(p.id, {
                                  isPublished: !p.isPublished,
                                });
                              } catch (err: any) {
                                toast({
                                  title: d.actions.error || "Error",
                                  description: err.message,
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            {p.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            {p.isPublished ? (language === "ar" ? "ظاهر" : "Visible") : language === "ar" ? "مخفي" : "Hidden"}
                          </Button>
                          {(p.images?.length ?? 0) > 1 && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Image className="w-3 h-3" /> {p.images!.length}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.tags.slice(0, 4).join(" · ")}</p>
                        <div className="flex gap-2 mt-1">
                          {p.liveUrl && p.liveUrl !== "#" && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                              <ExternalLink className="w-2.5 h-2.5" /> {d.links.live}
                            </a>
                          )}
                          {p.githubUrl && p.githubUrl !== "#" && (
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:underline flex items-center gap-0.5">
                              <Github className="w-2.5 h-2.5" /> {d.links.github}
                            </a>
                          )}
                          {p.androidUrl && p.androidUrl !== "#" && (
                            <a
                              href={p.androidUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-muted-foreground hover:underline flex items-center gap-0.5"
                            >
                              <Smartphone className="w-2.5 h-2.5" /> {d.links.android}
                            </a>
                          )}
                          {p.iosUrl && p.iosUrl !== "#" && (
                            <a href={p.iosUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:underline flex items-center gap-0.5">
                              <Apple className="w-2.5 h-2.5" /> {d.links.ios}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}

export function PersonalInfoSection() {
  const { personalInfo, setPersonalInfo } = usePortfolio();
  return (
    <TabsContent value="info">
      <PersonalInfoEditor info={personalInfo} onSave={setPersonalInfo} />
    </TabsContent>
  );
}

export function ExperienceSection({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: Experience) => void }) {
  const { language, experience, setExperience, deleteExperience } = usePortfolio();
  const { toast } = useToast();
  const d = translations[language].dashboard;
  const { dragSensors, handleOrderedDragEnd, moveOrderedItem } = useDashboardOrdering();
  return (
    <TabsContent value="experience">
      <SectionHeader
        icon={Briefcase}
        title={d.sections.experience.title}
        count={experience.length}
        color="#3B82F6"
        onAdd={() => onAdd()}
        addLabel={d.sections.experience.add}
        itemLabel={experience.length === 1 ? d.itemCount.one : d.itemCount.many}
      />
      <AnimatePresence mode="popLayout">
        {experience.length === 0 ? (
          <EmptyState
            key="empty-exp"
            icon={Briefcase}
            title={d.sections.experience.emptyTitle}
            description={d.sections.experience.emptyDescription}
            onAdd={() => onAdd()}
            addLabel={d.sections.experience.emptyAdd}
          />
        ) : (
          <DndContext
            sensors={dragSensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleOrderedDragEnd(event, experience, "portfolio_experience", setExperience)}
          >
            <SortableContext items={experience.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {experience.map((e, i) => (
                  <ItemCard
                    key={e.id}
                    index={i}
                    sortableId={e.id}
                    onMoveUp={async () => {
                      try {
                        await moveOrderedItem(experience, i, -1, "portfolio_experience", setExperience);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    onMoveDown={async () => {
                      try {
                        await moveOrderedItem(experience, i, 1, "portfolio_experience", setExperience);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    canMoveUp={i > 0}
                    canMoveDown={i < experience.length - 1}
                    onEdit={() => onEdit(e)}
                    onDelete={async () => {
                      try {
                        await deleteExperience(e.id);
                        toast({ title: d.actions.deleted });
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold leading-none">{language === "ar" ? e.roleAr || e.role : e.role}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {e.company} <span className="text-border">·</span> {e.period}
                        </p>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}

export function EducationSection({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: Education) => void }) {
  const { language, education, deleteEducation } = usePortfolio();
  const { toast } = useToast();
  const d = translations[language].dashboard;
  return (
    <TabsContent value="education">
      <SectionHeader
        icon={GraduationCap}
        title={d.sections.education.title}
        count={education.length}
        color="#10B981"
        onAdd={() => onAdd()}
        addLabel={d.sections.education.add}
        itemLabel={education.length === 1 ? d.itemCount.one : d.itemCount.many}
      />
      <AnimatePresence mode="popLayout">
        {education.length === 0 ? (
          <EmptyState
            key="empty-edu"
            icon={BookOpen}
            title={d.sections.education.emptyTitle}
            description={d.sections.education.emptyDescription}
            onAdd={() => onAdd()}
            addLabel={d.sections.education.emptyAdd}
          />
        ) : (
          <div className="space-y-3">
            {education.map((e, i) => (
              <ItemCard
                key={e.id}
                index={i}
                onEdit={() => onEdit(e)}
                onDelete={async () => {
                  try {
                    await deleteEducation(e.id);
                    toast({ title: d.actions.deleted });
                  } catch (err: any) {
                    toast({
                      title: d.actions.error || "Error",
                      description: err.message,
                      variant: "destructive",
                    });
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4.5 h-4.5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold leading-none">
                      {language === "ar" ? e.degreeAr || e.degree : e.degree} {language === "ar" ? e.fieldAr || e.field : e.field}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "ar" ? e.institutionAr || e.institution : e.institution} <span className="text-border">·</span> {e.period}
                      {e.gpa && (
                        <span className="ml-2 text-primary font-medium">
                          {d.dialogs.educationItem.gpaLabel} {e.gpa}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </ItemCard>
            ))}
          </div>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}

export function CertificatesSection({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: Certificate) => void }) {
  const { language, certificates, setCertificates, deleteCertificate } = usePortfolio();
  const { toast } = useToast();
  const d = translations[language].dashboard;
  const { dragSensors, handleOrderedDragEnd, moveOrderedItem } = useDashboardOrdering();
  return (
    <TabsContent value="certificates">
      <SectionHeader
        icon={Award}
        title={d.sections.certificates.title}
        count={certificates.length}
        color="#F59E0B"
        onAdd={() => onAdd()}
        addLabel={d.sections.certificates.add}
        itemLabel={certificates.length === 1 ? d.itemCount.one : d.itemCount.many}
      />
      <AnimatePresence mode="popLayout">
        {certificates.length === 0 ? (
          <EmptyState
            key="empty-certs"
            icon={Award}
            title={d.sections.certificates.emptyTitle}
            description={d.sections.certificates.emptyDescription}
            onAdd={() => onAdd()}
            addLabel={d.sections.certificates.emptyAdd}
          />
        ) : (
          <DndContext
            sensors={dragSensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleOrderedDragEnd(event, certificates, "portfolio_certificates", setCertificates)}
          >
            <SortableContext items={certificates.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {certificates.map((c, i) => (
                  <ItemCard
                    key={c.id}
                    index={i}
                    sortableId={c.id}
                    onMoveUp={async () => {
                      try {
                        await moveOrderedItem(certificates, i, -1, "portfolio_certificates", setCertificates);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    onMoveDown={async () => {
                      try {
                        await moveOrderedItem(certificates, i, 1, "portfolio_certificates", setCertificates);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    canMoveUp={i > 0}
                    canMoveDown={i < certificates.length - 1}
                    onEdit={() => onEdit(c)}
                    onDelete={async () => {
                      try {
                        await deleteCertificate(c.id);
                        toast({ title: d.actions.deleted });
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                        style={{
                          background: `${c.badgeColor}20`,
                          border: `1px solid ${c.badgeColor}40`,
                        }}
                      >
                        <Award className="w-4.5 h-4.5" style={{ color: c.badgeColor }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold leading-none">{language === "ar" ? c.titleAr || c.title : c.title}</p>
                          {c.credentialUrl && (
                            <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/70">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === "ar" ? c.issuerAr || c.issuer : c.issuer} <span className="text-border">·</span> {c.date}
                        </p>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}

export function MessagesSection({
  messages,
  loading,
  updateStatus,
}: {
  messages: ContactMessage[];
  loading: boolean;
  updateStatus: (id: string, status: "read" | "archived") => Promise<void>;
}) {
  const { language } = usePortfolio();
  const t = translations[language];
  return (
    <TabsContent value="messages">
      <SectionHeader
        icon={MessageCircle}
        title={t.messages?.title || "Messages"}
        count={messages.length}
        color="#06B6D4"
        onAdd={() => {}}
        addLabel=""
        itemLabel={t.messages?.itemCount || "messages"}
      />
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title={t.messages?.emptyTitle || "No messages yet"}
          description={t.messages?.emptyDescription || "When someone sends you a message via the contact form, it will appear here."}
          onAdd={() => {}}
          addLabel=""
        />
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
              <Card className={`hover:border-primary/30 transition-colors ${msg.status === "new" ? "border-l-4 border-l-primary" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold">{msg.name}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">
                          {msg.email}
                        </a>
                        <Badge variant={msg.status === "new" ? "default" : msg.status === "read" ? "secondary" : "outline"} className="text-[10px]">
                          {msg.status === "new" ? t.messages?.new || "New" : msg.status === "read" ? t.messages?.read || "Read" : t.messages?.archived || "Archived"}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap mb-3">{msg.message}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(msg.created_at).toLocaleString(language === "ar" ? "ar-SA" : "en-US")}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {msg.status === "new" && (
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => updateStatus(msg.id, "read")}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t.messages?.markRead || "Mark as Read"}
                        </Button>
                      )}
                      {msg.status !== "archived" && (
                        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => updateStatus(msg.id, "archived")}>
                          <Trash2 className="w-3.5 h-3.5" /> {t.messages?.markArchived || "Archive"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </TabsContent>
  );
}

export function TestimonialsSection({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: Testimonial) => void }) {
  const { language, testimonials, setTestimonials, deleteTestimonial } = usePortfolio();
  const { toast } = useToast();
  const d = translations[language].dashboard;
  const { dragSensors, handleOrderedDragEnd, moveOrderedItem } = useDashboardOrdering();
  return (
    <TabsContent value="testimonials">
      <SectionHeader
        icon={MessageCircle}
        title={d.sections.testimonials.title}
        count={testimonials.length}
        color="#3B82F6"
        onAdd={() => onAdd()}
        addLabel={d.sections.testimonials.add}
        itemLabel={testimonials.length === 1 ? d.itemCount.one : d.itemCount.many}
      />
      <AnimatePresence mode="popLayout">
        {testimonials.length === 0 ? (
          <EmptyState
            key="empty-test"
            icon={MessageCircle}
            title={d.sections.testimonials.emptyTitle}
            description={d.sections.testimonials.emptyDescription}
            onAdd={() => onAdd()}
            addLabel={d.sections.testimonials.emptyAdd}
          />
        ) : (
          <DndContext
            sensors={dragSensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleOrderedDragEnd(event, testimonials, "portfolio_testimonials", setTestimonials)}
          >
            <SortableContext items={testimonials.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {testimonials.map((t, i) => (
                  <ItemCard
                    key={t.id}
                    index={i}
                    sortableId={t.id}
                    onMoveUp={async () => {
                      try {
                        await moveOrderedItem(testimonials, i, -1, "portfolio_testimonials", setTestimonials);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    onMoveDown={async () => {
                      try {
                        await moveOrderedItem(testimonials, i, 1, "portfolio_testimonials", setTestimonials);
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    canMoveUp={i > 0}
                    canMoveDown={i < testimonials.length - 1}
                    onEdit={() => onEdit(t)}
                    onDelete={async () => {
                      try {
                        await deleteTestimonial(t.id);
                        toast({ title: d.actions.deleted });
                      } catch (err: any) {
                        toast({
                          title: d.actions.error || "Error",
                          description: err.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {t.imageUrl ? (
                        <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-border bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {(language === "ar" ? t.nameAr || t.name : t.name).trim().charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold leading-none">{language === "ar" ? t.nameAr || t.name : t.name}</p>
                          <div className="flex gap-0.5">
                            {Array(t.rating)
                              .fill(0)
                              .map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {language === "ar" ? t.roleAr || t.role : t.role}
                          {(language === "ar" ? t.companyAr || t.company : t.company) && ` · ${language === "ar" ? t.companyAr || t.company : t.company}`}
                        </p>
                        <p className="text-sm text-foreground/70 line-clamp-2">"{language === "ar" ? t.textAr || t.text : t.text}"</p>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}
