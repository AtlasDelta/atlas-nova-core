// Repositorio científico — sistema de artículos enriquecidos.
//
// Cada "Article" es una página-tema (ej: Mecánica clásica) con muchas
// "Section" anclables. Cada sección puede llevar markdown + LaTeX y,
// opcionalmente, un widget interactivo (gráfica o simulación) identificado
// por una clave que se resuelve en runtime.

export type Category = "fisica" | "quimica" | "matematica" | "ingenieria";

export type WidgetKey =
  // Física
  | "phys-projectile"
  | "phys-friction"
  | "phys-spring"
  | "phys-pendulum"
  | "phys-ohm"
  | "phys-wave"
  | "phys-doppler"
  | "phys-decay"
  | "phys-rc"
  | "phys-snell"
  | "phys-energy"
  | "phys-collision"
  | "phys-em-wave"
  | "phys-lens"
  | "phys-fluid"
  // Química
  | "chem-arrhenius"
  | "chem-firstorder"
  | "chem-equilibrium"
  | "chem-ph"
  | "chem-gas"
  | "chem-titration"
  | "chem-lechatelier"
  | "chem-orbitals"
  | "chem-buffer"
  // Matemática
  | "math-derivative"
  | "math-taylor"
  | "math-fourier"
  | "math-newton-raphson"
  | "math-logistic"
  | "math-eigen"
  | "math-riemann"
  | "math-vectorfield"
  | "math-distribution"
  | "math-conic"
  // Ingeniería
  | "eng-pid"
  | "eng-bode"
  | "eng-beam"
  | "eng-heat"
  | "eng-rankine"
  | "eng-queue"
  | "eng-rlc"
  | "eng-moody"
  | "eng-thevenin";

export interface Section {
  id: string;          // slug-friendly, único dentro del artículo
  title: string;
  body: string;        // markdown con $...$ y $$...$$
  widget?: WidgetKey;  // gráfica/simulación interactiva opcional
  keywords?: string[]; // términos para el buscador
}

export interface Article {
  slug: string;
  title: string;
  category: Category;
  level: "introductorio" | "intermedio" | "avanzado";
  readingMinutes: number;
  summary: string;
  sections: Section[];
}

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string; tone: "primary" | "accent" | "success" | "warn" }
> = {
  fisica: {
    label: "Física",
    description: "Mecánica, ondas, electromagnetismo, termodinámica, óptica.",
    tone: "primary",
  },
  quimica: {
    label: "Química",
    description: "Estructura atómica, reacciones, equilibrio, cinética, ácido-base.",
    tone: "accent",
  },
  matematica: {
    label: "Matemática",
    description: "Cálculo, álgebra lineal, EDO, análisis de Fourier, métodos numéricos.",
    tone: "success",
  },
  ingenieria: {
    label: "Ingeniería",
    description: "Control, señales, mecánica de materiales, transferencia de calor, sistemas.",
    tone: "warn",
  },
};

import { PHYSICS_ARTICLES } from "./articles/fisica";
import { CHEMISTRY_ARTICLES } from "./articles/quimica";
import { MATH_ARTICLES } from "./articles/matematica";
import { ENGINEERING_ARTICLES } from "./articles/ingenieria";

export const ARTICLES: Article[] = [
  ...PHYSICS_ARTICLES,
  ...CHEMISTRY_ARTICLES,
  ...MATH_ARTICLES,
  ...ENGINEERING_ARTICLES,
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCategory(cat: Category): Article[] {
  return ARTICLES.filter((a) => a.category === cat);
}

/** Índice plano para el buscador: una entrada por sección. */
export interface SearchEntry {
  articleSlug: string;
  articleTitle: string;
  category: Category;
  sectionId: string;
  sectionTitle: string;
  excerpt: string;     // primeras ~200 chars del cuerpo, sin sintaxis
  keywords: string[];
}

export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const a of ARTICLES) {
    for (const s of a.sections) {
      out.push({
        articleSlug: a.slug,
        articleTitle: a.title,
        category: a.category,
        sectionId: s.id,
        sectionTitle: s.title,
        excerpt: stripMd(s.body).slice(0, 220),
        keywords: s.keywords ?? [],
      });
    }
  }
  return out;
}

function stripMd(s: string): string {
  return s
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+\$/g, " ")
    .replace(/[#>*_`|\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
