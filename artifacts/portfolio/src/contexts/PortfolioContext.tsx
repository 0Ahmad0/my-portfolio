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
  name: "Ahmad-Alhariri",
  nameAr: "أحمد الحريري",
  bio: "Creative full-stack developer crafting cinematic digital experiences with 5+ years of building products that people love.",
  bioAr: "مطور مبدع متكامل يصنع تجارب رقمية سينمائية بخبرة تزيد على 5 سنوات في بناء منتجات يحبها الناس.",
  email: "hello@alex.dev",
  location: "San Francisco, CA",
  locationAr: "سان فرانسيسكو، كاليفورنيا",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  telegram: "https://t.me",
  whatsapp: "https://wa.me",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  cvUrl: "#",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
  floatingSkills: ["React", "Flutter", "TypeScript", "Node.js", "Figma", "Next.js"]
};

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Cinematic E-Commerce",
    titleAr: "متجر إلكتروني سينمائي",
    description: "A high-end fashion e-commerce platform with WebGL product showcases and immersive 3D product previews that increased conversion by 40%.",
    descriptionAr: "منصة تجارة إلكترونية للأزياء الراقية مع عروض منتجات بتقنية WebGL ومعاينات ثلاثية الأبعاد أدت إلى زيادة التحويل بنسبة 40٪.",
    category: "Web",
    tags: ["React", "Three.js", "Tailwind", "Stripe"],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=60",
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "2",
    title: "Fintech Dashboard",
    titleAr: "لوحة تحكم مالية",
    description: "Data-dense analytics platform for modern trading firms with real-time charts, portfolio tracking, and AI-powered insights.",
    descriptionAr: "منصة تحليلات كثيفة البيانات لشركات التداول الحديثة مع رسوم بيانية فورية وتتبع المحافظ ورؤى مدعومة بالذكاء الاصطناعي.",
    category: "Web",
    tags: ["Next.js", "D3.js", "TypeScript", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800&auto=format&fit=crop&q=60",
    ],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: "3",
    title: "Nomad Travel App",
    titleAr: "تطبيق السفر البدوي",
    description: "Mobile companion for digital nomads featuring offline maps, localized tips, visa tracking, and a community of 50k+ travelers.",
    descriptionAr: "رفيق محمول للرحّل الرقميين يتميز بخرائط غير متصلة ونصائح محلية وتتبع التأشيرات ومجتمع يضم أكثر من 50 ألف مسافر.",
    category: "Mobile",
    tags: ["Flutter", "Dart", "Firebase", "Mapbox"],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60",
    ],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: "4",
    title: "Brand Identity System",
    titleAr: "نظام هوية العلامة التجارية",
    description: "Complete visual language for a sustainable energy startup — logo, typography, color system, and motion guidelines.",
    descriptionAr: "لغة بصرية كاملة لشركة طاقة مستدامة ناشئة — شعار وطباعة ونظام ألوان وإرشادات حركة.",
    category: "Design",
    tags: ["Figma", "Illustrator", "After Effects"],
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60",
    ],
    liveUrl: "#"
  },
  {
    id: "5",
    title: "AI Writing Assistant",
    titleAr: "مساعد الكتابة بالذكاء الاصطناعي",
    description: "SaaS platform that helps writers overcome blocks with AI suggestions, tone adjustments, and collaborative editing rooms.",
    descriptionAr: "منصة SaaS تساعد الكتّاب على التغلب على الأزمات الإبداعية باقتراحات الذكاء الاصطناعي وضبط النبرة وغرف التحرير التعاوني.",
    category: "Web",
    tags: ["React", "OpenAI", "Node.js", "Socket.io"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60",
    images: [
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&auto=format&fit=crop&q=60",
    ],
    liveUrl: "#",
    githubUrl: "#"
  }
];

const defaultExperience: Experience[] = [
  {
    id: "1",
    company: "Acme Corp",
    role: "Lead Frontend Engineer",
    roleAr: "كبير مهندسي الواجهة الأمامية",
    period: "2022 – Present",
    description: "Architected the core design system used by 30+ products. Led a team of 6 developers and drove a 60% improvement in page performance scores.",
    descriptionAr: "صمم نظام التصميم الأساسي المستخدم في أكثر من 30 منتجاً. قاد فريقاً من 6 مطورين وحقق تحسناً بنسبة 60٪ في أداء الصفحات."
  },
  {
    id: "2",
    company: "Startup Inc.",
    role: "UI/UX Designer & Developer",
    roleAr: "مصمم ومطور واجهة المستخدم",
    period: "2020 – 2022",
    description: "Designed and built the entire MVP from scratch. The product raised $2M in seed funding and reached 10k users within 3 months of launch.",
    descriptionAr: "صمم وبنى المنتج الأولي بالكامل من الصفر. جمع المنتج 2 مليون دولار كتمويل تأسيسي وبلغ 10 آلاف مستخدم خلال 3 أشهر من الإطلاق."
  },
  {
    id: "3",
    company: "Freelance",
    role: "Full Stack Developer",
    roleAr: "مطور متكامل مستقل",
    period: "2018 – 2020",
    description: "Built 20+ client websites and web applications spanning e-commerce, SaaS, and media. Maintained long-term relationships with 8 recurring clients.",
    descriptionAr: "بنى أكثر من 20 موقعاً وتطبيقاً لعملاء في مجالات التجارة الإلكترونية وSaaS والإعلام."
  }
];

const defaultEducation: Education[] = [
  {
    id: "1",
    institution: "Stanford University",
    institutionAr: "جامعة ستانفورد",
    degree: "Bachelor of Science",
    degreeAr: "بكالوريوس العلوم",
    field: "Computer Science",
    fieldAr: "علوم الحاسب",
    period: "2014 – 2018",
    gpa: "3.8",
    description: "Focused on Human-Computer Interaction and Computer Graphics. Senior thesis on procedural animation systems.",
    descriptionAr: "تخصص في تفاعل الإنسان والحاسوب والرسومات الحاسوبية."
  },
  {
    id: "2",
    institution: "Interaction Design Foundation",
    institutionAr: "مؤسسة تصميم التفاعل",
    degree: "Professional Certificate",
    degreeAr: "شهادة مهنية",
    field: "UX Design",
    fieldAr: "تصميم تجربة المستخدم",
    period: "2019",
    description: "Advanced UX research methods, usability testing, and design thinking applied to complex digital products.",
    descriptionAr: "مناهج بحث UX المتقدمة واختبار قابلية الاستخدام والتفكير التصميمي."
  }
];

const defaultCertificates: Certificate[] = [
  { id: "1", title: "AWS Solutions Architect", titleAr: "مهندس حلول AWS", issuer: "Amazon Web Services", issuerAr: "أمازون ويب سيرفيسز", date: "2023", credentialUrl: "#", badgeColor: "#FF9900" },
  { id: "2", title: "Meta React Developer", titleAr: "مطور React من Meta", issuer: "Meta", issuerAr: "ميتا", date: "2022", credentialUrl: "#", badgeColor: "#0866FF" },
  { id: "3", title: "Google UX Design", titleAr: "تصميم UX من Google", issuer: "Google", issuerAr: "جوجل", date: "2021", credentialUrl: "#", badgeColor: "#4285F4" },
  { id: "4", title: "MongoDB Developer", titleAr: "مطور MongoDB", issuer: "MongoDB University", issuerAr: "جامعة MongoDB", date: "2021", credentialUrl: "#", badgeColor: "#00ED64" },
  { id: "5", title: "Figma Advanced Design", titleAr: "التصميم المتقدم في Figma", issuer: "Figma", issuerAr: "فيغما", date: "2022", credentialUrl: "#", badgeColor: "#A259FF" },
];

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    nameAr: "سارة جونسون",
    role: "CEO, TechStartup Inc",
    roleAr: "الرئيس التنفيذي، TechStartup Inc",
    text: "Ahmad delivered an outstanding e-commerce platform that increased our conversion by 45%. His attention to detail and creative problem-solving made the entire experience seamless.",
    textAr: "أحمد قدم منصة تجارة إلكترونية متميزة زادت معدل التحويل لدينا بنسبة 45%. اهتمامه بالتفاصيل والحلول الإبداعية جعلت التجربة سلسة تماماً.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    name: "Marcus Chen",
    nameAr: "ماركوس تشن",
    role: "Product Manager, DesignCo",
    roleAr: "مدير المنتج، DesignCo",
    text: "Working with Ahmad was a game-changer. He combines technical excellence with beautiful UI design. Highly recommended for any complex project.",
    textAr: "العمل مع أحمد كان نقطة تحول. يجمع بين التميز التقني وتصميم واجهات جميلة. مستحسن بشدة لأي مشروع معقد.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    nameAr: "إميلي رودريغيز",
    role: "Founder, CreativeStudio",
    roleAr: "المؤسسة، CreativeStudio",
    text: "Ahmad's mobile app development skills are impeccable. He delivered 2 weeks ahead of schedule with zero bugs. A true professional!",
    textAr: "مهارات تطوير التطبيقات الجوالة لأحمد لا تشوبها شائبة. قدمها قبل الموعد بأسبوعين بدون أي أخطاء. متخصص حقيقي!",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60"
  }
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
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
