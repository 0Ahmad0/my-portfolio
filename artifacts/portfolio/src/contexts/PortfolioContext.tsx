import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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

export type {
  Certificate,
  Education,
  Experience,
  PersonalInfo,
  Project,
  Testimonial,
} from "./portfolio-data";

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

async function insertRecord<T>(
  table: string,
  payload: Payload,
  map: (row: Row) => T,
) {
  const { data, error } = await requireSupabase()
    .from(table)
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return map(data);
}

async function updateRecord<T>(
  table: string,
  id: string,
  payload: Payload,
  map: (row: Row) => T,
) {
  const { data, error } = await requireSupabase()
    .from(table)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return map(data);
}

async function deleteRecord(table: string, id: string) {
  const { error } = await requireSupabase().from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<"en" | "ar">(() => {
    try {
      return localStorage.getItem("portfolio_lang") === "ar" ? "ar" : "en";
    } catch {
      return "en";
    }
  });
  const [personalInfoId, setPersonalInfoId] = useState<string | null>(null);
  const [personalInfo, setPersonalInfoState] =
    useState<PersonalInfo>(defaultPersonalInfo);
  const [projects, setProjects] = useState<Project[]>(
    supabase ? [] : defaultProjects,
  );
  const [experience, setExperience] = useState<Experience[]>(
    supabase ? [] : defaultExperience,
  );
  const [education, setEducation] = useState<Education[]>(
    supabase ? [] : defaultEducation,
  );
  const [certificates, setCertificates] = useState<Certificate[]>(
    supabase ? [] : defaultCertificates,
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    supabase ? [] : defaultTestimonials,
  );

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_lang", language);
    } catch {
      /* Storage may be disabled. */
    }
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(() => controller.abort(), 8000);
    const load = async (
      query: PromiseLike<{ data: Row[] | null; error: unknown }>,
      apply: (rows: Row[]) => void,
    ) => {
      try {
        const { data, error } = await query;
        if (error) throw error;
        if (active && data) apply(data);
      } catch (error) {
        if (active) console.error("Failed to load portfolio section", error);
      }
    };
    // Each section can render as soon as its own request finishes.
    Promise.all([
      load(
        supabase
          .from("portfolio_personal_info")
          .select("*")
          .eq("is_primary", true)
          .limit(1)
          .abortSignal(controller.signal),
        (rows) => {
          if (rows[0]) {
            setPersonalInfoId(rows[0].id);
            setPersonalInfoState(mapPersonalInfo(rows[0]));
          }
        },
      ),
      load(
        supabase
          .from("portfolio_projects")
          .select("*")
          .order("sort_order")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal),
        (rows) => setProjects(rows.map(mapProject)),
      ),
      load(
        supabase
          .from("portfolio_experience")
          .select("*")
          .order("sort_order")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal),
        (rows) => setExperience(rows.map(mapExperience)),
      ),
      load(
        supabase
          .from("portfolio_education")
          .select("*")
          .order("sort_order")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal),
        (rows) => setEducation(rows.map(mapEducation)),
      ),
      load(
        supabase
          .from("portfolio_certificates")
          .select("*")
          .order("sort_order")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal),
        (rows) => setCertificates(rows.map(mapCertificate)),
      ),
      load(
        supabase
          .from("portfolio_testimonials")
          .select("*")
          .order("sort_order")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal),
        (rows) => setTestimonials(rows.map(mapTestimonial)),
      ),
    ]).finally(() => {
      window.clearTimeout(timer);
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const setLanguage = (lang: "en" | "ar") => setLanguageState(lang);

  const setPersonalInfo = async (info: PersonalInfo) => {
    const client = requireSupabase();
    const payload = personalInfoPayload(info);
    const result = personalInfoId
      ? await client
          .from("portfolio_personal_info")
          .update(payload)
          .eq("id", personalInfoId)
          .select()
          .single()
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
    const saved = await updateRecord(
      "portfolio_projects",
      id,
      projectPayload(item),
      mapProject,
    );
    setProjects((current) =>
      current.map((entry) => (entry.id === id ? saved : entry)),
    );
  };
  const deleteProject = async (id: string) => {
    await deleteRecord("portfolio_projects", id);
    setProjects((current) => current.filter((item) => item.id !== id));
  };

  const addExperience = async (item: Omit<Experience, "id">) => {
    const saved = await insertRecord(
      "portfolio_experience",
      experiencePayload({ ...item, sortOrder: experience.length }),
      mapExperience,
    );
    setExperience((current) => [...current, saved]);
  };
  const updateExperience = async (id: string, item: Partial<Experience>) => {
    const saved = await updateRecord(
      "portfolio_experience",
      id,
      experiencePayload(item),
      mapExperience,
    );
    setExperience((current) =>
      current.map((entry) => (entry.id === id ? saved : entry)),
    );
  };
  const deleteExperience = async (id: string) => {
    await deleteRecord("portfolio_experience", id);
    setExperience((current) => current.filter((item) => item.id !== id));
  };

  const addEducation = async (item: Omit<Education, "id">) => {
    const saved = await insertRecord(
      "portfolio_education",
      educationPayload(item),
      mapEducation,
    );
    setEducation((current) => [...current, saved]);
  };
  const updateEducation = async (id: string, item: Partial<Education>) => {
    const saved = await updateRecord(
      "portfolio_education",
      id,
      educationPayload(item),
      mapEducation,
    );
    setEducation((current) =>
      current.map((entry) => (entry.id === id ? saved : entry)),
    );
  };
  const deleteEducation = async (id: string) => {
    await deleteRecord("portfolio_education", id);
    setEducation((current) => current.filter((item) => item.id !== id));
  };

  const addCertificate = async (item: Omit<Certificate, "id">) => {
    const saved = await insertRecord(
      "portfolio_certificates",
      certificatePayload({ ...item, sortOrder: certificates.length }),
      mapCertificate,
    );
    setCertificates((current) => [...current, saved]);
  };
  const updateCertificate = async (id: string, item: Partial<Certificate>) => {
    const saved = await updateRecord(
      "portfolio_certificates",
      id,
      certificatePayload(item),
      mapCertificate,
    );
    setCertificates((current) =>
      current.map((entry) => (entry.id === id ? saved : entry)),
    );
  };
  const deleteCertificate = async (id: string) => {
    await deleteRecord("portfolio_certificates", id);
    setCertificates((current) => current.filter((item) => item.id !== id));
  };

  const addTestimonial = async (item: Omit<Testimonial, "id">) => {
    const saved = await insertRecord(
      "portfolio_testimonials",
      testimonialPayload({ ...item, sortOrder: testimonials.length }),
      mapTestimonial,
    );
    setTestimonials((current) => [...current, saved]);
  };
  const updateTestimonial = async (id: string, item: Partial<Testimonial>) => {
    const saved = await updateRecord(
      "portfolio_testimonials",
      id,
      testimonialPayload(item),
      mapTestimonial,
    );
    setTestimonials((current) =>
      current.map((entry) => (entry.id === id ? saved : entry)),
    );
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
  if (context === undefined)
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
}
