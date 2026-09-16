import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Download,
  CheckCircle2,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";

const formSchema = (language: "ar" | "en") =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, {
        message: language === "ar" ? "يرجى كتابة الاسم" : "Name is required",
      }),
    email: z
      .string()
      .trim()
      .email({
        message:
          language === "ar"
            ? "يرجى إدخال بريد إلكتروني صحيح"
            : "Invalid email address",
      }),
    message: z
      .string()
      .trim()
      .min(10, {
        message:
          language === "ar"
            ? "يرجى كتابة رسالة من 10 أحرف على الأقل"
            : "Message is too short",
      }),
  });

type ContactFormValues = z.infer<ReturnType<typeof formSchema>>;

async function sendContactMessage(values: ContactFormValues) {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) return null;
      const data = await response.json().catch(() => ({}));
      return data.error || "Failed to send message";
    } catch {
      return "Network error. Please try again.";
    }
  }

  if (!supabase)
    return "Contact service is unavailable. Please use the email link.";
  const { error } = await supabase.from("contact_messages").insert(values);
  return error?.message ?? null;
}

function ContactDetails() {
  const { language, personalInfo } = usePortfolio();
  const t = translations[language];
  const socialLinks = [
    {
      href: personalInfo.github,
      title: "GitHub",
      className: "bg-primary/10 hover:bg-primary/20",
      icon: Github,
    },
    {
      href: personalInfo.linkedin,
      title: "LinkedIn",
      className:
        "bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400",
      icon: Linkedin,
    },
    {
      href: personalInfo.instagram,
      title: "Instagram",
      className:
        "bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 dark:text-pink-400",
      icon: Instagram,
    },
    {
      href: personalInfo.facebook,
      title: "Facebook",
      className:
        "bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-400",
      icon: Facebook,
    },
    {
      href: personalInfo.telegram,
      title: "Telegram",
      className:
        "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400",
      icon: Send,
    },
    {
      href: personalInfo.whatsapp,
      title: "WhatsApp",
      className:
        "bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400",
      icon: Phone,
    },
  ].filter((link) => link.href);

  return (
    <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 space-y-7">
      <h3 className="text-xl font-semibold">
        {language === "ar" ? "خلّينا على تواصل" : "Stay in touch"}
      </h3>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {t.contact.emailLabel}
          </p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="font-medium hover:text-primary transition-colors break-all"
            data-testid="link-contact-email"
          >
            {personalInfo.email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {t.contact.locationLabel}
          </p>
          <p className="font-medium">
            {language === "ar"
              ? personalInfo.locationAr
              : personalInfo.location}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          {language === "ar" ? "وقت الاستجابة" : "Response Time"}
        </p>
        <p className="font-bold text-xl text-primary">
          {language === "ar" ? "خلال 24 ساعة" : "Within 24 hours"}
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t.contact.socialLinks}
        </p>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map(({ href, title, className, icon: Icon }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${className}`}
              aria-label={title}
              title={title}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      {personalInfo.cvUrl && personalInfo.cvUrl !== "#" && (
        <a
          href={personalInfo.cvUrl}
          download
          className="rounded-xl border border-border p-4 flex items-center justify-center gap-3 hover:border-primary/40 hover:text-primary transition-colors group"
        >
          <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          <span className="font-semibold">{t.contact.downloadCV}</span>
        </a>
      )}
    </div>
  );
}

function ContactForm() {
  const { language } = usePortfolio();
  const t = translations[language];
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema(language)),
    mode: "onBlur",
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const error = await sendContactMessage(values);
      if (error) throw new Error(error);
      toast({
        title: t.contact.success,
        description: t.contact.successDescription,
      });
      form.reset();
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      toast({
        title: t.contact.error,
        description: error instanceof Error ? error.message : t.contact.error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-xl shadow-primary/5 dark:[--input:240_5%_45%] dark:[--destructive:0_85%_72%]">
      <div className="mb-8">
        <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Mail aria-hidden="true" className="size-6" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">
          {language === "ar"
            ? "احكي لي عن فكرتك"
            : "Tell me about your project"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {language === "ar"
            ? "شارك تفاصيل فكرتك أو سؤالك، وخلّينا نبدأ الحديث. جميع الحقول مطلوبة."
            : "Share your idea or question, and let's start a conversation. All fields are required."}
        </p>
      </div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          aria-busy={isSubmitting}
        >
          <fieldset disabled={isSubmitting} className="space-y-6 min-w-0">
            <legend className="sr-only">{t.contact.title}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block leading-normal">
                      {t.contact.name}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        required
                        placeholder={t.contact.namePlaceholder}
                        {...field}
                        className="h-13 rounded-xl bg-background/60 px-4 md:text-base focus-visible:border-primary focus-visible:ring-2 aria-invalid:border-destructive"
                        data-testid="input-contact-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block leading-normal">
                      {t.contact.email}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        required
                        dir="ltr"
                        placeholder={t.contact.emailPlaceholder}
                        type="email"
                        {...field}
                        className="h-13 rounded-xl bg-background/60 px-4 md:text-base focus-visible:border-primary focus-visible:ring-2 aria-invalid:border-destructive"
                        data-testid="input-contact-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block leading-normal">
                    {t.contact.message}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        language === "ar"
                          ? "ما الذي تودّ بناءه؟ أخبرني عن الفكرة وما تحتاجه…"
                          : "What would you like to build? Tell me about your idea and what you need…"
                      }
                      required
                      className="min-h-[180px] resize-y rounded-xl bg-background/60 p-4 leading-relaxed md:text-base focus-visible:border-primary focus-visible:ring-2 aria-invalid:border-destructive"
                      {...field}
                      data-testid="input-contact-message"
                    />
                  </FormControl>
                  <FormDescription>
                    {language === "ar"
                      ? "10 أحرف على الأقل، وأي تفاصيل تساعدني على فهم طلبك."
                      : "At least 10 characters. A little context helps me understand your request."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full h-13 rounded-xl text-base font-semibold group"
              disabled={isSubmitting}
              data-testid="button-contact-submit"
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                  />
                  <span>
                    {language === "ar" ? "جارٍ الإرسال…" : "Sending…"}
                  </span>
                </>
              ) : (
                <>
                  {t.contact.send}
                  <Send
                    aria-hidden="true"
                    className="size-4 motion-safe:group-hover:-translate-y-0.5 transition-transform rtl:-scale-x-100"
                  />
                </>
              )}
            </Button>
          </fieldset>
          <div role="status" aria-live="polite" aria-atomic="true">
            {submitStatus === "success" && (
              <p className="mt-5 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/10 p-4 text-sm text-foreground">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary"
                />
                <span>
                  {t.contact.success} {t.contact.successDescription}
                </span>
              </p>
            )}
            {submitStatus === "error" && (
              <p className="mt-5 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground">
                {language === "ar"
                  ? "تعذّر الإرسال. رسالتك محفوظة هنا؛ حاول مرة أخرى أو تواصل عبر البريد الإلكتروني."
                  : "Could not send. Your message is still here; try again or use the email link."}
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function Contact() {
  const { language } = usePortfolio();
  const t = translations[language];

  return (
    <section id="contact" className="py-28 relative border-t border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-5 sm:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "تواصل معي" : "GET IN TOUCH"}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 items-start gap-6 lg:gap-8">
          <ContactForm />
          <ContactDetails />
        </div>
      </div>
    </section>
  );
}
