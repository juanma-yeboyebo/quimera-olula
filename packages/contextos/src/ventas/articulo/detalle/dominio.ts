import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Articulo, CambiosArticulo } from "../diseño.ts";
import { articuloVacio } from "../dominio.ts";
import { getArticulo, patchArticulo } from "../infraestructura.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo } from "./diseño.ts";

export type ProcesarDetalleArticulo = ProcesarContexto<
    EstadoDetalleArticulo,
    ContextoDetalleArticulo
>;

const camposEditables = [
    "descripcion",
    "codbarras",
    "tipoCodBarras",
    "observaciones",
    "precio",
    "grupoIvaProductoId",
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
        codbarras: { requerido: false },
        tipoCodBarras: { requerido: false },
        observaciones: { requerido: false, tipo: "texto" },
        precio: { requerido: true, tipo: "moneda", decimales: 2 },
        grupoIvaProductoId: { requerido: false },
    },
};

export const contextoDetalleArticuloInicial: ContextoDetalleArticulo = {
    estado: "INICIAL",
    articulo: articuloVacio(),
};

export const getContextoVacio: ProcesarDetalleArticulo = async (contexto) => ({
    ...contexto,
    estado: "INICIAL",
    articulo: articuloVacio(),
});

export const cargarArticulo: ProcesarDetalleArticulo = async (contexto, payload) => {
    const id = payload as string;
    if (!id) return getContextoVacio(contexto);

    const articulo = await getArticulo(id);

    return { ...contexto, estado: "ABIERTO", articulo };
};

export const guardarArticulo = async (
    contexto: ContextoDetalleArticulo,
    articulo: Articulo
): Promise<void> => {
    const cambios = cambiosArticulo(contexto.articulo, articulo);
    if (!Object.keys(cambios).length) return;

    await patchArticulo(contexto.articulo.id, cambios);
};

export const refrescarArticulo: ProcesarDetalleArticulo = async (contexto) => {
    const articulo = await getArticulo(contexto.articulo.id);

    return [{ ...contexto, articulo }, [["articulo_cambiado", articulo]]];
};
