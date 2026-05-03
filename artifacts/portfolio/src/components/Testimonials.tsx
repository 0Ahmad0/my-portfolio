import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { translations } from "@/lib/i18n";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const { language, testimonials } = usePortfolio();
  const t = translations[language];
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrev = () => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const testimonial = testimonials[current];
  const text = language === "ar" ? testimonial.textAr : testimonial.text;
  const name = language === "ar" ? testimonial.nameAr : testimonial.name;
  const role = language === "ar" ? testimonial.roleAr : testimonial.role;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: dir > 0 ? 45 : -45,
      scale: 0.5,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: dir < 0 ? 45 : -45,
      scale: 0.5,
    }),
  };

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden" ref={containerRef}>
      {/* Wild gradient backgrounds */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/15 via-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-500/10 via-primary/8 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-amber-500/8 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4">
            {language === "ar" ? "الآراء" : "FEEDBACK"}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Carousel container */}
        <div className="relative h-[500px] md:h-[400px] flex items-center justify-center perspective">
          <div className="w-full max-w-2xl mx-auto relative h-full">
            {/* Animated card */}
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                rotateY: { type: "spring", stiffness: 300, damping: 30 },
                scale: { type: "spring", stiffness: 300, damping: 30 },
              }}
              style={{ transformPerspective: 1000 }}
              className="absolute inset-0"
            >
              {/* Card with wild effects */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(168, 85, 247, 0)",
                    "0 0 40px rgba(168, 85, 247, 0.5)",
                    "0 0 0 rgba(168, 85, 247, 0)",
                  ],
                  background: [
                    "rgba(255, 255, 255, 0.03)",
                    "rgba(168, 85, 247, 0.08)",
                    "rgba(255, 255, 255, 0.03)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="group h-full p-8 md:p-12 rounded-3xl border border-primary/40 bg-background/60 backdrop-blur-xl hover:border-primary/60 transition-all duration-500 flex flex-col hover:bg-background/80"
              >
                {/* Animated quote icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl text-primary/30 mb-4 font-serif"
                >
                  "
                </motion.div>

                {/* Stars with stagger */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-2 mb-6"
                >
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4 + j * 0.1, type: "spring", stiffness: 300 }}
                    >
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quote text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-lg md:text-xl leading-relaxed mb-8 flex-1 text-foreground/90 font-medium"
                >
                  "{text}"
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-6 origin-left"
                />

                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-4"
                >
                  <motion.img
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    src={testimonial.imageUrl}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/40 shrink-0 cursor-pointer"
                  />
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="font-bold text-foreground text-base"
                    >
                      {name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                      className="text-sm text-primary/60 font-medium"
                    >
                      {role}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation buttons - hidden on mobile */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-20 p-3 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md hover:border-primary/60 hover:bg-primary/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-20 p-3 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md hover:border-primary/60 hover:bg-primary/10 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        {/* Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "bg-primary w-8"
                  : "bg-primary/30 w-2 hover:bg-primary/50"
              }`}
            />
          ))}
        </motion.div>

        {/* Auto-scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            {language === "ar" ? "التمرير التلقائي كل 5 ثواني" : "Auto-scrolling every 5 seconds"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
