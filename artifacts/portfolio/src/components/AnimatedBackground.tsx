import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Orb {
  cx: number; cy: number;
  ax: number; ay: number;
  fx: number; fy: number;
  px: number; py: number;
  r: number;
  h: number; s: number; l: number;
  alpha: number;
  speed: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
  shape: "circle" | "square" | "star" | "hexagon";
  rotation: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let W = 0, H = 0;
    const particles: Particle[] = [];

    /* ── orb definitions ─────────────────────────────── */
    const baseOrbs: Orb[] = [
      /* big violet blob top-left */
      { cx: 0.15, cy: 0.20, ax: 0.18, ay: 0.14, fx: 0.31, fy: 0.27, px: 0.0,  py: 1.1, r: 0.42, h: 252, s: 89, l: 62, alpha: 0.25, speed: 0.00035 },
      /* big indigo blob center-right */
      { cx: 0.80, cy: 0.55, ax: 0.15, ay: 0.20, fx: 0.29, fy: 0.19, px: 2.1,  py: 0.5, r: 0.38, h: 230, s: 85, l: 58, alpha: 0.22, speed: 0.00028 },
      /* mid violet top-right */
      { cx: 0.75, cy: 0.15, ax: 0.12, ay: 0.10, fx: 0.41, fy: 0.33, px: 1.0,  py: 2.3, r: 0.28, h: 270, s: 80, l: 65, alpha: 0.20, speed: 0.00042 },
      /* mid cyan bottom-left */
      { cx: 0.20, cy: 0.78, ax: 0.16, ay: 0.12, fx: 0.23, fy: 0.37, px: 3.2,  py: 0.8, r: 0.30, h: 195, s: 80, l: 60, alpha: 0.18, speed: 0.00031 },
      /* small magenta center */
      { cx: 0.50, cy: 0.45, ax: 0.22, ay: 0.18, fx: 0.17, fy: 0.21, px: 0.7,  py: 1.8, r: 0.22, h: 285, s: 75, l: 68, alpha: 0.16, speed: 0.00048 },
      /* large diffuse blue bottom-right */
      { cx: 0.85, cy: 0.85, ax: 0.10, ay: 0.14, fx: 0.35, fy: 0.25, px: 1.5,  py: 3.0, r: 0.35, h: 218, s: 85, l: 63, alpha: 0.24, speed: 0.00025 },
      /* tiny accent top-center */
      { cx: 0.50, cy: 0.08, ax: 0.25, ay: 0.08, fx: 0.52, fy: 0.44, px: 2.8,  py: 0.3, r: 0.18, h: 260, s: 90, l: 70, alpha: 0.19, speed: 0.00055 },
    ];

    /* Apply theme-based alpha multiplier */
    const alphaMultiplier = theme === "light" ? 0.35 : 1;
    const orbs = baseOrbs.map(o => ({ ...o, alpha: o.alpha * alphaMultiplier }));

    const shapes: Array<"circle" | "square" | "star" | "hexagon"> = ["circle", "square", "star", "hexagon"];
    
    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 60 + 240,
        life: 1,
        trail: [],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      // Spawn initial particles
      while (particles.length < 80) {
        particles.push(createParticle());
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const drawShape = (x: number, y: number, size: number, shape: string, rotation: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
      } else if (shape === "square") {
        ctx.fillRect(-size, -size, size * 2, size * 2);
      } else if (shape === "star") {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? size : size * 0.4;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (shape === "hexagon") {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }

      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* layer 1 – screen-blended aurora orbs */
      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      for (const o of orbs) {
        const tt = t * o.speed;
        const x = (o.cx + Math.sin(tt * o.fx + o.px) * o.ax) * W;
        const y = (o.cy + Math.cos(tt * o.fy + o.py) * o.ay) * H;
        const r = o.r * Math.min(W, H);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0,   `hsla(${o.h}, ${o.s}%, ${o.l}%, ${o.alpha})`);
        grad.addColorStop(0.45,`hsla(${o.h + 15}, ${o.s - 10}%, ${o.l - 5}%, ${o.alpha * 0.55})`);
        grad.addColorStop(1,   `hsla(${o.h}, ${o.s}%, ${o.l}%, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      /* layer 1.5 – animated floating particles */
      ctx.save();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        /* draw trail */
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) {
            const trailP = p.trail[j];
            ctx.lineTo(trailP.x, trailP.y);
            ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${trailP.opacity * 0.3})`;
            ctx.lineWidth = p.size * 0.6;
          }
          ctx.stroke();
        }

        /* draw particle shape */
        const color = `hsla(${p.hue}, 70%, 60%, ${p.opacity * p.life})`;
        drawShape(p.x, p.y, p.size, p.shape, p.rotation, color);

        /* glow */
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glowGrad.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.opacity * 0.4 * p.life})`);
        glowGrad.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        /* physics */
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.002;
        p.rotation += 0.02;

        /* record trail */
        p.trail.push({ x: p.x, y: p.y, opacity: p.opacity });
        if (p.trail.length > 15) p.trail.shift();

        /* wrap or regenerate */
        if (p.life <= 0 || p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
          particles[i] = createParticle();
        }
      }
      ctx.restore();

      /* layer 2 – fine scanline grid */
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "rgba(139,92,246,1)";
      ctx.lineWidth = 0.8;
      const step = 52;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      /* layer 3 – subtle vignette */
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.95);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.25)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
