import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function InteractiveDotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const idleMouseRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const initPoints = () => {
      const area = width * height;
      const density = 14000; // px² por punto
      const count = Math.max(40, Math.min(180, Math.floor(area / density)));
      pointsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initPoints();
      idleMouseRef.current.x = width / 2;
      idleMouseRef.current.y = height / 2;
      idleMouseRef.current.tx = width / 2;
      idleMouseRef.current.ty = height / 2;
    };

    const readCss = (varName: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return v || fallback;
    };

    let lastIdleRetarget = 0;

    const draw = (t: number) => {
      // Idle cursor: random target, smooth pursuit
      if (!mouseRef.current.active) {
        if (t - lastIdleRetarget > 2500) {
          idleMouseRef.current.tx = Math.random() * width;
          idleMouseRef.current.ty = Math.random() * height;
          lastIdleRetarget = t;
        }
        idleMouseRef.current.x += (idleMouseRef.current.tx - idleMouseRef.current.x) * 0.01;
        idleMouseRef.current.y += (idleMouseRef.current.ty - idleMouseRef.current.y) * 0.01;
      }

      const cursor = mouseRef.current.active
        ? { x: mouseRef.current.x, y: mouseRef.current.y }
        : { x: idleMouseRef.current.x, y: idleMouseRef.current.y };

      ctx.clearRect(0, 0, width, height);

      const primaryRGB = "45, 212, 191"; // teal accent
      const fgRGB = "226, 232, 240"; // light foreground

      const points = pointsRef.current;
      const influence = 140;
      const linkDist = 130;

      // Update positions
      for (const p of points) {
        // Cursor repulsion / attraction (light pull)
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < influence && dist > 0.001) {
          const force = (1 - dist / influence) * 0.35;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Gentle baseline drift
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // Draw links
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.35;
            ctx.strokeStyle = `rgba(${fgRGB}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw points (highlight ones near cursor)
      for (const p of points) {
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        const near = dist < influence;
        const r = near ? 2.2 : 1.4;
        const color = near ? primaryRGB : fgRGB;
        const alpha = near ? 0.9 : 0.55;
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
