import { CarritoTienda } from "../comun/diseño.ts";

export const estaVacio = (carrito: CarritoTienda | null): boolean =>
    !carrito || carrito.lineas.length === 0;

export const hayPagoIniciado = (carrito: CarritoTienda | null): boolean =>
    carrito?.estado === "PAGO_PENDIENTE";

export const progresoEnvioGratis = (
    total: number,
    umbral: number,
): { falta: number; porcentaje: number } => {
    if (umbral <= 0) return { falta: 0, porcentaje: 100 };
    return {
        falta: Math.max(0, umbral - total),
        porcentaje: Math.min(100, Math.max(0, (total / umbral) * 100)),
    };
};
