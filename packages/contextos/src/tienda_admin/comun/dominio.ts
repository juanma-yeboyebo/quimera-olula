import { WebsiteAdmin, ConflictoApi } from "./diseño.ts";

export const SLUG_MAXIMO = 150;

const PATRON_SLUG = /^[a-z0-9]+(?:-+[a-z0-9]+)*$/;

export const errorSlug = (slug: string): string | null => {
    if (slug === "") return null;
    if (slug.length > SLUG_MAXIMO) return `Máximo ${SLUG_MAXIMO} caracteres`;
    if (slug.startsWith("-") || slug.endsWith("-")) return "No puede empezar ni acabar en guion";
    if (!PATRON_SLUG.test(slug)) return "Solo minúsculas sin acentos, números y guiones";
    return null;
};

export const slugValido = (slug: string): boolean => errorSlug(slug) === null;

export const errorLongitud = (valor: string, maximo: number): string | null =>
    valor.length > maximo ? `Máximo ${maximo} caracteres` : null;

export const textoContador = (valor: string, maximo?: number): string =>
    maximo === undefined ? `${valor.length}` : `${valor.length}/${maximo}`;

export const elegirWebsite = (
    websites: WebsiteAdmin[],
    actual: number | null,
): number | null => {
    const activos = websites.filter((w) => w.activo);
    if (actual !== null && activos.some((w) => w.id === actual)) return actual;
    return activos.length > 0 ? activos[0].id : null;
};

const textoDeDescripcion = (descripcion: unknown): string => {
    if (typeof descripcion !== "string") return "";
    try {
        const json = JSON.parse(descripcion) as Record<string, unknown>;
        const texto = json.detail ?? json.mensaje ?? json.descripcion ?? json.error;
        return typeof texto === "string" ? texto : descripcion;
    } catch {
        return descripcion;
    }
};

export const conflictoDeError = (error: unknown): ConflictoApi | null => {
    const e = error as { estado?: number; descripcion?: unknown; nombre?: string } | null;
    if (!e || e.estado !== 409) return null;
    const mensaje = textoDeDescripcion(e.descripcion) || e.nombre || "Conflicto con datos existentes";
    const minusculas = mensaje.toLowerCase();
    const campo = minusculas.includes("slug")
        ? "slug"
        : minusculas.includes("codigo") || minusculas.includes("código")
          ? "codigo"
          : null;
    return { campo, mensaje };
};
