import { useEffect, useRef } from "react";
import { useAppStore } from "@/stores/appStore";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  type: "star" | "particle" | "sparkle";
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { backgroundTheme, visualFilters } = useAppStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only show animated bg for dark themes
    if (backgroundTheme.type !== "animated" && backgroundTheme.type !== "gradient") {
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#00d4ff", "#0066ff", "#a855f7", "#ffffff", "#00ff88"];

    // Initialize particles
    particlesRef.current = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.7 ? "sparkle" : Math.random() > 0.5 ? "star" : "particle",
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frame++;
      particlesRef.current.forEach((p) => {
        // Parallax effect toward mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += (dx / dist) * 0.002;
          p.vy += (dy / dist) * 0.002;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Twinkle
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(p.twinklePhase));

        ctx.save();
        ctx.globalAlpha = p.opacity * twinkle;

        if (p.type === "sparkle") {
          // Draw 4-pointed star sparkle
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = visualFilters.neonGlow * 0.2;
          const size = p.radius * 3;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const x1 = p.x + Math.cos(angle) * size;
            const y1 = p.y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
            const ax = p.x + Math.cos(angle + Math.PI / 4) * (size * 0.3);
            const ay = p.y + Math.sin(angle + Math.PI / 4) * (size * 0.3);
            ctx.lineTo(ax, ay);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "star") {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.radius * 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.radius * 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw connections
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1, i + 5).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = "#00d4ff";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [backgroundTheme, visualFilters.neonGlow]);

  const bgStyle: React.CSSProperties = {};
  if (backgroundTheme.type === "gradient" || backgroundTheme.type === "color") {
    bgStyle.background = backgroundTheme.value;
  }

  return (
    <div className="fixed inset-0 -z-10" style={bgStyle}>
      {(backgroundTheme.type === "animated" || backgroundTheme.type === "gradient") && (
        <div
          className="absolute inset-0"
          style={{
            background: backgroundTheme.type === "animated"
              ? "radial-gradient(ellipse at 20% 50%, rgba(0,102,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0,212,255,0.08) 0%, transparent 50%), linear-gradient(135deg, #0a0e1a 0%, #0d1226 50%, #16203e 100%)"
              : backgroundTheme.value,
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: backgroundTheme.type === "color" && backgroundTheme.value.includes("f8") ? 0.1 : 1 }}
      />
      {/* Fluid wave overlay */}
      {backgroundTheme.type === "animated" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(0deg, rgba(0,212,255,0.03) 0%, transparent 50%, rgba(168,85,247,0.02) 100%)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}
