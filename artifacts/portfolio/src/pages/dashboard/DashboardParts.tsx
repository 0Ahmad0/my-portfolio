import { useState } from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, Edit2, GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* Comfortable thumb targets on touch, compact on desktop (mouse) */
const TOUCH_ICON = "h-11 w-11 sm:h-9 sm:w-9";
const TOUCH_BTN = "min-h-11 sm:min-h-9";

export function SectionHeader({
  icon: Icon,
  title,
  count,
  color,
  onAdd,
  addLabel,
  itemLabel,
}: {
  icon: any;
  title: string;
  count: number;
  color: string;
  onAdd: () => void;
  addLabel: string;
  itemLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 shrink-0 chamfer [--cut:8px] flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}33` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-tight truncate">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {count} {itemLabel}
          </p>
        </div>
      </div>
      {/* Messages has no add action — it passes an empty label */}
      {addLabel && (
        <Button onClick={onAdd} className={`gap-2 w-full sm:w-auto shrink-0 shadow-lg shadow-primary/20 ${TOUCH_BTN}`}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      )}
    </div>
  );
}

/* ─── Animated empty state ─────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, onAdd, addLabel }: { icon: any; title: string; description: string; onAdd: () => void; addLabel: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          type: "spring",
          stiffness: 200,
        }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 chamfer [--cut:18px] bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary/60" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 chamfer [--cut:18px] bg-primary/10"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary/60" />
        </motion.div>
      </motion.div>
      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-lg font-bold mb-2">
        {title}
      </motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
        {description}
      </motion.p>
      {addLabel && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Button onClick={onAdd} className={`gap-2 px-6 shadow-lg shadow-primary/25 ${TOUCH_BTN}`}>
            <Plus className="h-4 w-4" /> {addLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Item card row ──────────────────────────────────── */
export function ItemCard({
  children,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  index,
  sortableId,
}: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onMoveUp?: () => void | Promise<void>;
  onMoveDown?: () => void | Promise<void>;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  index: number;
  sortableId?: string;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { language } = usePortfolio();
  const d = translations[language].dashboard;
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId ?? `item-${index}`,
    disabled: !sortableId,
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
      }}
      className={isDragging ? "relative z-50" : undefined}
    >
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
        /* stagger caps at 8: a 22-item list must not animate for 1.1s */
        transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
        layout
      >
        <Card className="chamfer hover:border-primary/40 transition-colors">
          {/* Mobile: content stacked over its own action row. Desktop: side by side. */}
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
            <div className="flex-1 min-w-0">{children}</div>
            <div className="flex items-center justify-end gap-1 border-t border-border/50 pt-3 sm:gap-2 sm:shrink-0 sm:border-0 sm:pt-0">
              {confirmDelete ? (
                <>
                  <Button variant="ghost" size="sm" className={TOUCH_BTN} onClick={() => setConfirmDelete(false)}>
                    {d.actions.cancel}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                    onClick={async () => {
                      setDeleting(true);
                      try {
                        await onDelete();
                      } catch {
                      } finally {
                        setDeleting(false);
                        setConfirmDelete(false);
                      }
                    }}
                    className={`gap-1.5 ${TOUCH_BTN}`}
                  >
                    {deleting ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Trash2 className="h-3.5 w-3.5" />}{" "}
                    {d.actions.confirm}
                  </Button>
                </>
              ) : (
                <>
                  {sortableId && (
                    <Button
                      ref={setActivatorNodeRef}
                      variant="ghost"
                      size="icon"
                      className={`${TOUCH_ICON} cursor-grab touch-none active:cursor-grabbing`}
                      title={language === "ar" ? "اسحب لإعادة الترتيب" : "Drag to reorder"}
                      aria-label={language === "ar" ? "اسحب لإعادة الترتيب" : "Drag to reorder"}
                      {...attributes}
                      {...listeners}
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                  )}
                  {(onMoveUp || onMoveDown) && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={TOUCH_ICON}
                        onClick={onMoveUp}
                        disabled={!canMoveUp}
                        title={language === "ar" ? "نقل للأعلى" : "Move up"}
                        aria-label={language === "ar" ? "نقل للأعلى" : "Move up"}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={TOUCH_ICON}
                        onClick={onMoveDown}
                        disabled={!canMoveDown}
                        title={language === "ar" ? "نقل للأسفل" : "Move down"}
                        aria-label={language === "ar" ? "نقل للأسفل" : "Move down"}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={onEdit} className={`gap-1.5 px-3 ${TOUCH_BTN}`}>
                    <Edit2 className="h-3.5 w-3.5" /> {d.edit}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${TOUCH_ICON} text-destructive hover:bg-destructive/10`}
                    onClick={() => setConfirmDelete(true)}
                    title={d.delete}
                    aria-label={d.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const DEFAULT_FLOATING_SKILLS = ["Flutter", "Firebase", "C++", "React", "Git", "Dart"];
const DEFAULT_CORE_SKILLS = [
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

/* ─── Stats bar ──────────────────────────────────────── */
export function StatBadge({ icon: Icon, label, value, color, className = "" }: { icon: any; label: string; value: number; color: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2.5 px-3 py-2.5 sm:px-4 chamfer bg-muted/40 border border-border/40 ${className}`}
    >
      <div className="w-8 h-8 shrink-0 chamfer [--cut:6px] flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}33` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none tabular-nums">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">{label}</p>
      </div>
    </motion.div>
  );
}
