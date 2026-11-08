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
