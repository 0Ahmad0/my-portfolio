import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Check, ImagePlus, Link2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatBytes, uploadImage, type ImageFolder } from "@/utils/image-upload";

type Tab = "upload" | "url";

export type ImageManagerProps = {
  images: string[];
  onChange: (images: string[]) => void;
  mode?: "multiple" | "single";
  folder: ImageFolder;
  coverLabel?: string;
  className?: string;
};

/* ─── Shared image studio: compress → upload, or paste a plain URL ─── */
export function ImageManager({
  images,
  onChange,
  mode = "multiple",
  folder,
  coverLabel,
  className = "",
}: ImageManagerProps) {
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const t = d.upload;
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("upload");
  const [busy, setBusy] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [stats, setStats] = useState<{ url: string; label: string }[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const cover = coverLabel ?? t.cover;
  const list = mode === "single" ? images.slice(0, 1) : images;

  const addImage = (url: string) => {
    if (mode === "single") onChange([url]);
    else if (!images.includes(url)) onChange([...images, url]);
  };

  const handleFiles = async (files: FileList | File[]) => {
    const queue = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!queue.length) return;
    setBusy(true);
    try {
      for (const file of queue) {
        const { url, compression } = await uploadImage(file, folder);
        addImage(url);
        setStats((current) => [
          { url, label: t.compressed.replace("{from}", formatBytes(compression.fromBytes)).replace("{to}", formatBytes(compression.toBytes)) },
          ...current.filter((entry) => entry.url !== url),
        ]);
      }
      toast({ title: d.actions.saved });
    } catch (error: any) {
      toast({
        title: d.actions.error || "Error",
        description: error?.message || t.errorUpload,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((entry) => entry !== url));
    setStats((current) => current.filter((entry) => entry.url !== url));
  };

  const submitUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    addImage(url);
    setUrlDraft("");
  };

  /* moves an image one slot left (towards the cover) */
  const moveLeft = (index: number) => {
    if (index <= 0 || mode === "single") return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Tabs: upload ⇄ url */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border/50 w-full sm:w-auto sm:inline-flex">
        {(["upload", "url"] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`flex-1 sm:flex-none min-h-9 px-3 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
              tab === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {key === "upload" ? <UploadCloud className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            {key === "upload" ? t.tabUpload : t.tabUrl}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!busy) void handleFiles(e.dataTransfer.files);
          }}
          className={`relative flex flex-col items-center justify-center gap-1.5 py-6 px-4 text-center border border-dashed transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border/60 bg-muted/20"
          }`}
        >
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple={mode === "multiple"}
            className="hidden"
            onChange={(e) => e.target.files && void handleFiles(e.target.files)}
          />
          {busy ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <ImagePlus className="w-6 h-6 text-primary/70" />
          )}
          <p className="text-xs text-muted-foreground">
            {busy ? t.progress : t.dropHint}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
            className="gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" /> {t.tabUpload}
          </Button>
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">{t.hint}</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitUrl();
              }
            }}
            placeholder={language === "ar" ? "https://example.com/image.jpg" : "https://example.com/image.jpg"}
            className="flex-1 font-mono text-xs"
            dir="ltr"
          />
          <Button type="button" variant="secondary" size="sm" onClick={submitUrl} disabled={!urlDraft.trim()} className="gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {language === "ar" ? "إضافة" : "Add"}
          </Button>
        </div>
      )}

      {/* Thumbnails */}
      <AnimatePresence initial={false}>
        {list.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2 flex-wrap overflow-hidden">
            {list.map((img, i) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <img
                  src={img}
                  alt=""
                  className={`object-cover border border-border/60 bg-muted ${
                    mode === "single" ? "w-16 h-16 rounded-xl" : "w-16 h-12"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
                {i === 0 && mode === "multiple" && (
                  <span className="absolute -top-1.5 -right-1 bg-primary text-[9px] text-white px-1.5 py-0.5 rounded-full font-medium">
                    {cover}
                  </span>
                )}
                {mode === "multiple" && i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveLeft(i)}
                    title={language === "ar" ? "اجعلها غلافاً" : "Make cover"}
                    aria-label={language === "ar" ? "اجعلها غلافاً" : "Make cover"}
                    className="absolute bottom-0.5 left-0.5 w-5 h-5 rounded bg-background/85 border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowDownUp className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  title={t.deleteImage}
                  aria-label={t.deleteImage}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compression stats */}
      {stats.length > 0 && (
        <div className="space-y-1">
          {stats.slice(0, 3).map((entry) => (
            <p key={entry.url} className="text-[10px] text-emerald-500 flex items-center gap-1">
              <Check className="w-3 h-3" /> {entry.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
