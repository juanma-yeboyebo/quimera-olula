import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { anadirLineaAlCarrito, avisarAnadido, textoErrorAnadir } from "../anadir.ts";
import { limitarCantidad } from "../dominio.ts";
import { getProducto } from "../infraestructura.ts";
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

    try {
        await anadirLineaAlCarrito(ficha.referencia, contexto.cantidad);
    } catch (e) {
        return { ...contexto, estado: "LISTO", aviso: null, error: textoErrorAnadir(e) };
    }

    avisarAnadido(ficha.descripcion);
    return { ...contexto, estado: "LISTO", aviso: "Añadido al carrito", error: null };
};
