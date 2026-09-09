import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, publicar } from "@olula/lib/dominio.js";
import { Articulo } from "../diseño.ts";
import { getArticulo } from "../infraestructura.ts";
import { ContextoArticulo, EstadoArticulo } from "./diseño.ts";

type ProcesarArticulo = ProcesarContexto<EstadoArticulo, ContextoArticulo>;

const pipeArticulo = ejecutarListaProcesos<EstadoArticulo, ContextoArticulo>;

export const articuloVacio = (): Articulo => ({
    id: "",
    descripcion: "",
    observaciones: "",
    noStock: false,
    seCompra: false,
    seVende: false,
});

export const contextoArticuloInicial: ContextoArticulo = {
    estado: "INICIAL",
    articulo: articuloVacio(),
};

export const getContextoVacio: ProcesarArticulo = async (ctx) => ({
    ...ctx,
    estado: "INICIAL",
    articulo: articuloVacio(),
});

export const cargarContexto: ProcesarArticulo = async (ctx, payload) => {
    const id = payload as string;
    if (!id) return getContextoVacio(ctx);

    const articulo = await getArticulo(id);

    return { ...ctx, estado: "ABIERTO", articulo };
};

export const borrarArticulo: ProcesarArticulo = async (ctx, payload) => {
    const { articuloId } = (payload as { articuloId: string }) ?? {
        articuloId: ctx.articulo.id,
    };

    return pipeArticulo(ctx, [
        getContextoVacio,
        publicar("articulo_borrado", articuloId),
    ]);
};
