import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Download, Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message is too short" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

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

  const { error } = await supabase.from("contact_messages").insert(values);
  return error?.message ?? null;
}

function ContactDetails() {
  const { language, personalInfo } = usePortfolio();
  const t = translations[language];
  const socialLinks = [
    { href: personalInfo.github, title: "GitHub", className: "bg-primary/10 hover:bg-primary/20", icon: Github },
    { href: personalInfo.linkedin, title: "LinkedIn", className: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500", icon: Linkedin },
    { href: personalInfo.instagram, title: "Instagram", className: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500", icon: Instagram },
    { href: personalInfo.facebook, title: "Facebook", className: "bg-blue-600/10 hover:bg-blue-600/20 text-blue-600", icon: Facebook },
    { href: personalInfo.telegram, title: "Telegram", className: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500", icon: Send },
    { href: personalInfo.whatsapp, title: "WhatsApp", className: "bg-green-500/10 hover:bg-green-500/20 text-green-500", icon: Phone },
  ].filter((link) => link.href);

  return (
    <motion.div
      initial={{ opacity: 0, x: language === "ar" ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="lg:col-span-2 space-y-6"
    >
      <div className="glass rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.contact.emailLabel}</p>
          <a href={`mailto:${personalInfo.email}`} className="font-medium hover:text-primary transition-colors break-all" data-testid="link-contact-email">
            {personalInfo.email}
          </a>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t.contact.locationLabel}</p>
          <p className="font-medium">{language === "ar" ? personalInfo.locationAr : personalInfo.location}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{language === "ar" ? "وقت الاستجابة" : "Response Time"}</p>
        <p className="font-bold text-xl text-primary">{language === "ar" ? "خلال 24 ساعة" : "Within 24 hours"}</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{t.contact.socialLinks}</p>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map(({ href, title, className, icon: Icon }) => (
            <motion.a
              key={title}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${className}`}
              title={title}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </div>

      {personalInfo.cvUrl && personalInfo.cvUrl !== "#" && (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={personalInfo.cvUrl}
          download
          className="glass rounded-2xl p-6 flex items-center justify-center gap-3 hover:border-primary/40 transition-all cursor-pointer group"
        >
          <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          <span className="font-semibold">{t.contact.downloadCV}</span>
        </motion.a>
      )}
    </motion.div>
  );
}

function ContactForm() {
  const { language } = usePortfolio();
  const t = translations[language];
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    const error = await sendContactMessage(values);
    setIsSubmitting(false);

    if (error) {
      toast({ title: t.contact.error, description: error });
      return;
    }
    toast({ title: t.contact.success, description: t.contact.successDescription });
    form.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: language === "ar" ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="lg:col-span-3 glass p-8 rounded-3xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.contact.name}</FormLabel>
                <FormControl>
                  <Input placeholder={t.contact.namePlaceholder} {...field} className="bg-background/50 h-12" data-testid="input-contact-name" />
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
                <FormLabel>{t.contact.email}</FormLabel>
                <FormControl>
                  <Input placeholder={t.contact.emailPlaceholder} type="email" {...field} className="bg-background/50 h-12" data-testid="input-contact-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.contact.message}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t.contact.messagePlaceholder}
                    className="min-h-[140px] resize-none bg-background/50"
                    {...field}
                    data-testid="input-contact-message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full h-12 rounded-xl font-semibold group" disabled={isSubmitting} data-testid="button-contact-submit">
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t.contact.send}
                <Send className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === "ar" ? "mr-2 rotate-180" : "ml-2"}`} />
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

export default function Contact() {
  const { language } = usePortfolio();
  const t = translations[language];

  return (
    <section id="contact" className="py-28 relative border-t border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "تواصل معي" : "GET IN TOUCH"}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{t.contact.title}</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <ContactDetails />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
