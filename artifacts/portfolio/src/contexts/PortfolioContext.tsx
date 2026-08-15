import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import {
  type Certificate,
  type Education,
  type Experience,
  type PersonalInfo,
  type Project,
  type Testimonial,
  certificatePayload,
  defaultCertificates,
  defaultEducation,
  defaultExperience,
  defaultPersonalInfo,
  defaultProjects,
  defaultTestimonials,
  educationPayload,
  experiencePayload,
  mapCertificate,
  mapEducation,
  mapExperience,
  mapPersonalInfo,
  mapProject,
  mapTestimonial,
  personalInfoPayload,
  projectPayload,
  testimonialPayload,
} from "./portfolio-data";

export type { Certificate, Education, Experience, PersonalInfo, Project, Testimonial } from "./portfolio-data";

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

type Row = Record<string, any>;
type Payload = Record<string, any>;

function requireSupabase() {
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

async function insertRecord<T>(table: string, payload: Payload, map: (row: Row) => T) {
  const { data, error } = await requireSupabase().from(table).insert(payload).select().single();
  if (error) throw new Error(error.message);
  return map(data);
}

async function updateRecord<T>(table: string, id: string, payload: Payload, map: (row: Row) => T) {
  const { data, error } = await requireSupabase().from(table).update(payload).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return map(data);
}

async function deleteRecord(table: string, id: string) {
  const { error } = await requireSupabase().from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<"en" | "ar">(() => {
    try {
      return (localStorage.getItem("portfolio_lang") as "en" | "ar") || "en";
    } catch {
      return "en";
    }
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

        const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms));
        const queries = [
          supabase.from("portfolio_personal_info").select("*").eq("is_primary", true).limit(1),
          supabase.from("portfolio_projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
          supabase.from("portfolio_experience").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
          supabase.from("portfolio_education").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
          supabase.from("portfolio_certificates").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
          supabase.from("portfolio_testimonials").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
        ] as const;
        const [personalRes, projectsRes, expRes, eduRes, certRes, testRes] = await Promise.race([Promise.all(queries), timeout(8000)]);

        if (!isMounted) return;
        const responses = [personalRes, projectsRes, expRes, eduRes, certRes, testRes];
        const hasAuthError = responses.some((response) => {
          const code = response.error?.code;
          return code === "PGRST301" || code === "42501" || (response as any).status === 401 || (response as any).status === 403;
        });
        if (hasAuthError) {
          console.warn("Supabase auth error - check your API key. Falling back to default data.");
          return;
        }

        const labels = ["personal info", "projects", "experience", "education", "certificates", "testimonials"];
        responses.forEach((response, index) => {
          if (response.error) console.error(`Failed to load ${labels[index]}`, response.error);
        });

        const infoRow = personalRes.data?.[0];
        if (infoRow) {
          setPersonalInfoId(infoRow.id);
          setPersonalInfoState(mapPersonalInfo(infoRow));
        }
        if (projectsRes.data) setProjects(projectsRes.data.map(mapProject));
        if (expRes.data) setExperience(expRes.data.map(mapExperience));
        if (eduRes.data) setEducation(eduRes.data.map(mapEducation));
        if (certRes.data) setCertificates(certRes.data.map(mapCertificate));
        if (testRes.data) setTestimonials(testRes.data.map(mapTestimonial));
      } catch (err) {
        console.error("Failed to load portfolio data", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = (lang: "en" | "ar") => setLanguageState(lang);

  const setPersonalInfo = async (info: PersonalInfo) => {
    const client = requireSupabase();
    const payload = personalInfoPayload(info);
    const result = personalInfoId
      ? await client.from("portfolio_personal_info").update(payload).eq("id", personalInfoId).select().single()
      : await client
          .from("portfolio_personal_info")
          .insert({ is_primary: true, ...payload })
          .select()
          .single();
    if (result.error) throw new Error(result.error.message);
    if (!personalInfoId) setPersonalInfoId(result.data.id);
    setPersonalInfoState(mapPersonalInfo(result.data));
  };

  const addProject = async (item: Omit<Project, "id">) => {
    const saved = await insertRecord(
      "portfolio_projects",
      projectPayload({
        ...item,
        images: item.images ?? [],
        sortOrder: projects.length,
      }),
      mapProject,
    );
    setProjects((current) => [...current, saved]);
  };
  const updateProject = async (id: string, item: Partial<Project>) => {
    const saved = await updateRecord("portfolio_projects", id, projectPayload(item), mapProject);
    setProjects((current) => current.map((entry) => (entry.id === id ? saved : entry)));
  };
  const deleteProject = async (id: string) => {
    await deleteRecord("portfolio_projects", id);
    setProjects((current) => current.filter((item) => item.id !== id));
  };

  const addExperience = async (item: Omit<Experience, "id">) => {
    const saved = await insertRecord("portfolio_experience", experiencePayload({ ...item, sortOrder: experience.length }), mapExperience);
    setExperience((current) => [...current, saved]);
  };
  const updateExperience = async (id: string, item: Partial<Experience>) => {
    const saved = await updateRecord("portfolio_experience", id, experiencePayload(item), mapExperience);
    setExperience((current) => current.map((entry) => (entry.id === id ? saved : entry)));
  };
  const deleteExperience = async (id: string) => {
    await deleteRecord("portfolio_experience", id);
    setExperience((current) => current.filter((item) => item.id !== id));
  };

  const addEducation = async (item: Omit<Education, "id">) => {
    const saved = await insertRecord("portfolio_education", educationPayload(item), mapEducation);
    setEducation((current) => [...current, saved]);
  };
  const updateEducation = async (id: string, item: Partial<Education>) => {
    const saved = await updateRecord("portfolio_education", id, educationPayload(item), mapEducation);
    setEducation((current) => current.map((entry) => (entry.id === id ? saved : entry)));
  };
  const deleteEducation = async (id: string) => {
    await deleteRecord("portfolio_education", id);
    setEducation((current) => current.filter((item) => item.id !== id));
  };

  const addCertificate = async (item: Omit<Certificate, "id">) => {
    const saved = await insertRecord("portfolio_certificates", certificatePayload({ ...item, sortOrder: certificates.length }), mapCertificate);
    setCertificates((current) => [...current, saved]);
  };
  const updateCertificate = async (id: string, item: Partial<Certificate>) => {
    const saved = await updateRecord("portfolio_certificates", id, certificatePayload(item), mapCertificate);
    setCertificates((current) => current.map((entry) => (entry.id === id ? saved : entry)));
  };
  const deleteCertificate = async (id: string) => {
    await deleteRecord("portfolio_certificates", id);
    setCertificates((current) => current.filter((item) => item.id !== id));
  };

  const addTestimonial = async (item: Omit<Testimonial, "id">) => {
    const saved = await insertRecord("portfolio_testimonials", testimonialPayload({ ...item, sortOrder: testimonials.length }), mapTestimonial);
    setTestimonials((current) => [...current, saved]);
  };
  const updateTestimonial = async (id: string, item: Partial<Testimonial>) => {
    const saved = await updateRecord("portfolio_testimonials", id, testimonialPayload(item), mapTestimonial);
    setTestimonials((current) => current.map((entry) => (entry.id === id ? saved : entry)));
  };
  const deleteTestimonial = async (id: string) => {
    await deleteRecord("portfolio_testimonials", id);
    setTestimonials((current) => current.filter((item) => item.id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{
        isLoading,
        language,
        setLanguage,
        personalInfo,
        setPersonalInfo,
        projects,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        experience,
        setExperience,
        addExperience,
        updateExperience,
        deleteExperience,
        education,
        setEducation,
        addEducation,
        updateEducation,
        deleteEducation,
        certificates,
        setCertificates,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        testimonials,
        setTestimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
}
