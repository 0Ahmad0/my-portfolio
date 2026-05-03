import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePortfolio, Project, Experience, Education, Certificate, PersonalInfo, Testimonial
} from "@/contexts/PortfolioContext";
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
  icon: Icon, title, count, color, onAdd, addLabel
}: {
  icon: any; title: string; count: number; color: string; onAdd: () => void; addLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-none">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>
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
  onSave: (p: Omit<Project, "id">) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<Omit<Project, "id">>(initial ?? blankProject());
  const [imgText, setImgText] = useState((initial?.images?.length ? initial.images : initial?.imageUrl ? [initial.imageUrl] : []).join("\n"));

  useEffect(() => {
    setLocal(initial ?? blankProject());
    setImgText((initial?.images?.length ? initial.images : initial?.imageUrl ? [initial.imageUrl] : []).join("\n"));
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            {initial ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>Fill in the project details. All changes appear live on your portfolio.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label="Title (English)" required>
              <Input value={local.title} onChange={e => setLocal(l => ({ ...l, title: e.target.value }))} placeholder="My Awesome Project" />
            </Field>
            <Field label="Title (Arabic)">
              <Input value={local.titleAr} onChange={e => setLocal(l => ({ ...l, titleAr: e.target.value }))} dir="rtl" placeholder="مشروعي الرائع" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Category" required>
              <Select value={local.category} onValueChange={(v: any) => setLocal(l => ({ ...l, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web"><span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Web</span></SelectItem>
                  <SelectItem value="Mobile"><span className="flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> Mobile</span></SelectItem>
                  <SelectItem value="Design"><span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Design</span></SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tags (comma separated)" required>
              <Input
                value={local.tags.join(", ")}
                onChange={e => setLocal(l => ({ ...l, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
                placeholder="React, TypeScript, Node.js"
              />
            </Field>
          </FieldRow>

          <Field label="Project Images — one URL per line (first = cover)">
            <Textarea
              value={imgText}
              onChange={e => handleImgChange(e.target.value)}
              className="resize-none font-mono text-xs h-20"
              placeholder={"https://images.unsplash.com/photo-xxx?w=800\nhttps://images.unsplash.com/photo-yyy?w=800"}
            />
            {previewImgs.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewImgs.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-14 h-10 rounded-lg object-cover border border-border" />
                    {i === 0 && <span className="absolute -top-1.5 -right-1 bg-primary text-[9px] text-white px-1.5 py-0.5 rounded-full font-medium">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </Field>

          <FieldRow>
            <Field label="Live URL">
              <Input value={local.liveUrl || ""} onChange={e => setLocal(l => ({ ...l, liveUrl: e.target.value }))} placeholder="https://myapp.com" />
            </Field>
            <Field label="GitHub URL">
              <Input value={local.githubUrl || ""} onChange={e => setLocal(l => ({ ...l, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
            </Field>
          </FieldRow>
          <Field label="Description (English)" required>
            <Textarea value={local.description} onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} className="resize-none h-20" placeholder="Describe the project, its impact, and technologies used..." />
          </Field>
          <Field label="Description (Arabic)">
            <Textarea value={local.descriptionAr} onChange={e => setLocal(l => ({ ...l, descriptionAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder="وصف المشروع..." />
          </Field>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }} disabled={!isValid} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> {initial ? "Save Changes" : "Add Project"}
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
  open: boolean; initial?: Experience; onSave: (e: Omit<Experience, "id">) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState<Omit<Experience, "id">>(initial ?? blankExp());
  useEffect(() => { setLocal(initial ?? blankExp()); }, [open, initial]);
  const isValid = local.company.trim() && local.role.trim() && local.period.trim();
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            {initial ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>Add your work history. Shown on the portfolio's Experience section.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label="Company" required>
              <Input value={local.company} onChange={e => setLocal(l => ({ ...l, company: e.target.value }))} placeholder="Google, Startup Inc., Freelance" />
            </Field>
            <Field label="Period" required>
              <Input value={local.period} onChange={e => setLocal(l => ({ ...l, period: e.target.value }))} placeholder="2022 – Present" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Role (English)" required>
              <Input value={local.role} onChange={e => setLocal(l => ({ ...l, role: e.target.value }))} placeholder="Senior Frontend Engineer" />
            </Field>
            <Field label="Role (Arabic)">
              <Input value={local.roleAr} onChange={e => setLocal(l => ({ ...l, roleAr: e.target.value }))} dir="rtl" placeholder="مهندس واجهة أمامية" />
            </Field>
          </FieldRow>
          <Field label="Description (English)" required>
            <Textarea value={local.description} onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} className="resize-none h-24" placeholder="Key responsibilities, achievements, and impact..." />
          </Field>
          <Field label="Description (Arabic)">
            <Textarea value={local.descriptionAr} onChange={e => setLocal(l => ({ ...l, descriptionAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder="المسؤوليات والإنجازات..." />
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }} disabled={!isValid} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> {initial ? "Save Changes" : "Add Experience"}
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
  open: boolean; initial?: Education; onSave: (e: Omit<Education, "id">) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState<Omit<Education, "id">>(initial ?? blankEdu());
  useEffect(() => { setLocal(initial ?? blankEdu()); }, [open, initial]);
  const isValid = local.institution.trim() && local.degree.trim() && local.field.trim() && local.period.trim();
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-green-500" />
            </div>
            {initial ? "Edit Education" : "Add Education"}
          </DialogTitle>
          <DialogDescription>Add academic credentials and certifications from universities.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label="Institution (English)" required>
              <Input value={local.institution} onChange={e => setLocal(l => ({ ...l, institution: e.target.value }))} placeholder="Stanford University" />
            </Field>
            <Field label="Institution (Arabic)">
              <Input value={local.institutionAr} onChange={e => setLocal(l => ({ ...l, institutionAr: e.target.value }))} dir="rtl" placeholder="جامعة ستانفورد" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Degree (English)" required>
              <Input value={local.degree} onChange={e => setLocal(l => ({ ...l, degree: e.target.value }))} placeholder="Bachelor of Science" />
            </Field>
            <Field label="Degree (Arabic)">
              <Input value={local.degreeAr} onChange={e => setLocal(l => ({ ...l, degreeAr: e.target.value }))} dir="rtl" placeholder="بكالوريوس العلوم" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Field of Study (English)" required>
              <Input value={local.field} onChange={e => setLocal(l => ({ ...l, field: e.target.value }))} placeholder="Computer Science" />
            </Field>
            <Field label="Field of Study (Arabic)">
              <Input value={local.fieldAr} onChange={e => setLocal(l => ({ ...l, fieldAr: e.target.value }))} dir="rtl" placeholder="علوم الحاسب" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Period" required>
              <Input value={local.period} onChange={e => setLocal(l => ({ ...l, period: e.target.value }))} placeholder="2018 – 2022" />
            </Field>
            <Field label="GPA (optional)">
              <Input value={local.gpa || ""} onChange={e => setLocal(l => ({ ...l, gpa: e.target.value }))} placeholder="3.9 / 4.0" />
            </Field>
          </FieldRow>
          <Field label="Description (English)">
            <Textarea value={local.description} onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} className="resize-none h-20" placeholder="Highlights, thesis, notable courses..." />
          </Field>
          <Field label="Description (Arabic)">
            <Textarea value={local.descriptionAr} onChange={e => setLocal(l => ({ ...l, descriptionAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder="أبرز الإنجازات والمواد الدراسية..." />
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }} disabled={!isValid} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> {initial ? "Save Changes" : "Add Education"}
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
  open: boolean; initial?: Testimonial; onSave: (t: Omit<Testimonial, "id">) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState<Omit<Testimonial, "id">>(initial ?? blankTestimonial());
  useEffect(() => { setLocal(initial ?? blankTestimonial()); }, [open, initial]);
  const isValid = local.name.trim() && local.role.trim() && local.text.trim() && local.imageUrl.trim();
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-500" />
            </div>
            {initial ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
          <DialogDescription>Add client testimonials and feedback.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label="Client Name (English)" required>
              <Input value={local.name} onChange={e => setLocal(l => ({ ...l, name: e.target.value }))} placeholder="Sarah Johnson" />
            </Field>
            <Field label="Client Name (Arabic)">
              <Input value={local.nameAr} onChange={e => setLocal(l => ({ ...l, nameAr: e.target.value }))} dir="rtl" placeholder="سارة جونسون" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Role/Title (English)" required>
              <Input value={local.role} onChange={e => setLocal(l => ({ ...l, role: e.target.value }))} placeholder="CEO, TechStartup Inc" />
            </Field>
            <Field label="Role/Title (Arabic)">
              <Input value={local.roleAr} onChange={e => setLocal(l => ({ ...l, roleAr: e.target.value }))} dir="rtl" placeholder="الرئيس التنفيذي" />
            </Field>
          </FieldRow>
          <Field label="Testimonial Text (English)" required>
            <Textarea value={local.text} onChange={e => setLocal(l => ({ ...l, text: e.target.value }))} className="resize-none h-20" placeholder="Share what you loved about working together..." />
          </Field>
          <Field label="Testimonial Text (Arabic)">
            <Textarea value={local.textAr} onChange={e => setLocal(l => ({ ...l, textAr: e.target.value }))} dir="rtl" className="resize-none h-20" placeholder="شارك ما أعجبك..." />
          </Field>
          <FieldRow>
            <Field label="Rating (1-5 stars)" required>
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
            <Field label="Image URL" required>
              <div className="flex gap-2">
                <Input value={local.imageUrl} onChange={e => setLocal(l => ({ ...l, imageUrl: e.target.value }))} placeholder="https://..." className="flex-1" />
                {local.imageUrl && <img src={local.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />}
              </div>
            </Field>
          </FieldRow>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }} disabled={!isValid} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> {initial ? "Save Changes" : "Add Testimonial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CertificateDialog({ open, initial, onSave, onClose }: {
  open: boolean; initial?: Certificate; onSave: (c: Omit<Certificate, "id">) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState<Omit<Certificate, "id">>(initial ?? blankCert());
  useEffect(() => { setLocal(initial ?? blankCert()); }, [open, initial]);
  const isValid = local.title.trim() && local.issuer.trim() && local.date.trim();
  const PRESET_COLORS = ["#6C63FF", "#FF9900", "#0866FF", "#4285F4", "#00ED64", "#A259FF", "#F24E1E", "#06B6D4", "#3DDC84", "#FA7343"];
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            {initial ? "Edit Certificate" : "Add Certificate"}
          </DialogTitle>
          <DialogDescription>Add professional certifications and credentials.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FieldRow>
            <Field label="Certificate Title (English)" required>
              <Input value={local.title} onChange={e => setLocal(l => ({ ...l, title: e.target.value }))} placeholder="AWS Solutions Architect" />
            </Field>
            <Field label="Certificate Title (Arabic)">
              <Input value={local.titleAr} onChange={e => setLocal(l => ({ ...l, titleAr: e.target.value }))} dir="rtl" placeholder="مهندس حلول AWS" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Issuer (English)" required>
              <Input value={local.issuer} onChange={e => setLocal(l => ({ ...l, issuer: e.target.value }))} placeholder="Amazon Web Services" />
            </Field>
            <Field label="Issuer (Arabic)">
              <Input value={local.issuerAr} onChange={e => setLocal(l => ({ ...l, issuerAr: e.target.value }))} dir="rtl" placeholder="أمازون ويب سيرفيسز" />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Year" required>
              <Input value={local.date} onChange={e => setLocal(l => ({ ...l, date: e.target.value }))} placeholder="2024" />
            </Field>
            <Field label="Credential URL (optional)">
              <Input value={local.credentialUrl || ""} onChange={e => setLocal(l => ({ ...l, credentialUrl: e.target.value }))} placeholder="https://verify.example.com/..." />
            </Field>
          </FieldRow>
          <Field label="Badge Color">
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }} disabled={!isValid} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> {initial ? "Save Changes" : "Add Certificate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Item card row ──────────────────────────────────── */
function ItemCard({ children, onEdit, onDelete, index }: {
  children: React.ReactNode; onEdit: () => void; onDelete: () => void; index: number;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
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
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={onDelete} className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Confirm
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" /> Edit
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
function PersonalInfoEditor({ info, onSave }: { info: PersonalInfo; onSave: (i: PersonalInfo) => void }) {
  const [local, setLocal] = useState({ ...info, floatingSkills: info.floatingSkills || ["React", "Flutter", "TypeScript", "Node.js", "Figma", "Next.js"] });
  const [saved, setSaved] = useState(false);
  useEffect(() => { setLocal({ ...info, floatingSkills: info.floatingSkills || ["React", "Flutter", "TypeScript", "Node.js", "Figma", "Next.js"] }); }, [info]);

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          Personal Information
        </CardTitle>
        <CardDescription>Update your bio, contact details, and social links. Changes save to localStorage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <FieldRow>
          <Field label="Name (English)" required><Input value={local.name} onChange={e => setLocal(l => ({ ...l, name: e.target.value }))} /></Field>
          <Field label="Name (Arabic)"><Input value={local.nameAr} onChange={e => setLocal(l => ({ ...l, nameAr: e.target.value }))} dir="rtl" /></Field>
        </FieldRow>
        <FieldRow>
          <Field label="Email" required><Input value={local.email} onChange={e => setLocal(l => ({ ...l, email: e.target.value }))} type="email" /></Field>
          <Field label="Location (English)"><Input value={local.location} onChange={e => setLocal(l => ({ ...l, location: e.target.value }))} /></Field>
        </FieldRow>
        <FieldRow>
          <Field label="Location (Arabic)"><Input value={local.locationAr} onChange={e => setLocal(l => ({ ...l, locationAr: e.target.value }))} dir="rtl" /></Field>
          <Field label="Avatar URL">
            <div className="flex gap-2">
              <Input value={local.avatarUrl} onChange={e => setLocal(l => ({ ...l, avatarUrl: e.target.value }))} placeholder="https://..." className="flex-1" />
              {local.avatarUrl && <img src={local.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-border shrink-0" />}
            </div>
          </Field>
        </FieldRow>
        <Field label="Bio (English)" required><Textarea value={local.bio} onChange={e => setLocal(l => ({ ...l, bio: e.target.value }))} className="h-24 resize-none" /></Field>
        <Field label="Bio (Arabic)"><Textarea value={local.bioAr} onChange={e => setLocal(l => ({ ...l, bioAr: e.target.value }))} className="h-24 resize-none" dir="rtl" /></Field>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Social Links
          </p>
          <FieldRow>
            <Field label="GitHub"><Input value={local.github} onChange={e => setLocal(l => ({ ...l, github: e.target.value }))} placeholder="https://github.com/..." /></Field>
            <Field label="LinkedIn"><Input value={local.linkedin} onChange={e => setLocal(l => ({ ...l, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Twitter / X"><Input value={local.twitter} onChange={e => setLocal(l => ({ ...l, twitter: e.target.value }))} placeholder="https://twitter.com/..." /></Field>
            <Field label="Instagram"><Input value={local.instagram} onChange={e => setLocal(l => ({ ...l, instagram: e.target.value }))} placeholder="https://instagram.com/..." /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Facebook"><Input value={local.facebook} onChange={e => setLocal(l => ({ ...l, facebook: e.target.value }))} placeholder="https://facebook.com/..." /></Field>
            <Field label="Telegram"><Input value={local.telegram} onChange={e => setLocal(l => ({ ...l, telegram: e.target.value }))} placeholder="https://t.me/..." /></Field>
          </FieldRow>
          <div className="mt-4">
            <Field label="WhatsApp"><Input value={local.whatsapp} onChange={e => setLocal(l => ({ ...l, whatsapp: e.target.value }))} placeholder="https://wa.me/..." /></Field>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Floating Skill Icons
          </p>
          <Field label="Skills to display around avatar (comma-separated, max 6)">
            <Textarea 
              value={local.floatingSkills.join(", ")} 
              onChange={e => setLocal(l => ({ ...l, floatingSkills: e.target.value.split(",").map(s => s.trim()).filter(Boolean).slice(0, 6) }))} 
              placeholder="React, Flutter, TypeScript, Node.js, Figma, Next.js"
              className="h-16 resize-none"
            />
          </Field>
          <p className="text-xs text-muted-foreground mt-2">Examples: React, Flutter, TypeScript, Node.js, Python, Figma, Next.js, etc.</p>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> CV & Resume
          </p>
          <Field label="CV Download URL">
            <Input value={local.cvUrl} onChange={e => setLocal(l => ({ ...l, cvUrl: e.target.value }))} placeholder="https://example.com/cv.pdf" />
          </Field>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} className="gap-2 min-w-[140px]">
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : "Save Changes"}
          </Button>
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem("admin_auth") === "true"; } catch { return false; }
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {
    language, projects, updateProject, addProject, deleteProject,
    personalInfo, setPersonalInfo,
    experience, updateExperience, addExperience, deleteExperience,
    education, updateEducation, addEducation, deleteEducation,
    certificates, updateCertificate, addCertificate, deleteCertificate,
    testimonials, updateTestimonial, addTestimonial, deleteTestimonial,
  } = usePortfolio();

  const t = translations[language];

  /* dialog state */
  const [projectDialog, setProjectDialog] = useState<{ open: boolean; item?: Project }>({ open: false });
  const [expDialog, setExpDialog] = useState<{ open: boolean; item?: Experience }>({ open: false });
  const [eduDialog, setEduDialog] = useState<{ open: boolean; item?: Education }>({ open: false });
  const [certDialog, setCertDialog] = useState<{ open: boolean; item?: Certificate }>({ open: false });
  const [testDialog, setTestDialog] = useState<{ open: boolean; item?: Testimonial }>({ open: false });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      try { sessionStorage.setItem("admin_auth", "true"); } catch {}
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try { sessionStorage.removeItem("admin_auth"); } catch {}
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
              <CardTitle className="text-2xl font-bold">{t.dashboard.login}</CardTitle>
              <CardDescription>Enter password to manage your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder={t.dashboard.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
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
                  {t.dashboard.enter}
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2 hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Return to Portfolio
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
              <h1 className="text-base font-bold leading-none">Portfolio Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                <Eye className="h-3.5 w-3.5" /> View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mb-8">
          <StatBadge icon={Code2}        label="Projects"     value={projects.length}     color="#7C3AED" />
          <StatBadge icon={Briefcase}    label="Experience"   value={experience.length}   color="#3B82F6" />
          <StatBadge icon={GraduationCap} label="Education"   value={education.length}    color="#10B981" />
          <StatBadge icon={Award}        label="Certificates" value={certificates.length} color="#F59E0B" />
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
              <MessageCircle className="w-3.5 h-3.5" /> Testimonials
            </TabsTrigger>
          </TabsList>

          {/* ── PROJECTS ── */}
          <TabsContent value="projects">
            <SectionHeader
              icon={Code2} title="Projects" count={projects.length} color="#7C3AED"
              onAdd={() => setProjectDialog({ open: true })} addLabel="Add Project"
            />
            <AnimatePresence mode="popLayout">
              {projects.length === 0 ? (
                <EmptyState
                  key="empty-projects"
                  icon={FolderOpen}
                  title="No projects yet"
                  description="Showcase your work by adding your first project. Include images, links, and a description to impress visitors."
                  onAdd={() => setProjectDialog({ open: true })}
                  addLabel="Add Your First Project"
                />
              ) : (
                <div className="space-y-3">
                  {projects.map((p, i) => (
                    <ItemCard
                      key={p.id} index={i}
                      onEdit={() => setProjectDialog({ open: true, item: p })}
                      onDelete={() => deleteProject(p.id)}
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
                            <Badge variant="secondary" className="text-[10px] shrink-0">{p.category}</Badge>
                            {(p.images?.length ?? 0) > 1 && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Image className="w-3 h-3" /> {p.images!.length}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.tags.slice(0, 4).join(" · ")}</p>
                          <div className="flex gap-2 mt-1">
                            {p.liveUrl && p.liveUrl !== "#" && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5"><ExternalLink className="w-2.5 h-2.5" /> Live</a>}
                            {p.githubUrl && p.githubUrl !== "#" && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:underline flex items-center gap-0.5"><Github className="w-2.5 h-2.5" /> GitHub</a>}
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
              icon={Briefcase} title="Experience" count={experience.length} color="#3B82F6"
              onAdd={() => setExpDialog({ open: true })} addLabel="Add Experience"
            />
            <AnimatePresence mode="popLayout">
              {experience.length === 0 ? (
                <EmptyState
                  key="empty-exp"
                  icon={Briefcase}
                  title="No experience added"
                  description="Add your work history to show visitors where you've worked and what impact you've made in each role."
                  onAdd={() => setExpDialog({ open: true })}
                  addLabel="Add Your First Role"
                />
              ) : (
                <div className="space-y-3">
                  {experience.map((e, i) => (
                    <ItemCard
                      key={e.id} index={i}
                      onEdit={() => setExpDialog({ open: true, item: e })}
                      onDelete={() => deleteExperience(e.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold leading-none">{e.role}</p>
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
              icon={GraduationCap} title="Education" count={education.length} color="#10B981"
              onAdd={() => setEduDialog({ open: true })} addLabel="Add Education"
            />
            <AnimatePresence mode="popLayout">
              {education.length === 0 ? (
                <EmptyState
                  key="empty-edu"
                  icon={BookOpen}
                  title="No education entries"
                  description="Add your academic background — degrees, bootcamps, and online courses all count."
                  onAdd={() => setEduDialog({ open: true })}
                  addLabel="Add Education"
                />
              ) : (
                <div className="space-y-3">
                  {education.map((e, i) => (
                    <ItemCard
                      key={e.id} index={i}
                      onEdit={() => setEduDialog({ open: true, item: e })}
                      onDelete={() => deleteEducation(e.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4.5 h-4.5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold leading-none">{e.degree} in {e.field}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {e.institution} <span className="text-border">·</span> {e.period}
                            {e.gpa && <span className="ml-2 text-primary font-medium">GPA {e.gpa}</span>}
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
              icon={Award} title="Certificates" count={certificates.length} color="#F59E0B"
              onAdd={() => setCertDialog({ open: true })} addLabel="Add Certificate"
            />
            <AnimatePresence mode="popLayout">
              {certificates.length === 0 ? (
                <EmptyState
                  key="empty-certs"
                  icon={Award}
                  title="No certificates yet"
                  description="Add professional certificates and credentials to build credibility with visitors."
                  onAdd={() => setCertDialog({ open: true })}
                  addLabel="Add Your First Certificate"
                />
              ) : (
                <div className="space-y-3">
                  {certificates.map((c, i) => (
                    <ItemCard
                      key={c.id} index={i}
                      onEdit={() => setCertDialog({ open: true, item: c })}
                      onDelete={() => deleteCertificate(c.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: `${c.badgeColor}20`, border: `1px solid ${c.badgeColor}40` }}>
                          <Award className="w-4.5 h-4.5" style={{ color: c.badgeColor }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold leading-none">{c.title}</p>
                            {c.credentialUrl && (
                              <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/70">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{c.issuer} <span className="text-border">·</span> {c.date}</p>
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
              icon={MessageCircle} title="Testimonials" count={testimonials.length} color="#3B82F6"
              onAdd={() => setTestDialog({ open: true })} addLabel="Add Testimonial"
            />
            <AnimatePresence mode="popLayout">
              {testimonials.length === 0 ? (
                <EmptyState
                  key="empty-test"
                  icon={MessageCircle}
                  title="No testimonials yet"
                  description="Add client testimonials to build trust and showcase your work quality."
                  onAdd={() => setTestDialog({ open: true })}
                  addLabel="Add Your First Testimonial"
                />
              ) : (
                <div className="space-y-3">
                  {testimonials.map((t, i) => (
                    <ItemCard
                      key={t.id} index={i}
                      onEdit={() => setTestDialog({ open: true, item: t })}
                      onDelete={() => deleteTestimonial(t.id)}
                    >
                      <div className="flex items-start gap-3">
                        <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold leading-none">{t.name}</p>
                            <div className="flex gap-0.5">
                              {Array(t.rating).fill(0).map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{t.role}</p>
                          <p className="text-sm text-foreground/70 line-clamp-2">"{t.text}"</p>
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
        onSave={(data) => {
          if (projectDialog.item) {
            updateProject(projectDialog.item.id, data);
          } else {
            addProject({ ...data, id: Date.now().toString() });
          }
        }}
        onClose={() => setProjectDialog({ open: false })}
      />
      <ExperienceDialog
        open={expDialog.open}
        initial={expDialog.item}
        onSave={(data) => {
          if (expDialog.item) updateExperience(expDialog.item.id, data);
          else addExperience({ ...data, id: Date.now().toString() });
        }}
        onClose={() => setExpDialog({ open: false })}
      />
      <EducationDialog
        open={eduDialog.open}
        initial={eduDialog.item}
        onSave={(data) => {
          if (eduDialog.item) updateEducation(eduDialog.item.id, data);
          else addEducation({ ...data, id: Date.now().toString() });
        }}
        onClose={() => setEduDialog({ open: false })}
      />
      <CertificateDialog
        open={certDialog.open}
        initial={certDialog.item}
        onSave={(data) => {
          if (certDialog.item) updateCertificate(certDialog.item.id, data);
          else addCertificate({ ...data, id: Date.now().toString() });
        }}
        onClose={() => setCertDialog({ open: false })}
      />
      <TestimonialDialog
        open={testDialog.open}
        initial={testDialog.item}
        onSave={(data) => {
          if (testDialog.item) updateTestimonial(testDialog.item.id, data);
          else addTestimonial({ ...data, id: Date.now().toString() });
        }}
        onClose={() => setTestDialog({ open: false })}
      />
    </motion.div>
  );
}
