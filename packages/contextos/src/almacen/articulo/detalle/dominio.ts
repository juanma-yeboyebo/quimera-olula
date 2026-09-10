import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, publicar } from "@olula/lib/dominio.js";
import { MetaModelo, puede, stringNoVacio } from "@olula/lib/dominio.ts";
import { Articulo, CambiosArticulo } from "../diseño.ts";
import { getArticulo, patchArticulo } from "../infraestructura.ts";
import { ContextoArticulo, EstadoArticulo } from "./diseño.ts";

type ProcesarArticulo = ProcesarContexto<EstadoArticulo, ContextoArticulo>;

const pipeArticulo = ejecutarListaProcesos<EstadoArticulo, ContextoArticulo>;

export const articuloVacio = (): Articulo => ({
    id: "",
    descripcion: "",
    observaciones: "",
    codbarras: "",
    tipoCodBarras: "",
    noStock: false,
    seCompra: false,
    seVende: false,
});

const camposEditables = [
    "descripcion",
    "observaciones",
    "codbarras",
    "tipoCodBarras",
    "noStock",
] as const;

export const cambiosArticulo = (anterior: Articulo, nuevo: Articulo): CambiosArticulo =>
    Object.fromEntries(
        camposEditables
            .filter((campo) => anterior[campo] !== nuevo[campo])
            .map((campo) => [campo, nuevo[campo]])
    );

export const metaArticulo: MetaModelo<Articulo> = {
    campos: {
        descripcion: {
            requerido: true,
            validacion: (m: Articulo) => stringNoVacio(m.descripcion),
        },
        observaciones: { requerido: false, tipo: "texto" },
        codbarras: { requerido: false },
        tipoCodBarras: { requerido: false },
        noStock: { tipo: "checkbox" },
    },
    editable: () => puede("almacen.articulo"),
};

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

export const guardarArticulo = async (
    ctx: ContextoArticulo,
    articulo: Articulo
): Promise<void> => {
    const cambios = cambiosArticulo(ctx.articulo, articulo);
    if (!Object.keys(cambios).length) return;

    await patchArticulo(ctx.articulo.id, cambios);
};

export const refrescarArticulo: ProcesarArticulo = async (ctx) => {
    const articulo = await getArticulo(ctx.articulo.id);

    return [{ ...ctx, articulo }, [["articulo_cambiado", articulo]]];
};

export const alternarVenta: ProcesarArticulo = async (ctx) => {
    await patchArticulo(ctx.articulo.id, { seVende: !ctx.articulo.seVende });

    return refrescarArticulo(ctx);
};

export const alternarCompra: ProcesarArticulo = async (ctx) => {
    await patchArticulo(ctx.articulo.id, { seCompra: !ctx.articulo.seCompra });

    return refrescarArticulo(ctx);
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
