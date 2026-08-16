import { useEffect, useState } from "react";
import { usePortfolio, type Certificate, type Education, type Experience, type Project, type Testimonial } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { countryName, countryNames, countryValue } from "@/lib/countries";
import { Award, Briefcase, CheckCircle2, Code2, Eye, Globe, GraduationCap, MessageCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/* ─── helpers ─────────────────────────────────────────── */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}
export function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── Project Dialog ─────────────────────────────────── */
const blankProject = (): Omit<Project, "id"> => ({
  title: "",
  titleAr: "",
  description: "",
  descriptionAr: "",
  category: "Web",
  tags: [],
  imageUrl: "",
  images: [],
  liveUrl: "",
  githubUrl: "",
  androidUrl: "",
  iosUrl: "",
  isPublished: true,
});
export function ProjectDialog({ open, initial, onSave, onClose }: { open: boolean; initial?: Project; onSave: (p: Omit<Project, "id">) => Promise<void>; onClose: () => void }) {
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
    const imgs = val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setLocal((l) => ({ ...l, images: imgs, imageUrl: imgs[0] || "" }));
  };

  const previewImgs = imgText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const isValid = local.title.trim() && local.description.trim();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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
              <Input value={local.title} onChange={(e) => setLocal((l) => ({ ...l, title: e.target.value }))} placeholder={labels.placeholderTitleEn} />
            </Field>
            <Field label={labels.titleAr}>
              <Input value={local.titleAr} onChange={(e) => setLocal((l) => ({ ...l, titleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderTitleAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.category} required>
              <Select value={local.category} onValueChange={(v: any) => setLocal((l) => ({ ...l, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> {d.categories.web}
                    </span>
                  </SelectItem>
                  <SelectItem value="Mobile">
                    <span className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5" /> {d.categories.mobile}
                    </span>
                  </SelectItem>
                  <SelectItem value="Design">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> {d.categories.design}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={labels.tags} required>
              <Input
                value={local.tags.join(", ")}
                onChange={(e) =>
                  setLocal((l) => ({
                    ...l,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder={labels.placeholderTags}
              />
            </Field>
          </FieldRow>

          <Field label={labels.images}>
            <Textarea value={imgText} onChange={(e) => handleImgChange(e.target.value)} className="resize-none font-mono text-xs h-20" placeholder={labels.placeholderImages} />
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
              <Input value={local.liveUrl || ""} onChange={(e) => setLocal((l) => ({ ...l, liveUrl: e.target.value }))} placeholder={labels.placeholderLiveUrl} />
            </Field>
            <Field label={labels.githubUrl}>
              <Input value={local.githubUrl || ""} onChange={(e) => setLocal((l) => ({ ...l, githubUrl: e.target.value }))} placeholder={labels.placeholderGithubUrl} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.androidUrl}>
              <Input value={local.androidUrl || ""} onChange={(e) => setLocal((l) => ({ ...l, androidUrl: e.target.value }))} placeholder={labels.placeholderAndroidUrl} />
            </Field>
            <Field label={labels.iosUrl}>
              <Input value={local.iosUrl || ""} onChange={(e) => setLocal((l) => ({ ...l, iosUrl: e.target.value }))} placeholder={labels.placeholderIosUrl} />
            </Field>
          </FieldRow>
          <Field label={labels.descEn} required>
            <Textarea
              value={local.description}
              onChange={(e) => setLocal((l) => ({ ...l, description: e.target.value }))}
              className="resize-none h-20"
              placeholder={labels.placeholderDescEn}
            />
          </Field>
          <Field label={labels.descAr}>
            <Textarea
              value={local.descriptionAr}
              onChange={(e) => setLocal((l) => ({ ...l, descriptionAr: e.target.value }))}
              dir="rtl"
              className="resize-none h-20"
              placeholder={labels.placeholderDescAr}
            />
          </Field>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {d.actions.cancel}
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(local);
                onClose();
              } catch {
                setSaving(false);
              }
            }}
            disabled={!isValid || saving}
            className="gap-2"
          >
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />}{" "}
            {initial ? d.actions.saveChanges : d.sections.projects.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Experience Dialog ──────────────────────────────── */
const blankExp = (): Omit<Experience, "id"> => ({
  company: "",
  role: "",
  roleAr: "",
  period: "",
  description: "",
  descriptionAr: "",
});
export function ExperienceDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Experience;
  onSave: (e: Omit<Experience, "id">) => Promise<void>;
  onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.experience;
  const [local, setLocal] = useState<Omit<Experience, "id">>(initial ?? blankExp());
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setLocal(initial ?? blankExp());
    setSaving(false);
  }, [open, initial]);
  const isValid = local.company.trim() && local.role.trim() && local.period.trim();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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
              <Input value={local.company} onChange={(e) => setLocal((l) => ({ ...l, company: e.target.value }))} placeholder={labels.placeholderCompany} />
            </Field>
            <Field label={labels.period} required>
              <Input value={local.period} onChange={(e) => setLocal((l) => ({ ...l, period: e.target.value }))} placeholder={labels.placeholderPeriod} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.roleEn} required>
              <Input value={local.role} onChange={(e) => setLocal((l) => ({ ...l, role: e.target.value }))} placeholder={labels.placeholderRoleEn} />
            </Field>
            <Field label={labels.roleAr}>
              <Input value={local.roleAr} onChange={(e) => setLocal((l) => ({ ...l, roleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderRoleAr} />
            </Field>
          </FieldRow>
          <Field label={labels.descEn} required>
            <Textarea
              value={local.description}
              onChange={(e) => setLocal((l) => ({ ...l, description: e.target.value }))}
              className="resize-none h-24"
              placeholder={labels.placeholderDescEn}
            />
          </Field>
          <Field label={labels.descAr}>
            <Textarea
              value={local.descriptionAr}
              onChange={(e) => setLocal((l) => ({ ...l, descriptionAr: e.target.value }))}
              dir="rtl"
              className="resize-none h-20"
              placeholder={labels.placeholderDescAr}
            />
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {d.actions.cancel}
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(local);
                onClose();
              } catch {
                setSaving(false);
              }
            }}
            disabled={!isValid || saving}
            className="gap-2"
          >
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />}{" "}
            {initial ? d.actions.saveChanges : d.sections.experience.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Education Dialog ───────────────────────────────── */
const blankEdu = (): Omit<Education, "id"> => ({
  institution: "",
  institutionAr: "",
  degree: "",
  degreeAr: "",
  field: "",
  fieldAr: "",
  period: "",
  gpa: "",
  description: "",
  descriptionAr: "",
});
export function EducationDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Education;
  onSave: (e: Omit<Education, "id">) => Promise<void>;
  onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.education;
  const [local, setLocal] = useState<Omit<Education, "id">>(initial ?? blankEdu());
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setLocal(initial ?? blankEdu());
    setSaving(false);
  }, [open, initial]);
  const isValid = local.institution.trim() && local.degree.trim() && local.field.trim() && local.period.trim();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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
              <Input value={local.institution} onChange={(e) => setLocal((l) => ({ ...l, institution: e.target.value }))} placeholder={labels.placeholderInstitutionEn} />
            </Field>
            <Field label={labels.institutionAr}>
              <Input
                value={local.institutionAr}
                onChange={(e) => setLocal((l) => ({ ...l, institutionAr: e.target.value }))}
                dir="rtl"
                placeholder={labels.placeholderInstitutionAr}
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.degreeEn} required>
              <Input value={local.degree} onChange={(e) => setLocal((l) => ({ ...l, degree: e.target.value }))} placeholder={labels.placeholderDegreeEn} />
            </Field>
            <Field label={labels.degreeAr}>
              <Input value={local.degreeAr} onChange={(e) => setLocal((l) => ({ ...l, degreeAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderDegreeAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.fieldEn} required>
              <Input value={local.field} onChange={(e) => setLocal((l) => ({ ...l, field: e.target.value }))} placeholder={labels.placeholderFieldEn} />
            </Field>
            <Field label={labels.fieldAr}>
              <Input value={local.fieldAr} onChange={(e) => setLocal((l) => ({ ...l, fieldAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderFieldAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.period} required>
              <Input value={local.period} onChange={(e) => setLocal((l) => ({ ...l, period: e.target.value }))} placeholder={labels.placeholderPeriod} />
            </Field>
            <Field label={labels.gpa}>
              <Input value={local.gpa || ""} onChange={(e) => setLocal((l) => ({ ...l, gpa: e.target.value }))} placeholder={labels.placeholderGpa} />
            </Field>
          </FieldRow>
          <Field label={labels.descEn}>
            <Textarea
              value={local.description}
              onChange={(e) => setLocal((l) => ({ ...l, description: e.target.value }))}
              className="resize-none h-20"
              placeholder={labels.placeholderDescEn}
            />
          </Field>
          <Field label={labels.descAr}>
            <Textarea
              value={local.descriptionAr}
              onChange={(e) => setLocal((l) => ({ ...l, descriptionAr: e.target.value }))}
              dir="rtl"
              className="resize-none h-20"
              placeholder={labels.placeholderDescAr}
            />
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {d.actions.cancel}
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(local);
                onClose();
              } catch {
                setSaving(false);
              }
            }}
            disabled={!isValid || saving}
            className="gap-2"
          >
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />}{" "}
            {initial ? d.actions.saveChanges : d.sections.education.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Certificate Dialog ─────────────────────────────── */
const blankCert = (): Omit<Certificate, "id"> => ({
  title: "",
  titleAr: "",
  issuer: "",
  issuerAr: "",
  date: "",
  credentialUrl: "",
  badgeColor: "#6C63FF",
});
const blankTestimonial = (): Omit<Testimonial, "id"> => ({
  name: "",
  nameAr: "",
  role: "",
  roleAr: "",
  company: "",
  companyAr: "",
  countryCode: "SA",
  text: "",
  textAr: "",
  highlight: "",
  highlightAr: "",
  rating: 5,
  imageUrl: "",
});

/* ─── Testimonial Dialog ──────────────────────────────── */
export function TestimonialDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Testimonial;
  onSave: (t: Omit<Testimonial, "id">) => Promise<void>;
  onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.testimonial;
  const [local, setLocal] = useState<Omit<Testimonial, "id">>(initial ?? blankTestimonial());
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setLocal(initial ?? blankTestimonial());
    setSaving(false);
  }, [open, initial]);
  const isValid = local.name.trim() && local.role.trim() && local.text.trim() && local.countryCode.trim();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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
              <Input value={local.name} onChange={(e) => setLocal((l) => ({ ...l, name: e.target.value }))} placeholder={labels.placeholderNameEn} />
            </Field>
            <Field label={labels.nameAr}>
              <Input value={local.nameAr} onChange={(e) => setLocal((l) => ({ ...l, nameAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderNameAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.roleEn} required>
              <Input value={local.role} onChange={(e) => setLocal((l) => ({ ...l, role: e.target.value }))} placeholder={labels.placeholderRoleEn} />
            </Field>
            <Field label={labels.roleAr}>
              <Input value={local.roleAr} onChange={(e) => setLocal((l) => ({ ...l, roleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderRoleAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.companyEn}>
              <Input value={local.company} onChange={(e) => setLocal((l) => ({ ...l, company: e.target.value }))} placeholder={labels.placeholderCompanyEn} />
            </Field>
            <Field label={labels.companyAr}>
              <Input value={local.companyAr} onChange={(e) => setLocal((l) => ({ ...l, companyAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderCompanyAr} />
            </Field>
          </FieldRow>
          <Field label={labels.textEn} required>
            <Textarea value={local.text} onChange={(e) => setLocal((l) => ({ ...l, text: e.target.value }))} className="resize-none h-20" placeholder={labels.placeholderTextEn} />
          </Field>
          <Field label={labels.textAr}>
            <Textarea
              value={local.textAr}
              onChange={(e) => setLocal((l) => ({ ...l, textAr: e.target.value }))}
              dir="rtl"
              className="resize-none h-20"
              placeholder={labels.placeholderTextAr}
            />
          </Field>
          <FieldRow>
            <Field label={labels.highlightEn}>
              <Input value={local.highlight} onChange={(e) => setLocal((l) => ({ ...l, highlight: e.target.value }))} placeholder={labels.placeholderHighlightEn} />
            </Field>
            <Field label={labels.highlightAr}>
              <Input value={local.highlightAr} onChange={(e) => setLocal((l) => ({ ...l, highlightAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderHighlightAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.rating} required>
              <Select value={local.rating.toString()} onValueChange={(v) => setLocal((l) => ({ ...l, rating: parseInt(v) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {Array(n)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 inline" />
                        ))}{" "}
                      {n}⭐
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={labels.country} required>
              <Input
                list="testimonial-countries"
                value={countryName(local.countryCode, language)}
                onChange={(e) => setLocal((l) => ({ ...l, countryCode: countryValue(e.target.value, language) }))}
                dir={language === "ar" ? "rtl" : "ltr"}
                placeholder={labels.placeholderCountry}
              />
              <datalist id="testimonial-countries">
                {countryNames(language).map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </Field>
          </FieldRow>
          <Field label={labels.imageUrl}>
            <div className="flex gap-2">
              <Input value={local.imageUrl} onChange={(e) => setLocal((l) => ({ ...l, imageUrl: e.target.value }))} placeholder={labels.placeholderImageUrl} className="flex-1" />
              {local.imageUrl && <img src={local.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />}
            </div>
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {d.actions.cancel}
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave({ ...local, countryCode: local.countryCode.trim() });
                onClose();
              } catch {
                setSaving(false);
              }
            }}
            disabled={!isValid || saving}
            className="gap-2"
          >
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />}{" "}
            {initial ? d.actions.saveChanges : d.sections.testimonials.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CertificateDialog({
  open,
  initial,
  onSave,
  onClose,
}: {
  open: boolean;
  initial?: Certificate;
  onSave: (c: Omit<Certificate, "id">) => Promise<void>;
  onClose: () => void;
}) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const labels = d.dialogs.certificate;
  const [local, setLocal] = useState<Omit<Certificate, "id">>(initial ?? blankCert());
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setLocal(initial ?? blankCert());
    setSaving(false);
  }, [open, initial]);
  const isValid = local.title.trim() && local.issuer.trim() && local.date.trim();
  const PRESET_COLORS = ["#6C63FF", "#FF9900", "#0866FF", "#4285F4", "#00ED64", "#A259FF", "#F24E1E", "#06B6D4", "#3DDC84", "#FA7343"];
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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
              <Input value={local.title} onChange={(e) => setLocal((l) => ({ ...l, title: e.target.value }))} placeholder={labels.placeholderTitleEn} />
            </Field>
            <Field label={labels.titleAr}>
              <Input value={local.titleAr} onChange={(e) => setLocal((l) => ({ ...l, titleAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderTitleAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.issuerEn} required>
              <Input value={local.issuer} onChange={(e) => setLocal((l) => ({ ...l, issuer: e.target.value }))} placeholder={labels.placeholderIssuerEn} />
            </Field>
            <Field label={labels.issuerAr}>
              <Input value={local.issuerAr} onChange={(e) => setLocal((l) => ({ ...l, issuerAr: e.target.value }))} dir="rtl" placeholder={labels.placeholderIssuerAr} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.year} required>
              <Input value={local.date} onChange={(e) => setLocal((l) => ({ ...l, date: e.target.value }))} placeholder={labels.placeholderYear} />
            </Field>
            <Field label={labels.credentialUrl}>
              <Input value={local.credentialUrl || ""} onChange={(e) => setLocal((l) => ({ ...l, credentialUrl: e.target.value }))} placeholder={labels.placeholderCredential} />
            </Field>
          </FieldRow>
          <Field label={labels.badgeColor}>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setLocal((l) => ({ ...l, badgeColor: c }))}
                    className="w-8 h-8 rounded-lg transition-transform hover:scale-110 ring-offset-2 ring-offset-background"
                    style={{
                      background: c,
                      outline: local.badgeColor === c ? `3px solid ${c}` : "none",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={local.badgeColor}
                  onChange={(e) => setLocal((l) => ({ ...l, badgeColor: e.target.value }))}
                  className="h-9 w-16 rounded-lg cursor-pointer border border-border bg-background"
                />
                <span className="text-sm text-muted-foreground font-mono">{local.badgeColor}</span>
                <div className="w-9 h-9 rounded-xl border border-border/50" style={{ background: local.badgeColor }} />
              </div>
            </div>
          </Field>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {d.actions.cancel}
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(local);
                onClose();
              } catch {
                setSaving(false);
              }
            }}
            disabled={!isValid || saving}
            className="gap-2"
          >
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle2 className="w-4 h-4" />}{" "}
            {initial ? d.actions.saveChanges : d.sections.certificates.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
