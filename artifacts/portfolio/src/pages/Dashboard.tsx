import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePortfolio, Project, Experience, Education, Certificate, PersonalInfo, Testimonial
} from "@/contexts/PortfolioContext";
import { supabase } from "@/utils/supabase";
import { translations } from "@/lib/i18n";
import {
  ArrowLeft, Plus, Trash2, Edit2, LayoutDashboard, FolderOpen,
  Briefcase, GraduationCap, Award, User, LogOut, ExternalLink,
  Github, CheckCircle2, Image, Globe, Code2, BookOpen, Sparkles,
  Eye, Download, Star, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/* ─── helpers ─────────────────────────────────────────── */
function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground/80">
        {label}{required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
function SectionHeader({
  icon: Icon, title, count, color, onAdd, addLabel, itemLabel
}: {
  icon: any; title: string; count: number; color: string; onAdd: () => void; addLabel: string; itemLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-none">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{count} {itemLabel}</p>
        </div>
      </div>
      <Button onClick={onAdd} className="gap-2 rounded-xl shadow-lg shadow-primary/20">
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}

/* ─── Animated empty state ─────────────────────────────── */
function EmptyState({ icon: Icon, title, description, onAdd, addLabel }: {
  icon: any; title: string; description: string; onAdd: () => void; addLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary/60" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-3xl bg-primary/10"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary/60" />
        </motion.div>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-lg font-bold mb-2"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed"
      >
        {description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Button onClick={onAdd} className="gap-2 rounded-xl shadow-lg shadow-primary/25">
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Project Dialog ─────────────────────────────────── */
const blankProject = (): Omit<Project, "id"> => ({
  title: "", titleAr: "", description: "", descriptionAr: "",
  category: "Web", tags: [], imageUrl: "", images: [],
  liveUrl: "", githubUrl: ""
});
function ProjectDialog({ open, initial, onSave, onClose }: {
  open: boolean;
  initial?: Project;
  onSave: (p: Omit<Project, "id">) => Promise<void>;
  onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.project;
  const [local, setLocal] = useState<Omit<Project, "id">>(initial ?? blankProject());
  const [saving, setSaving] = useState(false);
  const [imgText, setImgText] = useState((initial?.images?.length ? initial.images : initial?.imageUrl ? [initial.imageUrl] : []).join("\n"));

  useEffect(() => {
    setLocal(initial ?? blankProject());
    setImgText((initial?.images?.length ? initial.images : initial?.imageUrl ? [initial.imageUrl] : []).join("\n"));
    setSaving(false);
  }, [open, initial]);

  const handleImgChange = (val: string) => {
    setImgText(val);
    const imgs = val.split("\n").map(s => s.trim()).filter(Boolean);
    setLocal(l => ({ ...l, images: imgs, imageUrl: imgs[0] || "" }));
  };

  const previewImgs = imgText.split("\n").map(s => s.trim()).filter(Boolean);

  const isValid = local.title.trim() && local.description.trim();

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            {initial ? labels.titleEdit : labels.titleAdd}
          </DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label={labels.titleEn} required>
              <Input value={local.title} onChange={e => setLocal(l => ({ ...l, title: e.target.value }))} placeholder={labels.placeholderTitleEn} />
            </Field>
            <Field label={labels.titleAr}>
              <Input value={local.titleAr} onChange={e => setLocal(l => ({ ...l, titleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderTitleAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.category} required>
              <Select value={local.category} onValueChange={(v: any) => setLocal(l => ({ ...l, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web"><span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {d.categories.web}</span></SelectItem>
                  <SelectItem value="Mobile"><span className="flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> {d.categories.mobile}</span></SelectItem>
                  <SelectItem value="Design"><span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> {d.categories.design}</span></SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={labels.tags} required>
              <Input
                value={local.tags.join(", ")}
                onChange={e => setLocal(l => ({ ...l, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
                placeholder={labels.placeholderTags}
              />
            </Field>
          </FieldRow>

          <Field label={labels.images}>
            <Textarea
              value={imgText}
              onChange={e => handleImgChange(e.target.value)}
              className="resize-none font-mono text-xs h-20"
              placeholder={labels.placeholderImages}
            />
            {previewImgs.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewImgs.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-14 h-10 rounded-lg object-cover border border-border" />
                    {i === 0 && <span className="absolute -top-1.5 -right-1 bg-primary text-[9px] text-white px-1.5 py-0.5 rounded-full font-medium">{labels.cover}</span>}
                  </div>
                ))}
              </div>
            )}
          </Field>

          <FieldRow>
            <Field label={labels.liveUrl}>
              <Input value={local.liveUrl || ""} onChange={e => setLocal(l => ({ ...l, liveUrl: e.target.value }))} placeholder={labels.placeholderLiveUrl} />
            </Field>
            <Field label={labels.githubUrl}>
              <Input value={local.githubUrl || ""} onChange={e => setLocal(l => ({ ...l, githubUrl: e.target.value }))} placeholder={labels.placeholderGithubUrl} />
            </Field>
          </FieldRow>
          <Field label={labels.descEn} required>
            <Textarea value={local.description} onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} className="resize-none h-20" placeholder={labels.placeholderDescEn} />
          </Field>
          <Field label={labels.descAr}>
            <Textarea value={local.descriptionAr} onChange={e => setLocal(l => ({ ...l, descriptionAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder={labels.placeholderDescAr} />
          </Field>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>{d.actions.cancel}</Button>
          <Button onClick={async () => { setSaving(true); try { await onSave(local); onClose(); } catch { setSaving(false); } }} disabled={!isValid || saving} className="gap-2">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />} {initial ? d.actions.saveChanges : d.sections.projects.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Experience Dialog ──────────────────────────────── */
const blankExp = (): Omit<Experience, "id"> => ({
  company: "", role: "", roleAr: "", period: "", description: "", descriptionAr: ""
});
function ExperienceDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial?: Experience; onSave: (e: Omit<Experience, "id">) => Promise<void>; onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.experience;
  const [local, setLocal] = useState<Omit<Experience, "id">>(initial ?? blankExp());
  const [saving, setSaving] = useState(false);
  useEffect(() => { setLocal(initial ?? blankExp()); setSaving(false); }, [open, initial]);
  const isValid = local.company.trim() && local.role.trim() && local.period.trim();
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            {initial ? labels.titleEdit : labels.titleAdd}
          </DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label={labels.company} required>
              <Input value={local.company} onChange={e => setLocal(l => ({ ...l, company: e.target.value }))} placeholder={labels.placeholderCompany} />
            </Field>
            <Field label={labels.period} required>
              <Input value={local.period} onChange={e => setLocal(l => ({ ...l, period: e.target.value }))} placeholder={labels.placeholderPeriod} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.roleEn} required>
              <Input value={local.role} onChange={e => setLocal(l => ({ ...l, role: e.target.value }))} placeholder={labels.placeholderRoleEn} />
            </Field>
            <Field label={labels.roleAr}>
              <Input value={local.roleAr} onChange={e => setLocal(l => ({ ...l, roleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderRoleAr} />
            </Field>
          </FieldRow>
          <Field label={labels.descEn} required>
            <Textarea value={local.description} onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} className="resize-none h-24" placeholder={labels.placeholderDescEn} />
          </Field>
          <Field label={labels.descAr}>
            <Textarea value={local.descriptionAr} onChange={e => setLocal(l => ({ ...l, descriptionAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder={labels.placeholderDescAr} />
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>{d.actions.cancel}</Button>
          <Button onClick={async () => { setSaving(true); try { await onSave(local); onClose(); } catch { setSaving(false); } }} disabled={!isValid || saving} className="gap-2">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />} {initial ? d.actions.saveChanges : d.sections.experience.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Education Dialog ───────────────────────────────── */
const blankEdu = (): Omit<Education, "id"> => ({
  institution: "", institutionAr: "", degree: "", degreeAr: "",
  field: "", fieldAr: "", period: "", gpa: "", description: "", descriptionAr: ""
});
function EducationDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial?: Education; onSave: (e: Omit<Education, "id">) => Promise<void>; onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.education;
  const [local, setLocal] = useState<Omit<Education, "id">>(initial ?? blankEdu());
  const [saving, setSaving] = useState(false);
  useEffect(() => { setLocal(initial ?? blankEdu()); setSaving(false); }, [open, initial]);
  const isValid = local.institution.trim() && local.degree.trim() && local.field.trim() && local.period.trim();
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-green-500" />
            </div>
            {initial ? labels.titleEdit : labels.titleAdd}
          </DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label={labels.institutionEn} required>
              <Input value={local.institution} onChange={e => setLocal(l => ({ ...l, institution: e.target.value }))} placeholder={labels.placeholderInstitutionEn} />
            </Field>
            <Field label={labels.institutionAr}>
              <Input value={local.institutionAr} onChange={e => setLocal(l => ({ ...l, institutionAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderInstitutionAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.degreeEn} required>
              <Input value={local.degree} onChange={e => setLocal(l => ({ ...l, degree: e.target.value }))} placeholder={labels.placeholderDegreeEn} />
            </Field>
            <Field label={labels.degreeAr}>
              <Input value={local.degreeAr} onChange={e => setLocal(l => ({ ...l, degreeAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderDegreeAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.fieldEn} required>
              <Input value={local.field} onChange={e => setLocal(l => ({ ...l, field: e.target.value }))} placeholder={labels.placeholderFieldEn} />
            </Field>
            <Field label={labels.fieldAr}>
              <Input value={local.fieldAr} onChange={e => setLocal(l => ({ ...l, fieldAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderFieldAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.period} required>
              <Input value={local.period} onChange={e => setLocal(l => ({ ...l, period: e.target.value }))} placeholder={labels.placeholderPeriod} />
            </Field>
            <Field label={labels.gpa}>
              <Input value={local.gpa || ""} onChange={e => setLocal(l => ({ ...l, gpa: e.target.value }))} placeholder={labels.placeholderGpa} />
            </Field>
          </FieldRow>
          <Field label={labels.descEn}>
            <Textarea value={local.description} onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} className="resize-none h-20" placeholder={labels.placeholderDescEn} />
          </Field>
          <Field label={labels.descAr}>
            <Textarea value={local.descriptionAr} onChange={e => setLocal(l => ({ ...l, descriptionAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder={labels.placeholderDescAr} />
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>{d.actions.cancel}</Button>
          <Button onClick={async () => { setSaving(true); try { await onSave(local); onClose(); } catch { setSaving(false); } }} disabled={!isValid || saving} className="gap-2">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />} {initial ? d.actions.saveChanges : d.sections.education.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Certificate Dialog ─────────────────────────────── */
const blankCert = (): Omit<Certificate, "id"> => ({
  title: "", titleAr: "", issuer: "", issuerAr: "", date: "", credentialUrl: "", badgeColor: "#6C63FF"
});
const blankTestimonial = (): Omit<Testimonial, "id"> => ({
  name: "", nameAr: "", role: "", roleAr: "", text: "", textAr: "", rating: 5, imageUrl: ""
});

/* ─── Testimonial Dialog ──────────────────────────────── */
function TestimonialDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial?: Testimonial; onSave: (t: Omit<Testimonial, "id">) => Promise<void>; onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.testimonial;
  const [local, setLocal] = useState<Omit<Testimonial, "id">>(initial ?? blankTestimonial());
  const [saving, setSaving] = useState(false);
  useEffect(() => { setLocal(initial ?? blankTestimonial()); setSaving(false); }, [open, initial]);
  const isValid = local.name.trim() && local.role.trim() && local.text.trim() && local.imageUrl.trim();
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-500" />
            </div>
            {initial ? labels.titleEdit : labels.titleAdd}
          </DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label={labels.nameEn} required>
              <Input value={local.name} onChange={e => setLocal(l => ({ ...l, name: e.target.value }))} placeholder={labels.placeholderNameEn} />
            </Field>
            <Field label={labels.nameAr}>
              <Input value={local.nameAr} onChange={e => setLocal(l => ({ ...l, nameAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderNameAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.roleEn} required>
              <Input value={local.role} onChange={e => setLocal(l => ({ ...l, role: e.target.value }))} placeholder={labels.placeholderRoleEn} />
            </Field>
            <Field label={labels.roleAr}>
              <Input value={local.roleAr} onChange={e => setLocal(l => ({ ...l, roleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderRoleAr} />
            </Field>
          </FieldRow>
          <Field label={labels.textEn} required>
            <Textarea value={local.text} onChange={e => setLocal(l => ({ ...l, text: e.target.value }))} className="resize-none h-20" placeholder={labels.placeholderTextEn} />
          </Field>
          <Field label={labels.textAr}>
            <Textarea value={local.textAr} onChange={e => setLocal(l => ({ ...l, textAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder={labels.placeholderTextAr} />
          </Field>
          <FieldRow>
            <Field label={labels.rating} required>
              <Select value={local.rating.toString()} onValueChange={v => setLocal(l => ({ ...l, rating: parseInt(v) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {Array(n).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 inline" />)} {n}⭐
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={labels.imageUrl} required>
              <div className="flex gap-2">
                <Input value={local.imageUrl} onChange={e => setLocal(l => ({ ...l, imageUrl: e.target.value }))} placeholder={labels.placeholderImageUrl} className="flex-1" />
                {local.imageUrl && <img src={local.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />}
              </div>
            </Field>
          </FieldRow>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>{d.actions.cancel}</Button>
          <Button onClick={async () => { setSaving(true); try { await onSave(local); onClose(); } catch { setSaving(false); } }} disabled={!isValid || saving} className="gap-2">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />} {initial ? d.actions.saveChanges : d.sections.testimonials.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CertificateDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial?: Certificate; onSave: (c: Omit<Certificate, "id">) => Promise<void>; onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.certificate;
  const [local, setLocal] = useState<Omit<Certificate, "id">>(initial ?? blankCert());
  const [saving, setSaving] = useState(false);
  useEffect(() => { setLocal(initial ?? blankCert()); setSaving(false); }, [open, initial]);
  const isValid = local.title.trim() && local.issuer.trim() && local.date.trim();
  const PRESET_COLORS = ["#6C63FF", "#FF9900", "#0866FF", "#4285F4", "#00ED64", "#A259FF", "#F24E1E", "#06B6D4", "#3DDC84", "#FA7343"];
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            {initial ? labels.titleEdit : labels.titleAdd}
          </DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label={labels.titleEn} required>
              <Input value={local.title} onChange={e => setLocal(l => ({ ...l, title: e.target.value }))} placeholder={labels.placeholderTitleEn} />
            </Field>
            <Field label={labels.titleAr}>
              <Input value={local.titleAr} onChange={e => setLocal(l => ({ ...l, titleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderTitleAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.issuerEn} required>
              <Input value={local.issuer} onChange={e => setLocal(l => ({ ...l, issuer: e.target.value }))} placeholder={labels.placeholderIssuerEn} />
            </Field>
            <Field label={labels.issuerAr}>
              <Input value={local.issuerAr} onChange={e => setLocal(l => ({ ...l, issuerAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderIssuerAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.year} required>
              <Input value={local.date} onChange={e => setLocal(l => ({ ...l, date: e.target.value }))} placeholder={labels.placeholderYear} />
            </Field>
            <Field label={labels.credentialUrl}>
              <Input value={local.credentialUrl || ""} onChange={e => setLocal(l => ({ ...l, credentialUrl: e.target.value }))} placeholder={labels.placeholderCredential} />
            </Field>
          </FieldRow>
          <Field label={labels.badgeColor}>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setLocal(l => ({ ...l, badgeColor: c }))}
                    className="w-8 h-8 rounded-lg transition-transform hover:scale-110 ring-offset-2 ring-offset-background"
                    style={{
                      background: c,
                      outline: local.badgeColor === c ? `3px solid ${c}` : "none",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input type="color" value={local.badgeColor} onChange={e => setLocal(l => ({ ...l, badgeColor: e.target.value }))} className="h-9 w-16 rounded-lg cursor-pointer border border-border bg-background" />
                <span className="text-sm text-muted-foreground font-mono">{local.badgeColor}</span>
                <div className="w-9 h-9 rounded-xl border border-border/50" style={{ background: local.badgeColor }} />
              </div>
            </div>
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>{d.actions.cancel}</Button>
          <Button onClick={async () => { setSaving(true); try { await onSave(local); onClose(); } catch { setSaving(false); } }} disabled={!isValid || saving} className="gap-2">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />} {initial ? d.actions.saveChanges : d.sections.certificates.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Item card row ──────────────────────────────────── */
function ItemCard({ children, onEdit, onDelete, index }: {
  children: React.ReactNode; onEdit: () => void; onDelete: () => Promise<void>; index: number;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="hover:border-primary/30 transition-colors">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex-1 min-w-0">{children}</div>
          <div className="flex gap-2 shrink-0">
            {confirmDelete ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>{d.actions.cancel}</Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    try {
                      await onDelete();
                    } catch {
                    } finally {
                      setDeleting(false);
                      setConfirmDelete(false);
                    }
                  }}
                  className="gap-1.5"
                >
                  {deleting ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Trash2 className="h-3.5 w-3.5" />} {d.actions.confirm}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" /> {d.edit}
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Personal Info editor (inline, saves in place) ─── */
function PersonalInfoEditor({ info, onSave }: { info: PersonalInfo; onSave: (i: PersonalInfo) => Promise<void> }) {
  const [local, setLocal] = useState({ ...info, floatingSkills: info.floatingSkills || ["React", "Flutter", "TypeScript", "Node.js", "Figma", "Next.js"] });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const { toast } = useToast();
  const labels = d.dialogs.personalInfo;
  useEffect(() => { setLocal({ ...info, floatingSkills: info.floatingSkills || ["React", "Flutter", "TypeScript", "Node.js", "Figma", "Next.js"] }); }, [info]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await onSave(local);
      setSaved(true);
      toast({ title: d.actions.saved });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save");
      toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          {labels.title}
        </CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <FieldRow>
          <Field label={labels.nameEn} required><Input value={local.name} onChange={e => setLocal(l => ({ ...l, name: e.target.value }))} /></Field>
          <Field label={labels.nameAr}><Input value={local.nameAr} onChange={e => setLocal(l => ({ ...l, nameAr: e.target.value }))} dir="rtl" /></Field>
        </FieldRow>
        <FieldRow>
          <Field label={labels.email} required><Input value={local.email} onChange={e => setLocal(l => ({ ...l, email: e.target.value }))} type="email" /></Field>
          <Field label={labels.locationEn}><Input value={local.location} onChange={e => setLocal(l => ({ ...l, location: e.target.value }))} /></Field>
        </FieldRow>
        <FieldRow>
          <Field label={labels.locationAr}><Input value={local.locationAr} onChange={e => setLocal(l => ({ ...l, locationAr: e.target.value }))} dir="rtl" /></Field>
          <Field label={labels.avatarUrl}>
            <div className="flex gap-2">
              <Input value={local.avatarUrl} onChange={e => setLocal(l => ({ ...l, avatarUrl: e.target.value }))} placeholder={labels.placeholderAvatar} className="flex-1" />
              {local.avatarUrl && <img src={local.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-border shrink-0" />}
            </div>
          </Field>
        </FieldRow>
        <Field label={labels.bioEn} required><Textarea value={local.bio} onChange={e => setLocal(l => ({ ...l, bio: e.target.value }))} className="h-24 resize-none" /></Field>
        <Field label={labels.bioAr}><Textarea value={local.bioAr} onChange={e => setLocal(l => ({ ...l, bioAr: e.target.value }))} className="h-24 resize-none" dir="rtl" /></Field>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> {labels.socialLinks}
          </p>
          <FieldRow>
            <Field label={labels.github}><Input value={local.github} onChange={e => setLocal(l => ({ ...l, github: e.target.value }))} placeholder={labels.placeholderGithub} /></Field>
            <Field label={labels.linkedin}><Input value={local.linkedin} onChange={e => setLocal(l => ({ ...l, linkedin: e.target.value }))} placeholder={labels.placeholderLinkedin} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.twitter}><Input value={local.twitter} onChange={e => setLocal(l => ({ ...l, twitter: e.target.value }))} placeholder={labels.placeholderTwitter} /></Field>
            <Field label={labels.instagram}><Input value={local.instagram} onChange={e => setLocal(l => ({ ...l, instagram: e.target.value }))} placeholder={labels.placeholderInstagram} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.facebook}><Input value={local.facebook} onChange={e => setLocal(l => ({ ...l, facebook: e.target.value }))} placeholder={labels.placeholderFacebook} /></Field>
            <Field label={labels.telegram}><Input value={local.telegram} onChange={e => setLocal(l => ({ ...l, telegram: e.target.value }))} placeholder={labels.placeholderTelegram} /></Field>
          </FieldRow>
          <div className="mt-4">
            <Field label={labels.whatsapp}><Input value={local.whatsapp} onChange={e => setLocal(l => ({ ...l, whatsapp: e.target.value }))} placeholder={labels.placeholderWhatsapp} /></Field>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> {labels.floatingSkills}
          </p>
          <Field label={labels.floatingSkillsLabel}>
            <Textarea 
              value={local.floatingSkills.join(", ")} 
              onChange={e => setLocal(l => ({ ...l, floatingSkills: e.target.value.split(",").map(s => s.trim()).filter(Boolean).slice(0, 6) }))} 
              placeholder={labels.placeholderFloating}
              className="h-16 resize-none"
            />
          </Field>
          <p className="text-xs text-muted-foreground mt-2">{labels.floatingSkillsHelp}</p>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> {labels.cvResume}
          </p>
          <Field label={labels.cvUrl}>
            <Input value={local.cvUrl} onChange={e => setLocal(l => ({ ...l, cvUrl: e.target.value }))} placeholder={labels.placeholderCv} />
          </Field>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[140px]">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : saved ? <><CheckCircle2 className="w-4 h-4" /> {d.actions.saved}</> : d.actions.saveChanges}
          </Button>
          {saveError && <p className="text-sm text-destructive mt-2 text-right w-full">{saveError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Stats bar ──────────────────────────────────────── */
function StatBadge({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-muted/40 border border-border/40"
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────── */
export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const {
    isLoading,
    language, projects, updateProject, addProject, deleteProject,
    personalInfo, setPersonalInfo,
    experience, updateExperience, addExperience, deleteExperience,
    education, updateEducation, addEducation, deleteEducation,
    certificates, updateCertificate, addCertificate, deleteCertificate,
    testimonials, updateTestimonial, addTestimonial, deleteTestimonial,
  } = usePortfolio();

  const t = translations[language];
  const d = t.dashboard;
  const categoryLabels: Record<Project["category"], string> = {
    Web: d.categories.web,
    Mobile: d.categories.mobile,
    Design: d.categories.design,
  };

  /* dialog state */
  const [projectDialog, setProjectDialog] = useState<{ open: boolean; item?: Project }>({ open: false });
  const [expDialog, setExpDialog] = useState<{ open: boolean; item?: Experience }>({ open: false });
  const [eduDialog, setEduDialog] = useState<{ open: boolean; item?: Education }>({ open: false });
  const [certDialog, setCertDialog] = useState<{ open: boolean; item?: Certificate }>({ open: false });
  const [testDialog, setTestDialog] = useState<{ open: boolean; item?: Testimonial }>({ open: false });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(d.loginError);
      return;
    }
    setError("");
  };

  const handleLogout = async () => {
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          <Card className="glass border-border/60 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center pb-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <LayoutDashboard className="w-8 h-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">{d.login}</CardTitle>
              <CardDescription>{d.loginDescription}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder={t.dashboard.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="h-12 text-base"
                />
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
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
          <StatBadge icon={Code2}        label={d.stats.projects}     value={projects.length}     color="#7C3AED" />
          <StatBadge icon={Briefcase}    label={d.stats.experience}   value={experience.length}   color="#3B82F6" />
          <StatBadge icon={GraduationCap} label={d.stats.education}   value={education.length}    color="#10B981" />
          <StatBadge icon={Award}        label={d.stats.certificates} value={certificates.length} color="#F59E0B" />
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
          </TabsList>

          {/* ── PROJECTS ── */}
          <TabsContent value="projects">
            <SectionHeader
              icon={Code2} title={d.sections.projects.title} count={projects.length} color="#7C3AED"
              onAdd={() => setProjectDialog({ open: true })} addLabel={d.sections.projects.add}
              itemLabel={projects.length === 1 ? d.itemCount.one : d.itemCount.many}
            />
            <AnimatePresence mode="popLayout">
              {projects.length === 0 ? (
                <EmptyState
                  key="empty-projects"
                  icon={FolderOpen}
                  title={d.sections.projects.emptyTitle}
                  description={d.sections.projects.emptyDescription}
                  onAdd={() => setProjectDialog({ open: true })}
                  addLabel={d.sections.projects.emptyAdd}
                />
              ) : (
                <div className="space-y-3">
                  {projects.map((p, i) => (
                    <ItemCard
                      key={p.id} index={i}
                      onEdit={() => setProjectDialog({ open: true, item: p })}
                      onDelete={async () => { try { await deleteProject(p.id); toast({ title: d.actions.deleted }); } catch (err: any) { toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" }); } }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || (p.images?.[0] ?? "")}
                          alt=""
                          className="w-14 h-12 rounded-xl object-cover bg-muted shrink-0 border border-border/40"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold truncate">{p.title}</h3>
                            <Badge variant="secondary" className="text-[10px] shrink-0">{categoryLabels[p.category] ?? p.category}</Badge>
                            {(p.images?.length ?? 0) > 1 && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Image className="w-3 h-3" /> {p.images!.length}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.tags.slice(0, 4).join(" · ")}</p>
                          <div className="flex gap-2 mt-1">
                            {p.liveUrl && p.liveUrl !== "#" && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5"><ExternalLink className="w-2.5 h-2.5" /> {d.links.live}</a>}
                            {p.githubUrl && p.githubUrl !== "#" && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:underline flex items-center gap-0.5"><Github className="w-2.5 h-2.5" /> {d.links.github}</a>}
                          </div>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── PERSONAL INFO ── */}
          <TabsContent value="info">
            <PersonalInfoEditor info={personalInfo} onSave={setPersonalInfo} />
          </TabsContent>

          {/* ── EXPERIENCE ── */}
          <TabsContent value="experience">
            <SectionHeader
              icon={Briefcase} title={d.sections.experience.title} count={experience.length} color="#3B82F6"
              onAdd={() => setExpDialog({ open: true })} addLabel={d.sections.experience.add}
              itemLabel={experience.length === 1 ? d.itemCount.one : d.itemCount.many}
            />
            <AnimatePresence mode="popLayout">
              {experience.length === 0 ? (
                <EmptyState
                  key="empty-exp"
                  icon={Briefcase}
                  title={d.sections.experience.emptyTitle}
                  description={d.sections.experience.emptyDescription}
                  onAdd={() => setExpDialog({ open: true })}
                  addLabel={d.sections.experience.emptyAdd}
                />
              ) : (
                <div className="space-y-3">
                  {experience.map((e, i) => (
                    <ItemCard
                      key={e.id} index={i}
                      onEdit={() => setExpDialog({ open: true, item: e })}
                      onDelete={async () => { try { await deleteExperience(e.id); toast({ title: d.actions.deleted }); } catch (err: any) { toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" }); } }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold leading-none">{language === "ar" ? e.roleAr || e.role : e.role}</p>
                          <p className="text-sm text-muted-foreground mt-1">{e.company} <span className="text-border">·</span> {e.period}</p>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── EDUCATION ── */}
          <TabsContent value="education">
            <SectionHeader
              icon={GraduationCap} title={d.sections.education.title} count={education.length} color="#10B981"
              onAdd={() => setEduDialog({ open: true })} addLabel={d.sections.education.add}
              itemLabel={education.length === 1 ? d.itemCount.one : d.itemCount.many}
            />
            <AnimatePresence mode="popLayout">
              {education.length === 0 ? (
                <EmptyState
                  key="empty-edu"
                  icon={BookOpen}
                  title={d.sections.education.emptyTitle}
                  description={d.sections.education.emptyDescription}
                  onAdd={() => setEduDialog({ open: true })}
                  addLabel={d.sections.education.emptyAdd}
                />
              ) : (
                <div className="space-y-3">
                  {education.map((e, i) => (
                    <ItemCard
                      key={e.id} index={i}
                      onEdit={() => setEduDialog({ open: true, item: e })}
                      onDelete={async () => { try { await deleteEducation(e.id); toast({ title: d.actions.deleted }); } catch (err: any) { toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" }); } }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4.5 h-4.5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold leading-none">
                            {language === "ar" ? e.degreeAr || e.degree : e.degree}{" "}
                            {language === "ar" ? e.fieldAr || e.field : e.field}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {language === "ar" ? e.institutionAr || e.institution : e.institution}{" "}
                            <span className="text-border">·</span> {e.period}
                            {e.gpa && <span className="ml-2 text-primary font-medium">{d.dialogs.educationItem.gpaLabel} {e.gpa}</span>}
                          </p>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── CERTIFICATES ── */}
          <TabsContent value="certificates">
            <SectionHeader
              icon={Award} title={d.sections.certificates.title} count={certificates.length} color="#F59E0B"
              onAdd={() => setCertDialog({ open: true })} addLabel={d.sections.certificates.add}
              itemLabel={certificates.length === 1 ? d.itemCount.one : d.itemCount.many}
            />
            <AnimatePresence mode="popLayout">
              {certificates.length === 0 ? (
                <EmptyState
                  key="empty-certs"
                  icon={Award}
                  title={d.sections.certificates.emptyTitle}
                  description={d.sections.certificates.emptyDescription}
                  onAdd={() => setCertDialog({ open: true })}
                  addLabel={d.sections.certificates.emptyAdd}
                />
              ) : (
                <div className="space-y-3">
                  {certificates.map((c, i) => (
                    <ItemCard
                      key={c.id} index={i}
                      onEdit={() => setCertDialog({ open: true, item: c })}
                      onDelete={async () => { try { await deleteCertificate(c.id); toast({ title: d.actions.deleted }); } catch (err: any) { toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" }); } }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: `${c.badgeColor}20`, border: `1px solid ${c.badgeColor}40` }}>
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
              )}
            </AnimatePresence>
          </TabsContent>

          {/* ── TESTIMONIALS ── */}
          <TabsContent value="testimonials">
            <SectionHeader
              icon={MessageCircle} title={d.sections.testimonials.title} count={testimonials.length} color="#3B82F6"
              onAdd={() => setTestDialog({ open: true })} addLabel={d.sections.testimonials.add}
              itemLabel={testimonials.length === 1 ? d.itemCount.one : d.itemCount.many}
            />
            <AnimatePresence mode="popLayout">
              {testimonials.length === 0 ? (
                <EmptyState
                  key="empty-test"
                  icon={MessageCircle}
                  title={d.sections.testimonials.emptyTitle}
                  description={d.sections.testimonials.emptyDescription}
                  onAdd={() => setTestDialog({ open: true })}
                  addLabel={d.sections.testimonials.emptyAdd}
                />
              ) : (
                <div className="space-y-3">
                  {testimonials.map((t, i) => (
                    <ItemCard
                      key={t.id} index={i}
                      onEdit={() => setTestDialog({ open: true, item: t })}
                      onDelete={async () => { try { await deleteTestimonial(t.id); toast({ title: d.actions.deleted }); } catch (err: any) { toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" }); } }}
                    >
                      <div className="flex items-start gap-3">
                        <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold leading-none">{language === "ar" ? t.nameAr || t.name : t.name}</p>
                            <div className="flex gap-0.5">
                              {Array(t.rating).fill(0).map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{language === "ar" ? t.roleAr || t.role : t.role}</p>
                          <p className="text-sm text-foreground/70 line-clamp-2">
                            "{language === "ar" ? t.textAr || t.text : t.text}"
                          </p>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Dialogs ── */}
      <ProjectDialog
        open={projectDialog.open}
        initial={projectDialog.item}
        onSave={async (data) => {
          try {
            if (projectDialog.item) {
              await updateProject(projectDialog.item.id, data);
              toast({ title: d.actions.saved });
            } else {
              await addProject(data);
              toast({ title: d.actions.saved });
            }
          } catch (err: any) {
            toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" });
            throw err;
          }
        }}
        onClose={() => setProjectDialog({ open: false })}
      />
      <ExperienceDialog
        open={expDialog.open}
        initial={expDialog.item}
        onSave={async (data) => {
          try {
            if (expDialog.item) {
              await updateExperience(expDialog.item.id, data);
              toast({ title: d.actions.saved });
            } else {
              await addExperience(data);
              toast({ title: d.actions.saved });
            }
          } catch (err: any) {
            toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" });
            throw err;
          }
        }}
        onClose={() => setExpDialog({ open: false })}
      />
      <EducationDialog
        open={eduDialog.open}
        initial={eduDialog.item}
        onSave={async (data) => {
          try {
            if (eduDialog.item) {
              await updateEducation(eduDialog.item.id, data);
              toast({ title: d.actions.saved });
            } else {
              await addEducation(data);
              toast({ title: d.actions.saved });
            }
          } catch (err: any) {
            toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" });
            throw err;
          }
        }}
        onClose={() => setEduDialog({ open: false })}
      />
      <CertificateDialog
        open={certDialog.open}
        initial={certDialog.item}
        onSave={async (data) => {
          try {
            if (certDialog.item) {
              await updateCertificate(certDialog.item.id, data);
              toast({ title: d.actions.saved });
            } else {
              await addCertificate(data);
              toast({ title: d.actions.saved });
            }
          } catch (err: any) {
            toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" });
            throw err;
          }
        }}
        onClose={() => setCertDialog({ open: false })}
      />
      <TestimonialDialog
        open={testDialog.open}
        initial={testDialog.item}
        onSave={async (data) => {
          try {
            if (testDialog.item) {
              await updateTestimonial(testDialog.item.id, data);
              toast({ title: d.actions.saved });
            } else {
              await addTestimonial(data);
              toast({ title: d.actions.saved });
            }
          } catch (err: any) {
            toast({ title: d.actions.error || "Error", description: err.message, variant: "destructive" });
            throw err;
          }
        }}
        onClose={() => setTestDialog({ open: false })}
      />
    </motion.div>
  );
}
