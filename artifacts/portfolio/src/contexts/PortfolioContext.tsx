import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Project = {
  id: string;
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
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (p: Project) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  experience: Experience[];
  setExperience: (exp: Experience[]) => void;
  addExperience: (e: Experience) => void;
  updateExperience: (id: string, e: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  education: Education[];
  setEducation: (edu: Education[]) => void;
  addEducation: (e: Education) => void;
  updateEducation: (id: string, e: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  certificates: Certificate[];
  setCertificates: (certs: Certificate[]) => void;
  addCertificate: (c: Certificate) => void;
  updateCertificate: (id: string, c: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  testimonials: Testimonial[];
  setTestimonials: (test: Testimonial[]) => void;
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
};

const defaultPersonalInfo: PersonalInfo = {
  name: "Ahmad Alhariri",
  nameAr: "أحمد الحريري",
  bio: "Motivated Software Engineer with over four years of experience in mobile application development using Flutter. Skilled in designing, building, and optimizing cross-platform applications.",
  bioAr: "مهندس برمجيات طموح لديه أكثر من أربع سنوات من الخبرة في تطوير تطبيقات الموبايل باستخدام Flutter. ماهر في تصميم وبناء وتحسين التطبيقات.",
  email: "mr.ahmed.alhariri@gmail.com",
  location: "Syria - Daraa",
  locationAr: "سوريا - درعا",
  github: "",
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

const STORAGE_VERSION = "v3";

function clearStaleStorage() {
  try {
    if (localStorage.getItem("portfolio_version") !== STORAGE_VERSION) {
      ["portfolio_info", "portfolio_projects", "portfolio_experience",
       "portfolio_education", "portfolio_certs", "portfolio_testimonials"].forEach(k => localStorage.removeItem(k));
      localStorage.setItem("portfolio_version", STORAGE_VERSION);
    }
  } catch { /* ignore */ }
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  clearStaleStorage();

  const [language, setLanguageState] = useState<"en" | "ar">(() => {
    try { return (localStorage.getItem("portfolio_lang") as "en" | "ar") || "en"; } catch { return "en"; }
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    try { const s = localStorage.getItem("portfolio_info"); return s ? JSON.parse(s) : defaultPersonalInfo; } catch { return defaultPersonalInfo; }
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    try { const s = localStorage.getItem("portfolio_projects"); return s ? JSON.parse(s) : defaultProjects; } catch { return defaultProjects; }
  });
  const [experience, setExperience] = useState<Experience[]>(() => {
    try { const s = localStorage.getItem("portfolio_experience"); return s ? JSON.parse(s) : defaultExperience; } catch { return defaultExperience; }
  });
  const [education, setEducation] = useState<Education[]>(() => {
    try { const s = localStorage.getItem("portfolio_education"); return s ? JSON.parse(s) : defaultEducation; } catch { return defaultEducation; }
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try { const s = localStorage.getItem("portfolio_certs"); return s ? JSON.parse(s) : defaultCertificates; } catch { return defaultCertificates; }
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try { const s = localStorage.getItem("portfolio_testimonials"); return s ? JSON.parse(s) : defaultTestimonials; } catch { return defaultTestimonials; }
  });

  useEffect(() => {
    localStorage.setItem("portfolio_lang", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => { localStorage.setItem("portfolio_info", JSON.stringify(personalInfo)); }, [personalInfo]);
  useEffect(() => { localStorage.setItem("portfolio_projects", JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem("portfolio_experience", JSON.stringify(experience)); }, [experience]);
  useEffect(() => { localStorage.setItem("portfolio_education", JSON.stringify(education)); }, [education]);
  useEffect(() => { localStorage.setItem("portfolio_certs", JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem("portfolio_testimonials", JSON.stringify(testimonials)); }, [testimonials]);

  const setLanguage = (lang: "en" | "ar") => setLanguageState(lang);
  const addProject = (p: Project) => setProjects(prev => [...prev, p]);
  const updateProject = (id: string, p: Partial<Project>) => setProjects(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));
  const addExperience = (e: Experience) => setExperience(prev => [...prev, e]);
  const updateExperience = (id: string, e: Partial<Experience>) => setExperience(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  const deleteExperience = (id: string) => setExperience(prev => prev.filter(e => e.id !== id));
  const addEducation = (e: Education) => setEducation(prev => [...prev, e]);
  const updateEducation = (id: string, e: Partial<Education>) => setEducation(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  const deleteEducation = (id: string) => setEducation(prev => prev.filter(e => e.id !== id));
  const addCertificate = (c: Certificate) => setCertificates(prev => [...prev, c]);
  const updateCertificate = (id: string, c: Partial<Certificate>) => setCertificates(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  const deleteCertificate = (id: string) => setCertificates(prev => prev.filter(c => c.id !== id));
  const addTestimonial = (t: Testimonial) => setTestimonials(prev => [...prev, t]);
  const updateTestimonial = (id: string, t: Partial<Testimonial>) => setTestimonials(prev => prev.map(x => x.id === id ? { ...x, ...t } : x));
  const deleteTestimonial = (id: string) => setTestimonials(prev => prev.filter(t => t.id !== id));

  return (
    <PortfolioContext.Provider value={{
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
