import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/utils/supabase";

export type Project = {
  id: string;
  sortOrder?: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: "Web" | "Mobile" | "Design";
  tags: string[];
  imageUrl: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  roleAr: string;
  period: string;
  description: string;
  descriptionAr: string;
};

export type Education = {
  id: string;
  institution: string;
  institutionAr: string;
  degree: string;
  degreeAr: string;
  field: string;
  fieldAr: string;
  period: string;
  gpa?: string;
  description: string;
  descriptionAr: string;
};

export type Certificate = {
  id: string;
  sortOrder?: number;
  title: string;
  titleAr: string;
  issuer: string;
  issuerAr: string;
  date: string;
  credentialUrl?: string;
  badgeColor: string;
};

export type Testimonial = {
  id: string;
  sortOrder?: number;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  text: string;
  textAr: string;
  rating: number;
  imageUrl: string;
};

export type PersonalInfo = {
  name: string;
  nameAr: string;
  bio: string;
  bioAr: string;
  email: string;
  location: string;
  locationAr: string;
  github: string;
  linkedin: string;
  twitter: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  cvUrl: string;
  avatarUrl: string;
  floatingSkills: string[];
};

type PortfolioContextType = {
  isLoading: boolean;
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => Promise<void>;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (p: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  experience: Experience[];
  setExperience: (exp: Experience[]) => void;
  addExperience: (e: Omit<Experience, "id">) => Promise<void>;
  updateExperience: (id: string, e: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  education: Education[];
  setEducation: (edu: Education[]) => void;
  addEducation: (e: Omit<Education, "id">) => Promise<void>;
  updateEducation: (id: string, e: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  certificates: Certificate[];
  setCertificates: (certs: Certificate[]) => void;
  addCertificate: (c: Omit<Certificate, "id">) => Promise<void>;
  updateCertificate: (id: string, c: Partial<Certificate>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  testimonials: Testimonial[];
  setTestimonials: (test: Testimonial[]) => void;
  addTestimonial: (t: Omit<Testimonial, "id">) => Promise<void>;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
};

const defaultPersonalInfo: PersonalInfo = {
  name: "Ahmad Alhariri",
  nameAr: "أحمد الحريري",
  bio: "Motivated Software Engineer with over four years of experience in mobile application development using Flutter. Skilled in designing, building, and optimizing cross-platform applications.",
  bioAr: "مهندس برمجيات طموح لديه أكثر من أربع سنوات من الخبرة في تطوير تطبيقات الموبايل باستخدام Flutter. ماهر في تصميم وبناء وتحسين التطبيقات.",
  email: "mr.ahmed.alhariri@gmail.com",
  location: "Syria - Daraa",
  locationAr: "سوريا - درعا",
  github: "https://github.com/0Ahmad0",
  linkedin: "https://www.linkedin.com/in/ahmadhariri",
  twitter: "https://x.com/AhmadAl45892861",
  telegram: "https://t.me/Ahmad_Alhariri",
  whatsapp: "https://wa.me/+963954872922",
  instagram: "https://www.instagram.com/dev.ahm",
  facebook: "https://www.facebook.com/ahmad.alhariri.56027",
  cvUrl: "#",
  avatarUrl: "/avatar.jpg",
  floatingSkills: ["Flutter", "Dart", "C++", "Firebase", "Git"],
};

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Tigre",
    titleAr: "تيغري",
    description: "Ultimate destination for food enthusiasts and restaurant discovery.",
    descriptionAr: "الوجهة النهائية لعشاق الطعام واكتشاف المطاعم.",
    category: "Mobile",
    tags: ["Flutter", "Dart", "Firebase"],
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "Vivafone",
    titleAr: "فيفافون",
    description: "An app for selling eSIM cards with a seamless user experience.",
    descriptionAr: "تطبيق لبيع بطاقات eSIM مع تجربة مستخدم سلسة.",
    category: "Mobile",
    tags: ["Flutter", "Dart", "REST API"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "Enjaz",
    titleAr: "إنجاز",
    description: "Tracking and managing university projects with supervisor support.",
    descriptionAr: "تتبع وإدارة المشاريع الجامعية مع دعم المشرفين.",
    category: "Mobile",
    tags: ["Flutter", "Dart", "Firebase"],
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    title: "Mardod App",
    titleAr: "تطبيق مردود",
    description: "AI-powered app exploring Saudi Arabia through chat.",
    descriptionAr: "تطبيق مدعوم بالذكاء الاصطناعي لاستكشاف السعودية عبر الدردشة.",
    category: "Mobile",
    tags: ["Flutter", "Dart", "AI"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60",
  },
];

const defaultExperience: Experience[] = [
  {
    id: "1",
    company: "York British Academy",
    role: "Mobile Developer",
    roleAr: "مطور موبايل",
    period: "2023 - Present",
    description: "Developed government-level mobile applications using Flutter.",
    descriptionAr: "تطوير تطبيقات موبايل على مستوى حكومي باستخدام Flutter.",
  },
  {
    id: "2",
    company: "Future X",
    role: "Mobile Developer",
    roleAr: "مطور موبايل",
    period: "2023 - Present",
    description: "Built food delivery and social media management applications.",
    descriptionAr: "بناء تطبيقات توصيل طعام وإدارة وسائل التواصل الاجتماعي.",
  },
  {
    id: "3",
    company: "Smart Life",
    role: "Mobile Developer",
    roleAr: "مطور موبايل",
    period: "2023",
    description: "Restructured and optimized CRM applications.",
    descriptionAr: "إعادة هيكلة وتحسين تطبيقات إدارة علاقات العملاء (CRM).",
  },
];

const defaultEducation: Education[] = [
  {
    id: "1",
    institution: "Damascus University",
    institutionAr: "جامعة دمشق",
    degree: "Bachelor's of Software Engineering",
    degreeAr: "بكالوريوس في هندسة البرمجيات",
    field: "Software Engineering",
    fieldAr: "هندسة البرمجيات",
    period: "2018 - 2023",
    gpa: "Good",
    description: "Studied software engineering fundamentals, system analysis, algorithms, and mobile application development.",
    descriptionAr: "دراسة أساسيات هندسة البرمجيات وتحليل الأنظمة والخوارزميات وتطوير تطبيقات الموبايل.",
  },
];

const defaultCertificates: Certificate[] = [
  { id: "1", title: "Agile Project Management", titleAr: "إدارة المشاريع Agile", issuer: "HP LIFE", issuerAr: "HP LIFE", date: "2023", credentialUrl: "#", badgeColor: "#0096D6" },
  { id: "2", title: "Fundamentals of Technical Project Management", titleAr: "أساسيات إدارة المشاريع التقنية", issuer: "PMI", issuerAr: "PMI", date: "2023", credentialUrl: "#", badgeColor: "#E4002B" },
  { id: "3", title: "Volunteer Certificate", titleAr: "شهادة تطوع", issuer: "RBCs Team", issuerAr: "فريق RBCs", date: "2023", credentialUrl: "#", badgeColor: "#00897B" },
];

const defaultTestimonials: Testimonial[] = [];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<"en" | "ar">(() => {
    try { return (localStorage.getItem("portfolio_lang") as "en" | "ar") || "en"; } catch { return "en"; }
  });
  const [personalInfoId, setPersonalInfoId] = useState<string | null>(null);
  const [personalInfo, setPersonalInfoState] = useState<PersonalInfo>(defaultPersonalInfo);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [experience, setExperience] = useState<Experience[]>(defaultExperience);
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [certificates, setCertificates] = useState<Certificate[]>(defaultCertificates);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    localStorage.setItem("portfolio_lang", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    let isMounted = true;
    async function loadPortfolio() {
      setIsLoading(true);
      try {
        if (!supabase) {
          console.warn("Supabase not configured, using default data");
          return;
        }

        const timeout = (ms: number) => new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
        );

        const queries = [
            supabase.from("portfolio_personal_info").select("*").eq("is_primary", true).limit(1),
            supabase.from("portfolio_projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
            supabase.from("portfolio_experience").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
            supabase.from("portfolio_education").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
            supabase.from("portfolio_certificates").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
            supabase.from("portfolio_testimonials").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
        ] as const;

        const [
          personalRes,
          projectsRes,
          expRes,
          eduRes,
          certRes,
          testRes,
        ] = await Promise.race([
          Promise.all(queries),
          timeout(8000),
        ]);

        if (!isMounted) return;

        const hasAuthError = [personalRes, projectsRes, expRes, eduRes, certRes, testRes]
          .some((r) => {
            const code = r.error?.code;
            return code === "PGRST301" || code === "42501" || (r as any).status === 401 || (r as any).status === 403;
          });
        if (hasAuthError) {
          console.warn("Supabase auth error - check your API key. Falling back to default data.");
          return;
        }

        if (personalRes.error) console.error("Failed to load personal info", personalRes.error);
        if (projectsRes.error) console.error("Failed to load projects", projectsRes.error);
        if (expRes.error) console.error("Failed to load experience", expRes.error);
        if (eduRes.error) console.error("Failed to load education", eduRes.error);
        if (certRes.error) console.error("Failed to load certificates", certRes.error);
        if (testRes.error) console.error("Failed to load testimonials", testRes.error);

      const infoRow = personalRes.data?.[0];
      if (infoRow) {
        setPersonalInfoId(infoRow.id);
        setPersonalInfoState({
          name: infoRow.name ?? "",
          nameAr: infoRow.name_ar ?? "",
          bio: infoRow.bio ?? "",
          bioAr: infoRow.bio_ar ?? "",
          email: infoRow.email ?? "",
          location: infoRow.location ?? "",
          locationAr: infoRow.location_ar ?? "",
          github: infoRow.github ?? "",
          linkedin: infoRow.linkedin ?? "",
          twitter: infoRow.twitter ?? "",
          telegram: infoRow.telegram ?? "",
          whatsapp: infoRow.whatsapp ?? "",
          instagram: infoRow.instagram ?? "",
          facebook: infoRow.facebook ?? "",
          cvUrl: infoRow.cv_url ?? "",
          avatarUrl: infoRow.avatar_url ?? "",
          floatingSkills: infoRow.floating_skills ?? [],
        });
      }

      if (projectsRes.data) {
        setProjects(projectsRes.data.map((row) => ({
          id: row.id,
          sortOrder: row.sort_order ?? 0,
          title: row.title ?? "",
          titleAr: row.title_ar ?? "",
          description: row.description ?? "",
          descriptionAr: row.description_ar ?? "",
          category: row.category ?? "Web",
          tags: row.tags ?? [],
          imageUrl: row.image_url ?? "",
          images: row.images ?? [],
          githubUrl: row.github_url ?? "",
          liveUrl: row.live_url ?? "",
        })));
      }

      if (expRes.data) {
        setExperience(expRes.data.map((row) => ({
          id: row.id,
          company: row.company ?? "",
          role: row.role ?? "",
          roleAr: row.role_ar ?? "",
          period: row.period ?? "",
          description: row.description ?? "",
          descriptionAr: row.description_ar ?? "",
        })));
      }

      if (eduRes.data) {
        setEducation(eduRes.data.map((row) => ({
          id: row.id,
          institution: row.institution ?? "",
          institutionAr: row.institution_ar ?? "",
          degree: row.degree ?? "",
          degreeAr: row.degree_ar ?? "",
          field: row.field ?? "",
          fieldAr: row.field_ar ?? "",
          period: row.period ?? "",
          gpa: row.gpa ?? "",
          description: row.description ?? "",
          descriptionAr: row.description_ar ?? "",
        })));
      }

      if (certRes.data) {
        setCertificates(certRes.data.map((row) => ({
          id: row.id,
          sortOrder: row.sort_order ?? 0,
          title: row.title ?? "",
          titleAr: row.title_ar ?? "",
          issuer: row.issuer ?? "",
          issuerAr: row.issuer_ar ?? "",
          date: row.date ?? "",
          credentialUrl: row.credential_url ?? "",
          badgeColor: row.badge_color ?? "#6C63FF",
        })));
      }

      if (testRes.data) {
        setTestimonials(testRes.data.map((row) => ({
          id: row.id,
          sortOrder: row.sort_order ?? 0,
          name: row.name ?? "",
          nameAr: row.name_ar ?? "",
          role: row.role ?? "",
          roleAr: row.role_ar ?? "",
          text: row.text ?? "",
          textAr: row.text_ar ?? "",
          rating: row.rating ?? 5,
          imageUrl: row.image_url ?? "",
        })));
      }
      } catch (err) {
        console.error("Failed to load portfolio data", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPortfolio();
    return () => { isMounted = false; };
  }, []);

  const setLanguage = (lang: "en" | "ar") => setLanguageState(lang);

  const setPersonalInfo = async (info: PersonalInfo) => {
    if (!supabase) throw new Error("Supabase not configured");
    if (personalInfoId) {
      const { data, error } = await supabase
        .from("portfolio_personal_info")
        .update({
          name: info.name,
          name_ar: info.nameAr,
          bio: info.bio,
          bio_ar: info.bioAr,
          email: info.email,
          location: info.location,
          location_ar: info.locationAr,
          github: info.github,
          linkedin: info.linkedin,
          twitter: info.twitter,
          telegram: info.telegram,
          whatsapp: info.whatsapp,
          instagram: info.instagram,
          facebook: info.facebook,
          cv_url: info.cvUrl,
          avatar_url: info.avatarUrl,
          floating_skills: info.floatingSkills,
        })
        .eq("id", personalInfoId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setPersonalInfoState({
        name: data.name ?? "",
        nameAr: data.name_ar ?? "",
        bio: data.bio ?? "",
        bioAr: data.bio_ar ?? "",
        email: data.email ?? "",
        location: data.location ?? "",
        locationAr: data.location_ar ?? "",
        github: data.github ?? "",
        linkedin: data.linkedin ?? "",
        twitter: data.twitter ?? "",
        telegram: data.telegram ?? "",
        whatsapp: data.whatsapp ?? "",
        instagram: data.instagram ?? "",
        facebook: data.facebook ?? "",
        cvUrl: data.cv_url ?? "",
        avatarUrl: data.avatar_url ?? "",
        floatingSkills: data.floating_skills ?? [],
      });
      return;
    }

    const { data, error } = await supabase
      .from("portfolio_personal_info")
      .insert({
        is_primary: true,
        name: info.name,
        name_ar: info.nameAr,
        bio: info.bio,
        bio_ar: info.bioAr,
        email: info.email,
        location: info.location,
        location_ar: info.locationAr,
        github: info.github,
        linkedin: info.linkedin,
        twitter: info.twitter,
        telegram: info.telegram,
        whatsapp: info.whatsapp,
        instagram: info.instagram,
        facebook: info.facebook,
        cv_url: info.cvUrl,
        avatar_url: info.avatarUrl,
        floating_skills: info.floatingSkills,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    setPersonalInfoId(data.id);
    setPersonalInfoState({
      name: data.name ?? "",
      nameAr: data.name_ar ?? "",
      bio: data.bio ?? "",
      bioAr: data.bio_ar ?? "",
      email: data.email ?? "",
      location: data.location ?? "",
      locationAr: data.location_ar ?? "",
      github: data.github ?? "",
      linkedin: data.linkedin ?? "",
      twitter: data.twitter ?? "",
      telegram: data.telegram ?? "",
      whatsapp: data.whatsapp ?? "",
      instagram: data.instagram ?? "",
      facebook: data.facebook ?? "",
      cvUrl: data.cv_url ?? "",
      avatarUrl: data.avatar_url ?? "",
      floatingSkills: data.floating_skills ?? [],
    });
  };

const addProject = async (p: Omit<Project, "id">) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert({
        title: p.title,
        title_ar: p.titleAr,
        description: p.description,
        description_ar: p.descriptionAr,
        category: p.category,
        tags: p.tags,
        image_url: p.imageUrl,
        images: p.images ?? [],
        live_url: p.liveUrl,
        github_url: p.githubUrl,
        sort_order: projects.length,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setProjects((prev) => [...prev, {
      id: data.id,
      sortOrder: data.sort_order ?? 0,
      title: data.title ?? "",
      titleAr: data.title_ar ?? "",
      description: data.description ?? "",
      descriptionAr: data.description_ar ?? "",
      category: data.category ?? "Web",
      tags: data.tags ?? [],
      imageUrl: data.image_url ?? "",
      images: data.images ?? [],
      githubUrl: data.github_url ?? "",
      liveUrl: data.live_url ?? "",
    }]);
  };

  const updateProject = async (id: string, p: Partial<Project>) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_projects")
      .update({
        title: p.title,
        title_ar: p.titleAr,
        description: p.description,
        description_ar: p.descriptionAr,
        category: p.category,
        tags: p.tags,
        image_url: p.imageUrl,
        images: p.images,
        live_url: p.liveUrl,
        github_url: p.githubUrl,
        sort_order: p.sortOrder,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setProjects((prev) => prev.map((item) => item.id === id ? {
      id: data.id,
      sortOrder: data.sort_order ?? 0,
      title: data.title ?? "",
      titleAr: data.title_ar ?? "",
      description: data.description ?? "",
      descriptionAr: data.description_ar ?? "",
      category: data.category ?? "Web",
      tags: data.tags ?? [],
      imageUrl: data.image_url ?? "",
      images: data.images ?? [],
      githubUrl: data.github_url ?? "",
      liveUrl: data.live_url ?? "",
    } : item));
  };

  const deleteProject = async (id: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addExperience = async (e: Omit<Experience, "id">) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_experience")
      .insert({
        company: e.company,
        role: e.role,
        role_ar: e.roleAr,
        period: e.period,
        description: e.description,
        description_ar: e.descriptionAr,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setExperience((prev) => [...prev, {
      id: data.id,
      company: data.company ?? "",
      role: data.role ?? "",
      roleAr: data.role_ar ?? "",
      period: data.period ?? "",
      description: data.description ?? "",
      descriptionAr: data.description_ar ?? "",
    }]);
  };

  const updateExperience = async (id: string, e: Partial<Experience>) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_experience")
      .update({
        company: e.company,
        role: e.role,
        role_ar: e.roleAr,
        period: e.period,
        description: e.description,
        description_ar: e.descriptionAr,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setExperience((prev) => prev.map((item) => item.id === id ? {
      id: data.id,
      company: data.company ?? "",
      role: data.role ?? "",
      roleAr: data.role_ar ?? "",
      period: data.period ?? "",
      description: data.description ?? "",
      descriptionAr: data.description_ar ?? "",
    } : item));
  };

  const deleteExperience = async (id: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("portfolio_experience").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setExperience((prev) => prev.filter((e) => e.id !== id));
  };

  const addEducation = async (e: Omit<Education, "id">) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_education")
      .insert({
        institution: e.institution,
        institution_ar: e.institutionAr,
        degree: e.degree,
        degree_ar: e.degreeAr,
        field: e.field,
        field_ar: e.fieldAr,
        period: e.period,
        gpa: e.gpa,
        description: e.description,
        description_ar: e.descriptionAr,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setEducation((prev) => [...prev, {
      id: data.id,
      institution: data.institution ?? "",
      institutionAr: data.institution_ar ?? "",
      degree: data.degree ?? "",
      degreeAr: data.degree_ar ?? "",
      field: data.field ?? "",
      fieldAr: data.field_ar ?? "",
      period: data.period ?? "",
      gpa: data.gpa ?? "",
      description: data.description ?? "",
      descriptionAr: data.description_ar ?? "",
    }]);
  };

  const updateEducation = async (id: string, e: Partial<Education>) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_education")
      .update({
        institution: e.institution,
        institution_ar: e.institutionAr,
        degree: e.degree,
        degree_ar: e.degreeAr,
        field: e.field,
        field_ar: e.fieldAr,
        period: e.period,
        gpa: e.gpa,
        description: e.description,
        description_ar: e.descriptionAr,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setEducation((prev) => prev.map((item) => item.id === id ? {
      id: data.id,
      institution: data.institution ?? "",
      institutionAr: data.institution_ar ?? "",
      degree: data.degree ?? "",
      degreeAr: data.degree_ar ?? "",
      field: data.field ?? "",
      fieldAr: data.field_ar ?? "",
      period: data.period ?? "",
      gpa: data.gpa ?? "",
      description: data.description ?? "",
      descriptionAr: data.description_ar ?? "",
    } : item));
  };

  const deleteEducation = async (id: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("portfolio_education").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  const addCertificate = async (c: Omit<Certificate, "id">) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_certificates")
      .insert({
        title: c.title,
        title_ar: c.titleAr,
        issuer: c.issuer,
        issuer_ar: c.issuerAr,
        date: c.date,
        credential_url: c.credentialUrl,
        badge_color: c.badgeColor,
        sort_order: certificates.length,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setCertificates((prev) => [...prev, {
      id: data.id,
      sortOrder: data.sort_order ?? 0,
      title: data.title ?? "",
      titleAr: data.title_ar ?? "",
      issuer: data.issuer ?? "",
      issuerAr: data.issuer_ar ?? "",
      date: data.date ?? "",
      credentialUrl: data.credential_url ?? "",
      badgeColor: data.badge_color ?? "#6C63FF",
    }]);
  };

  const updateCertificate = async (id: string, c: Partial<Certificate>) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_certificates")
      .update({
        title: c.title,
        title_ar: c.titleAr,
        issuer: c.issuer,
        issuer_ar: c.issuerAr,
        date: c.date,
        credential_url: c.credentialUrl,
        badge_color: c.badgeColor,
        sort_order: c.sortOrder,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setCertificates((prev) => prev.map((item) => item.id === id ? {
      id: data.id,
      sortOrder: data.sort_order ?? 0,
      title: data.title ?? "",
      titleAr: data.title_ar ?? "",
      issuer: data.issuer ?? "",
      issuerAr: data.issuer_ar ?? "",
      date: data.date ?? "",
      credentialUrl: data.credential_url ?? "",
      badgeColor: data.badge_color ?? "#6C63FF",
    } : item));
  };

  const deleteCertificate = async (id: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("portfolio_certificates").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_testimonials")
      .insert({
        name: t.name,
        name_ar: t.nameAr,
        role: t.role,
        role_ar: t.roleAr,
        text: t.text,
        text_ar: t.textAr,
        rating: t.rating,
        image_url: t.imageUrl,
        sort_order: testimonials.length,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setTestimonials((prev) => [...prev, {
      id: data.id,
      sortOrder: data.sort_order ?? 0,
      name: data.name ?? "",
      nameAr: data.name_ar ?? "",
      role: data.role ?? "",
      roleAr: data.role_ar ?? "",
      text: data.text ?? "",
      textAr: data.text_ar ?? "",
      rating: data.rating ?? 5,
      imageUrl: data.image_url ?? "",
    }]);
  };

  const updateTestimonial = async (id: string, t: Partial<Testimonial>) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("portfolio_testimonials")
      .update({
        name: t.name,
        name_ar: t.nameAr,
        role: t.role,
        role_ar: t.roleAr,
        text: t.text,
        text_ar: t.textAr,
        rating: t.rating,
        image_url: t.imageUrl,
        sort_order: t.sortOrder,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setTestimonials((prev) => prev.map((item) => item.id === id ? {
      id: data.id,
      sortOrder: data.sort_order ?? 0,
      name: data.name ?? "",
      nameAr: data.name_ar ?? "",
      role: data.role ?? "",
      roleAr: data.role_ar ?? "",
      text: data.text ?? "",
      textAr: data.text_ar ?? "",
      rating: data.rating ?? 5,
      imageUrl: data.image_url ?? "",
    } : item));
  };

  const deleteTestimonial = async (id: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("portfolio_testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <PortfolioContext.Provider value={{
      isLoading,
      language, setLanguage,
      personalInfo, setPersonalInfo,
      projects, setProjects, addProject, updateProject, deleteProject,
      experience, setExperience, addExperience, updateExperience, deleteExperience,
      education, setEducation, addEducation, updateEducation, deleteEducation,
      certificates, setCertificates, addCertificate, updateCertificate, deleteCertificate,
      testimonials, setTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
}
