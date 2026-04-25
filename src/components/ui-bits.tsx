import { ReactNode } from "react";

export function SectionHeader({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-10 border-b border-border pb-6">
      <div className="text-xs text-primary tracking-widest mb-2">{index}</div>
      <h1 className="text-4xl md:text-5xl font-display font-semibold text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-muted-foreground max-w-3xl text-balance">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function Panel({
  title,
  tag,
  children,
  accent,
}: {
  title?: string;
  tag?: string;
  children: ReactNode;
  accent?: "primary" | "accent" | "warn" | "success";
}) {
  const accentMap = {
    primary: "border-l-primary",
    accent: "border-l-accent",
    warn: "border-l-warn",
    success: "border-l-success",
  } as const;
  return (
    <section
      className={`relative bg-surface border border-border ${
        accent ? `border-l-2 ${accentMap[accent]}` : ""
      }`}
    >
      {(title || tag) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2/50">
          <h3 className="text-sm font-display font-medium">{title}</h3>
          {tag && (
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              {tag}
            </span>
          )}
        </div>
      )}
      <div className="p-5 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function KeyVal({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{k}</span>
      <span className="text-sm text-foreground font-medium text-right">{v}</span>
    </div>
  );
}

export function Tag({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "accent" | "warn" | "danger" | "success" | "muted" }) {
  const map = {
    primary: "border-primary/40 text-primary bg-primary/5",
    accent: "border-accent/40 text-accent bg-accent/5",
    warn: "border-warn/40 text-warn bg-warn/5",
    danger: "border-danger/50 text-danger bg-danger/5",
    success: "border-success/40 text-success bg-success/5",
    muted: "border-border text-muted-foreground bg-surface-2",
  } as const;
  return (
    <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 border ${map[tone]}`}>
      {children}
    </span>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="bg-background border border-border p-4 text-xs overflow-x-auto text-foreground/90">
      <code>{children}</code>
    </pre>
  );
}

export function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 py-1">
      <span className="text-primary mt-1.5 flex-none">▸</span>
      <span>{children}</span>
    </li>
  );
}
