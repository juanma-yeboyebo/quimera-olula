import { abrirCajonCarrito } from "../comun/cajon_carrito_store.ts";
import { mostrarAviso } from "../comun/avisos_store.ts";
import { asegurarCarrito, olvidarCarrito, recargarCarrito } from "../comun/carrito_store.ts";
import { postLineaCarrito } from "./infraestructura.ts";

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

export const textoErrorAnadir = (e: unknown): string =>
    (e as { descripcion?: string })?.descripcion ?? "No se ha podido añadir al carrito";

export const anadirLineaAlCarrito = async (referencia: string, cantidad: number): Promise<void> => {
    const enviar = async () => {
        const token = await asegurarCarrito();
        await postLineaCarrito(token, referencia, cantidad);
    };

    try {
        await enviar();
    } catch (e) {
        if (estadoDe(e) !== 404 && estadoDe(e) !== 409) throw e;
        olvidarCarrito();
        await enviar();
    }

    await recargarCarrito().catch(() => undefined);
};

export const avisarAnadido = (nombre: string) => {
    mostrarAviso({
        texto: `${nombre} añadido al carrito`,
        tipo: "ok",
        accion: { texto: "Ver carrito", onClick: abrirCajonCarrito },
    });
};

export const avisarErrorAnadir = (e: unknown) => {
    mostrarAviso({ texto: textoErrorAnadir(e), tipo: "error" });
};

export const anadirRapido = async (referencia: string, nombre: string): Promise<void> => {
    try {
        await anadirLineaAlCarrito(referencia, 1);
        avisarAnadido(nombre);
    } catch (e) {
        avisarErrorAnadir(e);
    }
};
