import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { abrirCajonCarrito } from "../../comun/cajon_carrito_store.ts";
import { asegurarCarrito, olvidarCarrito, recargarCarrito } from "../../comun/carrito_store.ts";
import { limitarCantidad } from "../dominio.ts";
import { getProducto, postLineaCarrito } from "../infraestructura.ts";
import { ContextoFicha, EstadoFicha } from "./diseño.ts";

type ProcesarFicha = ProcesarContexto<EstadoFicha, ContextoFicha>;

export const contextoFichaInicial: ContextoFicha = {
    estado: "CARGANDO",
    ficha: null,
    cantidad: 1,
    aviso: null,
    error: null,
};

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

const textoDe = (e: unknown): string =>
    (e as { descripcion?: string })?.descripcion ?? "No se ha podido añadir al carrito";

export const cargarContexto: ProcesarFicha = async (_contexto, payload) => {
    try {
        const ficha = await getProducto(payload as string);
        return { ...contextoFichaInicial, estado: "LISTO", ficha };
    } catch (e) {
        return {
            ...contextoFichaInicial,
            estado: estadoDe(e) === 404 ? "NO_ENCONTRADO" : "ERROR",
        };
    }
};

export const cambiarCantidad: ProcesarFicha = async (contexto, payload) => ({
    ...contexto,
    cantidad: contexto.ficha ? limitarCantidad(Number(payload) || 1, contexto.ficha) : contexto.cantidad,
    aviso: null,
    error: null,
});

export const anadirAlCarrito: ProcesarFicha = async (contexto) => {
    const ficha = contexto.ficha;
    if (!ficha) return { ...contexto, estado: "LISTO" };

    const enviar = async () => {
        const token = await asegurarCarrito();
        await postLineaCarrito(token, ficha.referencia, contexto.cantidad);
    };

    try {
        try {
            await enviar();
        } catch (e) {
            if (estadoDe(e) !== 404 && estadoDe(e) !== 409) throw e;
            olvidarCarrito();
            await enviar();
        }
    } catch (e) {
        return { ...contexto, estado: "LISTO", aviso: null, error: textoDe(e) };
    }

    await recargarCarrito().catch(() => undefined);
    abrirCajonCarrito();
    return { ...contexto, estado: "LISTO", aviso: "Añadido al carrito", error: null };
};
