import React, { useEffect, useRef } from "react";

/**
 * BackgroundCanvas
 *
 * Egy teljes képernyős, animált, interaktív canvas komponens, amely a háttérben fut.
 * Úgy lett tervezve, hogy minden oldal felett ott legyen (login, settings, stb.).
 *
 * A funkcionalitás 1:1-ben követi az eredeti vanilla JS példád logikáját.
 *
 * Props: nincsenek (később bővíthető például theme-hez)
 */
const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Állapotokat itt tároljuk, hogy ne triggereljünk fölösleges React render-t.
  const animationFrameRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);
  const fogParticlesRef = useRef<FogParticle[]>([]);
  const widthRef = useRef<number>(window.innerWidth);
  const heightRef = useRef<number>(window.innerHeight);
  const glowPulseTimeRef = useRef<number>(0);

  // -- Canvas objektumok definíciója --
  class Dot {
    x: number = 0;
    y: number = 0;
    radius: number = 0;
    speedX: number = 0;
    speedY: number = 0;
    alpha: number = 0;

    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * widthRef.current;
      this.y = Math.random() * heightRef.current;
      this.radius = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (
        this.x < 0 ||
        this.x > widthRef.current ||
        this.y < 0 ||
        this.y > heightRef.current
      ) {
        this.reset();
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 140, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  class FogParticle {
    x: number = 0;
    y: number = 0;
    radius: number = 0;
    alpha: number = 0;
    speedX: number = 0;
    speedY: number = 0;

    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * widthRef.current;
      this.y = Math.random() * heightRef.current;
      this.radius = Math.random() * 200 + 100;
      this.alpha = Math.random() * 0.05 + 0.02;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.speedY = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (
        this.x + this.radius < 0 ||
        this.x - this.radius > widthRef.current ||
        this.y + this.radius < 0 ||
        this.y - this.radius > heightRef.current
      ) {
        this.reset();
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius
      );
      gradient.addColorStop(0, `rgba(180, 220, 255, ${this.alpha})`);
      gradient.addColorStop(1, `rgba(180, 220, 255, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // -- Canvas méret dinamikus kezelése --
  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const oldWidth = widthRef.current;
    const oldHeight = heightRef.current;
    widthRef.current = window.innerWidth;
    heightRef.current = window.innerHeight;
    canvas.width = widthRef.current;
    canvas.height = heightRef.current;

    // Objektumok pozíciójának arányos átskálázása
    const scaleX = widthRef.current / oldWidth || 1;
    const scaleY = heightRef.current / oldHeight || 1;
    dotsRef.current.forEach((dot) => {
      dot.x *= scaleX;
      dot.y *= scaleY;
    });
    fogParticlesRef.current.forEach((fog) => {
      fog.x *= scaleX;
      fog.y *= scaleY;
    });
  }

  // -- Fő animációs ciklus --
  function animate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Törlés
    ctx.clearRect(0, 0, widthRef.current, heightRef.current);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, widthRef.current, heightRef.current);
    // Glow effekt
    drawGlow(ctx);

    // Ködfelhők
    fogParticlesRef.current.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    // Pontok
    dotsRef.current.forEach((dot) => {
      dot.update();
      dot.draw(ctx);
    });

    // Vonalak
    drawLines(ctx);

    // Következő frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }

  // -- Glow effekt kirajzolása --
  function drawGlow(ctx: CanvasRenderingContext2D) {
    glowPulseTimeRef.current += 0.02;
    const pulse = Math.sin(glowPulseTimeRef.current) * 0.2 + 0.6;
    const centerX = widthRef.current / 2;
    const centerY = heightRef.current / 2;
    const radius = Math.max(widthRef.current, heightRef.current) * 0.4 * pulse;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0.0, `rgba(175, 225, 255, ${0.65 * pulse})`);
    gradient.addColorStop(0.05, `rgba(150, 200, 255, ${0.45 * pulse})`);
    gradient.addColorStop(0.1, `rgba(120, 160, 255, ${0.35 * pulse})`);
    gradient.addColorStop(0.2, `rgba(80, 120, 255, ${0.2 * pulse})`);
    gradient.addColorStop(0.35, `rgba(40, 80, 255, ${0.1 * pulse})`);
    gradient.addColorStop(0.5, `rgba(10, 40, 100, ${0.03 * pulse})`);
    gradient.addColorStop(0.75, `rgba(0, 0, 25, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, widthRef.current, heightRef.current);
  }

  // -- Pontokat összekötő vonalak --
  function drawLines(ctx: CanvasRenderingContext2D) {
    const maxDist = 100;
    for (let i = 0; i < dotsRef.current.length; i++) {
      for (let j = i + 1; j < dotsRef.current.length; j++) {
        const dx = dotsRef.current[i].x - dotsRef.current[j].x;
        const dy = dotsRef.current[i].y - dotsRef.current[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.moveTo(dotsRef.current[i].x, dotsRef.current[i].y);
          ctx.lineTo(dotsRef.current[j].x, dotsRef.current[j].y);
          ctx.strokeStyle = `rgba(100, 140, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // -- Init/cleanup effect --
  useEffect(() => {
    // Objektumok inicializálása
    dotsRef.current = Array.from({ length: 160 }, () => new Dot());
    fogParticlesRef.current = Array.from(
      { length: 40 },
      () => new FogParticle()
    );
    // Canvas méret beállítása
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animáció indítása
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
    // eslint-disable-next-line
  }, []); // Csak egyszer fusson le

  // Canvas full-screen, z-index: 0, pointer-events: none
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // Ne akadályozza a kattintásokat!
      }}
      width={widthRef.current}
      height={heightRef.current}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
};

export default BackgroundCanvas;
