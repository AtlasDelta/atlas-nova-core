import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1 progress through lifetime
  ttl: number; // total frames to live
}

export function InteractiveDotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; lastMove: number }>({
    x: -9999,
    y: -9999,
    active: false,
    lastMove: 0,
  });
  const idleMouseRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const spawnPoint = (): Point => {
      const w = sizeRef.current.w;
      const h = sizeRef.current.h;
      // Pick a random edge; spawn just outside, velocity points inward
      const edge = Math.floor(Math.random() * 4);
      const speed = 0.5 + Math.random() * 0.7;
      let x = 0;
      let y = 0;
      let vx = 0;
      let vy = 0;
      const margin = 8;
      if (edge === 0) {
        // top
        x = Math.random() * w;
        y = -margin;
        vx = (Math.random() - 0.5) * speed;
        vy = speed;
      } else if (edge === 1) {
        // right
        x = w + margin;
        y = Math.random() * h;
        vx = -speed;
        vy = (Math.random() - 0.5) * speed;
      } else if (edge === 2) {
        // bottom
        x = Math.random() * w;
        y = h + margin;
        vx = (Math.random() - 0.5) * speed;
        vy = -speed;
      } else {
        // left
        x = -margin;
        y = Math.random() * h;
        vx = speed;
        vy = (Math.random() - 0.5) * speed;
      }
      return {
        x,
        y,
        vx,
        vy,
        life: 0,
        ttl: 360 + Math.floor(Math.random() * 360), // ~6-12s @60fps
      };
    };

    const targetCount = () => {
      const area = sizeRef.current.w * sizeRef.current.h;
      const density = 14000;
      return Math.max(40, Math.min(180, Math.floor(area / density)));
    };

    const initPoints = () => {
      const count = targetCount();
      pointsRef.current = Array.from({ length: count }, () => {
        // Initial seed: spread across screen with random life so they don't all die together
        const p = spawnPoint();
        p.x = Math.random() * sizeRef.current.w;
        p.y = Math.random() * sizeRef.current.h;
        p.life = Math.random();
        return p;
      });
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current.w = width;
      sizeRef.current.h = height;
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

    let lastIdleRetarget = 0;

    const draw = (t: number) => {
      const width = sizeRef.current.w;
      const height = sizeRef.current.h;

      if (mouseRef.current.active && performance.now() - mouseRef.current.lastMove > 1000) {
        mouseRef.current.active = false;
      }

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

      const primaryRGB = "45, 212, 191";
      const fgRGB = "226, 232, 240";

      const points = pointsRef.current;
      const influence = 220;
      const linkDist = 130;

      // Keep total count stable: replace dead points
      const desired = targetCount();
      if (points.length < desired) {
        for (let i = points.length; i < desired; i++) points.push(spawnPoint());
      } else if (points.length > desired) {
        points.length = desired;
      }

      // Update positions
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // MAGNET: attract toward cursor (perturbs trajectory but doesn't dominate)
        const dx = cursor.x - p.x;
        const dy = cursor.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < influence && dist > 0.001) {
          const force = (1 - dist / influence) * 0.08;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        // Very light damping so points keep traveling across the screen
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Tiny drift
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        // Cap speed so magnet attraction doesn't snowball
        const sp = Math.hypot(p.vx, p.vy);
        const maxSp = 1.6;
        if (sp > maxSp) {
          p.vx = (p.vx / sp) * maxSp;
          p.vy = (p.vy / sp) * maxSp;
        }

        // Lifecycle
        p.life += 1 / p.ttl;
        if (p.life >= 1) {
          points[i] = spawnPoint();
        }
      }

      // Draw links (alpha modulated by both points' life envelopes)
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const aFade = Math.sin(Math.PI * a.life); // 0→1→0
        if (aFade <= 0.02) continue;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const bFade = Math.sin(Math.PI * b.life);
            const alpha = (1 - d / linkDist) * 0.6 * aFade * bFade;
            if (alpha <= 0.01) continue;
            ctx.strokeStyle = `rgba(${fgRGB}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (const p of points) {
        const fade = Math.sin(Math.PI * p.life);
        if (fade <= 0.02) continue;
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        const near = dist < influence;
        const r = near ? 2.6 : 1.8;
        const color = near ? primaryRGB : fgRGB;
        const alpha = (near ? 1.0 : 0.85) * fade;
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
      mouseRef.current.lastMove = performance.now();
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
        mouseRef.current.lastMove = performance.now();
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
