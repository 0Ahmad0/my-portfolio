import { useEffect, useState } from "react";
import { type PersonalInfo, usePortfolio } from "@/contexts/PortfolioContext";
import { defaultCoreSkills as DEFAULT_CORE_SKILLS, defaultFloatingSkills as DEFAULT_FLOATING_SKILLS } from "@/contexts/portfolio-data";
import { translations } from "@/lib/i18n";
import { ArrowDown, ArrowUp, Check, CheckCircle2, Clock3, Code2, Download, Globe, Palette, Sparkles, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  applyThemeColor,
  CURATED_THEME_COLORS,
  getEffectiveThemeColor,
  normalizeThemeColor,
} from "@/lib/theme-colors";
import { Field, FieldRow } from "./DashboardEditors";

/* ─── Personal Info editor (inline, saves in place) ─── */
export function PersonalInfoEditor({ info, onSave }: { info: PersonalInfo; onSave: (i: PersonalInfo) => Promise<void> }) {
  const [local, setLocal] = useState({
    ...info,
    floatingSkills: info.floatingSkills?.length ? info.floatingSkills : DEFAULT_FLOATING_SKILLS,
    coreSkills: info.coreSkills?.length ? info.coreSkills : DEFAULT_CORE_SKILLS,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const { toast } = useToast();
  const labels = d.dialogs.personalInfo;
  useEffect(() => {
    setLocal({
      ...info,
      floatingSkills: info.floatingSkills?.length ? info.floatingSkills : DEFAULT_FLOATING_SKILLS,
      coreSkills: info.coreSkills?.length ? info.coreSkills : DEFAULT_CORE_SKILLS,
    });
  }, [info]);

  useEffect(() => {
    applyThemeColor(
      getEffectiveThemeColor(local.primaryColor, local.colorRotationEnabled),
    );
    return () => {
      applyThemeColor(
        getEffectiveThemeColor(info.primaryColor, info.colorRotationEnabled),
      );
    };
  }, [
    info.primaryColor,
    info.colorRotationEnabled,
    local.primaryColor,
    local.colorRotationEnabled,
  ]);

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
      toast({
        title: d.actions.error || "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const moveSkill = (field: "floatingSkills" | "coreSkills", index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= local[field].length) return;
    setLocal((current) => {
      const next = [...current[field]];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, [field]: next };
    });
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
          <Field label={labels.nameEn} required>
            <Input value={local.name} onChange={(e) => setLocal((l) => ({ ...l, name: e.target.value }))} />
          </Field>
          <Field label={labels.nameAr}>
            <Input value={local.nameAr} onChange={(e) => setLocal((l) => ({ ...l, nameAr: e.target.value }))} dir="rtl" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label={labels.email} required>
            <Input value={local.email} onChange={(e) => setLocal((l) => ({ ...l, email: e.target.value }))} type="email" />
          </Field>
          <Field label={labels.locationEn}>
            <Input value={local.location} onChange={(e) => setLocal((l) => ({ ...l, location: e.target.value }))} />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label={labels.locationAr}>
            <Input value={local.locationAr} onChange={(e) => setLocal((l) => ({ ...l, locationAr: e.target.value }))} dir="rtl" />
          </Field>
          <Field label={labels.avatarUrl}>
            <div className="flex gap-2">
              <Input value={local.avatarUrl} onChange={(e) => setLocal((l) => ({ ...l, avatarUrl: e.target.value }))} placeholder={labels.placeholderAvatar} className="flex-1" />
              {local.avatarUrl && <img src={local.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-border shrink-0" />}
            </div>
          </Field>
        </FieldRow>
        <Field label={labels.bioEn} required>
          <Textarea value={local.bio} onChange={(e) => setLocal((l) => ({ ...l, bio: e.target.value }))} className="h-24 resize-none" />
        </Field>
        <Field label={labels.bioAr}>
          <Textarea value={local.bioAr} onChange={(e) => setLocal((l) => ({ ...l, bioAr: e.target.value }))} className="h-24 resize-none" dir="rtl" />
        </Field>

        <div className="border-t border-border pt-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10">
              <Palette className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {language === "ar" ? "هوية ألوان الموقع" : "Website color identity"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {language === "ar"
                  ? "اختر لونًا ثابتًا، أو فعّل التبديل التلقائي بين 10 ألوان متناسقة كل 6 ساعات."
                  : "Choose a fixed color, or rotate through 10 curated colors every 6 hours."}
              </p>
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={!local.colorRotationEnabled}
              onClick={() => setLocal((current) => ({ ...current, colorRotationEnabled: false }))}
              className={`rounded-2xl border p-4 text-start transition-colors ${!local.colorRotationEnabled ? "border-primary bg-primary/10 ring-1 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
            >
              <span className="font-semibold">
                {language === "ar" ? "لون ثابت" : "Fixed color"}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {language === "ar" ? "يبقى اللون الذي تختاره." : "Keep the color you select."}
              </span>
            </button>
            <button
              type="button"
              aria-pressed={local.colorRotationEnabled}
              onClick={() => setLocal((current) => ({ ...current, colorRotationEnabled: true }))}
              className={`rounded-2xl border p-4 text-start transition-colors ${local.colorRotationEnabled ? "border-primary bg-primary/10 ring-1 ring-primary/30" : "border-border bg-background hover:border-primary/40"}`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <Clock3 className="size-4 text-primary" />
                {language === "ar" ? "تلقائي كل 6 ساعات" : "Automatic every 6 hours"}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {language === "ar" ? "يتنقل بين الألوان العشرة." : "Cycle through all ten colors."}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {CURATED_THEME_COLORS.map((color) => {
              const selected =
                !local.colorRotationEnabled &&
                normalizeThemeColor(local.primaryColor) === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  title={language === "ar" ? color.nameAr : color.nameEn}
                  aria-label={language === "ar" ? color.nameAr : color.nameEn}
                  aria-pressed={selected}
                  onClick={() =>
                    setLocal((current) => ({
                      ...current,
                      primaryColor: color.value,
                      colorRotationEnabled: false,
                    }))
                  }
                  className="grid aspect-square min-h-10 place-items-center rounded-xl border-2 border-white/70 shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{ backgroundColor: color.value }}
                >
                  {selected && <Check className="size-5 text-white drop-shadow" />}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-muted/35 p-4 sm:flex-row sm:items-center">
            <div
              className="size-12 shrink-0 rounded-xl border-2 border-white shadow-sm"
              style={{
                backgroundColor: getEffectiveThemeColor(
                  local.primaryColor,
                  local.colorRotationEnabled,
                ),
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {local.colorRotationEnabled
                  ? language === "ar"
                    ? "اللون التلقائي الحالي"
                    : "Current automatic color"
                  : language === "ar"
                    ? "لون مخصص"
                    : "Custom color"}
              </p>
              <p className="font-mono text-xs uppercase text-muted-foreground">
                {getEffectiveThemeColor(local.primaryColor, local.colorRotationEnabled)}
              </p>
            </div>
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 text-sm font-medium hover:border-primary/50">
              <Palette className="size-4 text-primary" />
              {language === "ar" ? "اختيار لون" : "Pick a color"}
              <input
                type="color"
                value={normalizeThemeColor(local.primaryColor)}
                onChange={(event) =>
                  setLocal((current) => ({
                    ...current,
                    primaryColor: event.target.value.toUpperCase(),
                    colorRotationEnabled: false,
                  }))
                }
                className="sr-only"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> {labels.socialLinks}
          </p>
          <FieldRow>
            <Field label={labels.github}>
              <Input value={local.github} onChange={(e) => setLocal((l) => ({ ...l, github: e.target.value }))} placeholder={labels.placeholderGithub} />
            </Field>
            <Field label={labels.linkedin}>
              <Input value={local.linkedin} onChange={(e) => setLocal((l) => ({ ...l, linkedin: e.target.value }))} placeholder={labels.placeholderLinkedin} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.twitter}>
              <Input value={local.twitter} onChange={(e) => setLocal((l) => ({ ...l, twitter: e.target.value }))} placeholder={labels.placeholderTwitter} />
            </Field>
            <Field label={labels.instagram}>
              <Input value={local.instagram} onChange={(e) => setLocal((l) => ({ ...l, instagram: e.target.value }))} placeholder={labels.placeholderInstagram} />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label={labels.facebook}>
              <Input value={local.facebook} onChange={(e) => setLocal((l) => ({ ...l, facebook: e.target.value }))} placeholder={labels.placeholderFacebook} />
            </Field>
            <Field label={labels.telegram}>
              <Input value={local.telegram} onChange={(e) => setLocal((l) => ({ ...l, telegram: e.target.value }))} placeholder={labels.placeholderTelegram} />
            </Field>
          </FieldRow>
          <div className="mt-4">
            <Field label={labels.whatsapp}>
              <Input value={local.whatsapp} onChange={(e) => setLocal((l) => ({ ...l, whatsapp: e.target.value }))} placeholder={labels.placeholderWhatsapp} />
            </Field>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> {labels.floatingSkills}
          </p>
          <Field label={labels.floatingSkillsLabel}>
            <Textarea
              value={local.floatingSkills.join(", ")}
              onChange={(e) =>
                setLocal((l) => ({
                  ...l,
                  floatingSkills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 6),
                }))
              }
              placeholder={labels.placeholderFloating}
              className="h-16 resize-none"
            />
          </Field>
          {local.floatingSkills.length > 0 && (
            <div className="space-y-2 mt-3">
              {local.floatingSkills.map((skill, index) => (
                <div key={`${skill}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
                  <span className="text-sm font-medium truncate">{skill}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveSkill("floatingSkills", index, -1)}
                      disabled={index === 0}
                      title={language === "ar" ? "نقل للأعلى" : "Move up"}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveSkill("floatingSkills", index, 1)}
                      disabled={index === local.floatingSkills.length - 1}
                      title={language === "ar" ? "نقل للأسفل" : "Move down"}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setLocal((l) => ({
                          ...l,
                          floatingSkills: l.floatingSkills.filter((_, i) => i !== index),
                        }))
                      }
                      title={language === "ar" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">{labels.floatingSkillsHelp}</p>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" /> {labels.coreSkills}
          </p>
          <Field label={labels.coreSkillsLabel}>
            <Textarea
              value={local.coreSkills.join(", ")}
              onChange={(e) =>
                setLocal((l) => ({
                  ...l,
                  coreSkills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder={labels.placeholderCoreSkills}
              className="h-20 resize-none"
            />
          </Field>
          {local.coreSkills.length > 0 && (
            <div className="space-y-2 mt-3">
              {local.coreSkills.map((skill, index) => (
                <div key={`${skill}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
                  <span className="text-sm font-medium truncate">{skill}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveSkill("coreSkills", index, -1)}
                      disabled={index === 0}
                      title={language === "ar" ? "نقل للأعلى" : "Move up"}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveSkill("coreSkills", index, 1)}
                      disabled={index === local.coreSkills.length - 1}
                      title={language === "ar" ? "نقل للأسفل" : "Move down"}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setLocal((l) => ({
                          ...l,
                          coreSkills: l.coreSkills.filter((_, i) => i !== index),
                        }))
                      }
                      title={language === "ar" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">{labels.coreSkillsHelp}</p>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> {labels.cvResume}
          </p>
          <Field label={labels.cvUrl}>
            <Input value={local.cvUrl} onChange={(e) => setLocal((l) => ({ ...l, cvUrl: e.target.value }))} placeholder={labels.placeholderCv} />
          </Field>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-35">
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> {d.actions.saved}
              </>
            ) : (
              d.actions.saveChanges
            )}
          </Button>
          {saveError && <p className="text-sm text-destructive mt-2 text-right w-full">{saveError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
