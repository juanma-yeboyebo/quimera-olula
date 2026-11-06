import { olvidarCarrito } from "../../comun/carrito_store.ts";
import { CarritoTienda } from "../../comun/diseño.ts";
import { getCarrito } from "../../comun/infraestructura.ts";
import { ResultadoPago } from "../diseño.ts";
import { clavePagoEnCurso, resultadoPago } from "../dominio.ts";

export type ResultadoConsulta = {
    resultado: ResultadoPago;
    carrito: CarritoTienda | null;
};

export type OpcionesConsulta = {
    intervaloMs: number;
    maxMs: number;
    cancelado?: () => boolean;
};

const esperar = (ms: number) => new Promise<void>((resolver) => setTimeout(resolver, ms));

export const pasoConsulta = async (token: string): Promise<ResultadoConsulta> => {
    const carrito = await getCarrito(token);
    return { resultado: resultadoPago(carrito.estado), carrito };
};

export const consultarPago = async (
    token: string,
    { intervaloMs, maxMs, cancelado }: OpcionesConsulta,
): Promise<ResultadoConsulta> => {
    const inicio = Date.now();
    let ultimo: ResultadoConsulta = { resultado: "PENDIENTE", carrito: null };

    for (;;) {
        ultimo = await pasoConsulta(token).catch(() => ultimo);
        if (ultimo.resultado !== "PENDIENTE") return ultimo;
        const restante = maxMs - (Date.now() - inicio);
        if (restante <= 0 || cancelado?.()) return ultimo;
        await esperar(Math.min(intervaloMs, restante));
        if (cancelado?.()) return ultimo;
    }
};

export const cerrarPago = (codigoStoreView: string): void => {
    olvidarCarrito();
    sessionStorage.removeItem(clavePagoEnCurso(codigoStoreView));
};
