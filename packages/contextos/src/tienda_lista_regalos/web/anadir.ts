import { asegurarCarrito, olvidarCarrito, recargarCarrito } from "#/tienda_online/comun/carrito_store.ts";
import { recordarOrigenCarrito } from "#/tienda_online/comun/origen_carrito.ts";
import { avisarAnadido, avisarErrorAnadir } from "#/tienda_online/producto/anadir.ts";
import { postLineaCarrito } from "#/tienda_online/producto/infraestructura.ts";
import { ResultadoAnadirLista } from "./diseño.ts";
import { rutaLista } from "./dominio.ts";
import { postLigarCarrito } from "./infraestructura.ts";

export class ErrorCarritoDeOtraLista extends Error {
    constructor(readonly descripcion?: string) {
        super(descripcion ?? "El carrito tiene artículos de otra lista");
    }
}

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

export const esCarritoDeOtraLista = (e: unknown): boolean => e instanceof ErrorCarritoDeOtraLista;

const ligar = async (token: string, tokenCarrito: string): Promise<void> => {
    try {
        await postLigarCarrito(token, tokenCarrito);
    } catch (e) {
        if (estadoDe(e) === 400)
            throw new ErrorCarritoDeOtraLista((e as { descripcion?: string })?.descripcion);
        throw e;
    }
};

export const anadirLineaDeLista = async (
    token: string,
    referencia: string,
    cantidad: number,
): Promise<void> => {
    const enviar = async (): Promise<string> => {
        const tokenCarrito = await asegurarCarrito();
        await ligar(token, tokenCarrito);
        await postLineaCarrito(tokenCarrito, referencia, cantidad);
        return tokenCarrito;
    };

    let tokenCarrito: string;
    try {
        tokenCarrito = await enviar();
    } catch (e) {
        if (estadoDe(e) !== 404 && estadoDe(e) !== 409) throw e;
        olvidarCarrito();
        tokenCarrito = await enviar();
    }

    recordarOrigenCarrito(tokenCarrito, { ruta: rutaLista(token), texto: "Volver a la lista" });

    await recargarCarrito().catch(() => undefined);
};

export const anadirDeLista = async (
    token: string,
    referencia: string,
    nombre: string,
    cantidad: number,
): Promise<ResultadoAnadirLista> => {
    try {
        await anadirLineaDeLista(token, referencia, cantidad);
    } catch (e) {
        if (esCarritoDeOtraLista(e)) return "CARRITO_DE_OTRA_LISTA";
        avisarErrorAnadir(e);
        return "ERROR";
    }
    avisarAnadido(nombre);
    return "AÑADIDO";
};

export const anadirEnCarritoNuevo = async (
    token: string,
    referencia: string,
    nombre: string,
    cantidad: number,
): Promise<ResultadoAnadirLista> => {
    olvidarCarrito();
    return anadirDeLista(token, referencia, nombre, cantidad);
};
