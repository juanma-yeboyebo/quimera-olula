import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { obtenerToken, olvidarCarrito, recargarCarrito } from "../../comun/carrito_store.ts";
import { deleteLineaCarrito, patchLineaCarrito } from "../infraestructura.ts";
import { ContextoDetalleCarrito, EstadoDetalleCarrito } from "./diseño.ts";

type ProcesarCarrito = ProcesarContexto<EstadoDetalleCarrito, ContextoDetalleCarrito>;

const NO_DISPONIBLE = "Este carrito ya no está disponible";

export const contextoCarritoInicial: ContextoDetalleCarrito = { estado: "LISTO", error: null };

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

const textoDe = (e: unknown): string =>
    (e as { descripcion?: string })?.descripcion ?? "No se ha podido modificar el carrito";

const modificar = async (
    contexto: ContextoDetalleCarrito,
    accion: (token: string) => Promise<void>,
): Promise<ContextoDetalleCarrito> => {
    const token = obtenerToken();
    if (!token) return { ...contexto, estado: "LISTO", error: NO_DISPONIBLE };

    try {
        await accion(token);
    } catch (e) {
        if (estadoDe(e) === 404 || estadoDe(e) === 409) {
            olvidarCarrito();
            return { ...contexto, estado: "LISTO", error: NO_DISPONIBLE };
        }
        await recargarCarrito().catch(() => undefined);
        return { ...contexto, estado: "LISTO", error: textoDe(e) };
    }

    await recargarCarrito().catch(() => undefined);
    return { ...contexto, estado: "LISTO", error: null };
};

export const cambiarCantidad: ProcesarCarrito = async (contexto, payload) => {
    const { lineaId, cantidad } = payload as { lineaId: number; cantidad: number };
    return modificar(contexto, (token) => patchLineaCarrito(token, lineaId, cantidad));
};

export const borrarLinea: ProcesarCarrito = async (contexto, payload) => {
    const { lineaId } = payload as { lineaId: number };
    return modificar(contexto, (token) => deleteLineaCarrito(token, lineaId));
};
