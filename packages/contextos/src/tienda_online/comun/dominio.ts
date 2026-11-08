import type { CategoriaTienda } from "../catalogo/diseño.ts";
import { EstadoCarrito } from "./diseño.ts";

export const codigoStoreViewDesdeEnv = (valor: string | undefined): string | null =>
    valor ? valor : null;

export const claveCarrito = (codigoStoreView: string): string =>
    `tienda_online.carrito.${codigoStoreView}`;

export const debeDescartarToken = (estado: EstadoCarrito): boolean =>
    estado === "PAGADO" || estado === "CONVERTIDO" || estado === "ERROR_CONVERSION";

export const textoAriaCarrito = (unidades: number): string =>
    `Carrito, ${unidades} artículos`;

export const formatearPrecio = (importe: number, divisa: string, idioma: string): string =>
    new Intl.NumberFormat(idioma, { style: "currency", currency: divisa }).format(importe);

export const hayMas = (cargados: number, total: number): boolean => cargados < total;

export const textoContador = (n: number): string | null =>
    n <= 0 ? null : n > 99 ? "99+" : String(n);

export const cantidadValida = (valor: unknown): boolean => {
    if (typeof valor === "number") return Number.isFinite(valor) && valor > 0;
    if (typeof valor !== "string") return false;
    const texto = valor.trim();
    if (texto === "") return false;
    const numero = Number(texto);
    return Number.isFinite(numero) && numero > 0;
};

export const limitarCantidad = (valor: number, minimo: number, maximo?: number): number => {
    const conMinimo = Math.max(valor, minimo);
    return maximo === undefined ? conMinimo : Math.min(conMinimo, maximo);
};

export const esRutaCheckout = (pathname: string): boolean =>
    pathname === "/checkout" || pathname.startsWith("/checkout/");

export const rutaBusqueda = (texto: string): string => {
    const limpio = texto.trim();
    return limpio ? `/catalogo?texto=${encodeURIComponent(limpio)}` : "/catalogo";
};

export const repartirMenu = (
    categorias: CategoriaTienda[],
    maxEnBarra: number,
    enBarraConTodas: number,
): { conTodas: boolean; enBarra: CategoriaTienda[] } =>
    categorias.length <= maxEnBarra
        ? { conTodas: false, enBarra: categorias }
        : { conTodas: true, enBarra: categorias.slice(0, enBarraConTodas) };

const MAX_NIETAS = 6;

export const contenidoMega = (
    categoria: CategoriaTienda,
): {
    columnas: { categoria: CategoriaTienda; nietas: CategoriaTienda[]; verMas: boolean }[];
    sueltas: CategoriaTienda[];
} => ({
    columnas: categoria.hijas
        .filter((h) => h.hijas.length > 0)
        .map((h) => ({
            categoria: h,
            nietas: h.hijas.slice(0, MAX_NIETAS),
            verMas: h.hijas.length > MAX_NIETAS,
        })),
    sueltas: categoria.hijas.filter((h) => h.hijas.length === 0),
});

export const nodoDeRuta = (arbol: CategoriaTienda[], ruta: string[]): CategoriaTienda | null => {
    let nivel = arbol;
    let nodo: CategoriaTienda | null = null;
    for (const slug of ruta) {
        nodo = nivel.find((c) => c.slug === slug) ?? null;
        if (!nodo) return null;
        nivel = nodo.hijas;
    }
    return nodo;
};
