import { CarritoTienda } from "../comun/diseño.ts";

export const cantidadValida = (valor: unknown): boolean => {
    if (typeof valor === "number") return Number.isFinite(valor) && valor > 0;
    if (typeof valor !== "string") return false;
    const texto = valor.trim();
    if (texto === "") return false;
    const numero = Number(texto);
    return Number.isFinite(numero) && numero > 0;
};

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
