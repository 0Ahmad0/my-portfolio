export type Project = {
  id: string;
  sortOrder?: number;
  isPublished: boolean;
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
  androidUrl?: string;
  iosUrl?: string;
};

export type Experience = {
  id: string;
  sortOrder?: number;
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
  company: string;
  companyAr: string;
  countryCode: "SA" | "SY";
  text: string;
  textAr: string;
  highlight: string;
  highlightAr: string;
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
  coreSkills: string[];
};

export const defaultFloatingSkills = ["Flutter", "Firebase", "C++", "React", "Git", "Dart"];
export const defaultCoreSkills = [
  "React",
  "Flutter",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "C++",
  "Dart",
  "Android",
  "Kotlin",
  "Swift",
  "Figma",
  "Tailwind",
  "Docker",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "Git",
];

export const defaultPersonalInfo: PersonalInfo = {
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
  floatingSkills: defaultFloatingSkills,
  coreSkills: defaultCoreSkills,
};

export const defaultProjects: Project[] = [
  {
    id: "1",
    isPublished: true,
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
    isPublished: true,
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
    isPublished: true,
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
    isPublished: true,
    title: "Mardod App",
    titleAr: "تطبيق مردود",
    description: "AI-powered app exploring Saudi Arabia through chat.",
    descriptionAr: "تطبيق مدعوم بالذكاء الاصطناعي لاستكشاف السعودية عبر الدردشة.",
    category: "Mobile",
    tags: ["Flutter", "Dart", "AI"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60",
  },
];

export const defaultExperience: Experience[] = [
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

export const defaultEducation: Education[] = [
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

export const defaultCertificates: Certificate[] = [
  {
    id: "1",
    title: "Agile Project Management",
    titleAr: "إدارة المشاريع Agile",
    issuer: "HP LIFE",
    issuerAr: "HP LIFE",
    date: "2023",
    credentialUrl: "#",
    badgeColor: "#0096D6",
  },
  {
    id: "2",
    title: "Fundamentals of Technical Project Management",
    titleAr: "أساسيات إدارة المشاريع التقنية",
    issuer: "PMI",
    issuerAr: "PMI",
    date: "2023",
    credentialUrl: "#",
    badgeColor: "#E4002B",
  },
  {
    id: "3",
    title: "Volunteer Certificate",
    titleAr: "شهادة تطوع",
    issuer: "RBCs Team",
    issuerAr: "فريق RBCs",
    date: "2023",
    credentialUrl: "#",
    badgeColor: "#00897B",
  },
];

export const defaultTestimonials: Testimonial[] = [];

type Row = Record<string, any>;

export const mapPersonalInfo = (row: Row): PersonalInfo => ({
  name: row.name ?? "",
  nameAr: row.name_ar ?? "",
  bio: row.bio ?? "",
  bioAr: row.bio_ar ?? "",
  email: row.email ?? "",
  location: row.location ?? "",
  locationAr: row.location_ar ?? "",
  github: row.github ?? "",
  linkedin: row.linkedin ?? "",
  twitter: row.twitter ?? "",
  telegram: row.telegram ?? "",
  whatsapp: row.whatsapp ?? "",
  instagram: row.instagram ?? "",
  facebook: row.facebook ?? "",
  cvUrl: row.cv_url ?? "",
  avatarUrl: row.avatar_url ?? "",
  floatingSkills: row.floating_skills ?? defaultFloatingSkills,
  coreSkills: row.core_skills ?? defaultCoreSkills,
});

export const personalInfoPayload = (info: PersonalInfo) => ({
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
  core_skills: info.coreSkills,
});

export const mapProject = (row: Row): Project => ({
  id: row.id,
  sortOrder: row.sort_order ?? 0,
  isPublished: row.is_published ?? true,
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
  androidUrl: row.android_url ?? "",
  iosUrl: row.ios_url ?? "",
});

export const projectPayload = (project: Partial<Project>) => ({
  title: project.title,
  title_ar: project.titleAr,
  description: project.description,
  description_ar: project.descriptionAr,
  category: project.category,
  tags: project.tags,
  image_url: project.imageUrl,
  images: project.images,
  live_url: project.liveUrl,
  github_url: project.githubUrl,
  android_url: project.androidUrl,
  ios_url: project.iosUrl,
  is_published: project.isPublished,
  sort_order: project.sortOrder,
});

export const mapExperience = (row: Row): Experience => ({
  id: row.id,
  sortOrder: row.sort_order ?? 0,
  company: row.company ?? "",
  role: row.role ?? "",
  roleAr: row.role_ar ?? "",
  period: row.period ?? "",
  description: row.description ?? "",
  descriptionAr: row.description_ar ?? "",
});

export const experiencePayload = (experience: Partial<Experience>) => ({
  company: experience.company,
  role: experience.role,
  role_ar: experience.roleAr,
  period: experience.period,
  description: experience.description,
  description_ar: experience.descriptionAr,
  sort_order: experience.sortOrder,
});

export const mapEducation = (row: Row): Education => ({
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
});

export const educationPayload = (education: Partial<Education>) => ({
  institution: education.institution,
  institution_ar: education.institutionAr,
  degree: education.degree,
  degree_ar: education.degreeAr,
  field: education.field,
  field_ar: education.fieldAr,
  period: education.period,
  gpa: education.gpa,
  description: education.description,
  description_ar: education.descriptionAr,
});

export const mapCertificate = (row: Row): Certificate => ({
  id: row.id,
  sortOrder: row.sort_order ?? 0,
  title: row.title ?? "",
  titleAr: row.title_ar ?? "",
  issuer: row.issuer ?? "",
  issuerAr: row.issuer_ar ?? "",
  date: row.date ?? "",
  credentialUrl: row.credential_url ?? "",
  badgeColor: row.badge_color ?? "#6C63FF",
});

export const certificatePayload = (certificate: Partial<Certificate>) => ({
  title: certificate.title,
  title_ar: certificate.titleAr,
  issuer: certificate.issuer,
  issuer_ar: certificate.issuerAr,
  date: certificate.date,
  credential_url: certificate.credentialUrl,
  badge_color: certificate.badgeColor,
  sort_order: certificate.sortOrder,
});

export const mapTestimonial = (row: Row): Testimonial => ({
  id: row.id,
  sortOrder: row.sort_order ?? 0,
  name: row.name ?? "",
  nameAr: row.name_ar ?? "",
  role: row.role ?? "",
  roleAr: row.role_ar ?? "",
  company: row.company ?? "",
  companyAr: row.company_ar ?? "",
  countryCode: row.country_code === "SY" ? "SY" : "SA",
  text: row.text ?? "",
  textAr: row.text_ar ?? "",
  highlight: row.highlight ?? "",
  highlightAr: row.highlight_ar ?? "",
  rating: row.rating ?? 5,
  imageUrl: row.image_url ?? "",
});

export const testimonialPayload = (testimonial: Partial<Testimonial>) => ({
  name: testimonial.name,
  name_ar: testimonial.nameAr,
  role: testimonial.role,
  role_ar: testimonial.roleAr,
  company: testimonial.company,
  company_ar: testimonial.companyAr,
  country_code: testimonial.countryCode,
  text: testimonial.text,
  text_ar: testimonial.textAr,
  highlight: testimonial.highlight,
  highlight_ar: testimonial.highlightAr,
  rating: testimonial.rating,
  image_url: testimonial.imageUrl,
  sort_order: testimonial.sortOrder,
});
