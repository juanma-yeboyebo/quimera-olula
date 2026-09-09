import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import {
    accionesListaEntidades,
    listaEntidadesInicial,
    ProcesarListaEntidades,
} from "@olula/lib/ListaEntidades.ts";
import { ArticuloProveedor } from "../../articulo_proveedor/diseño.ts";
import {
    getProveedoresDeArticulo,
    marcarPorDefecto,
} from "../../articulo_proveedor/infraestructura.ts";
import { Articulo, CambiosArticulo } from "../diseño.ts";
import { articuloVacio } from "../dominio.ts";
import { getArticulo, patchArticulo } from "../infraestructura.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleArticulo, ContextoDetalleArticulo>;

const conPrecios = (fn: ProcesarListaEntidades<ArticuloProveedor>) =>
    (ctx: ContextoDetalleArticulo) => ({ ...ctx, precios: fn(ctx.precios) });

export const Precios = accionesListaEntidades(conPrecios);

const camposEditables = ["descripcion", "observaciones", "grupoIvaProductoId"] as const;

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
        grupoIvaProductoId: { requerido: false },
    },
};

export const contextoDetalleArticuloInicial: ContextoDetalleArticulo = {
    estado: 'INICIAL',
    articulo: articuloVacio(),
    precios: listaEntidadesInicial<ArticuloProveedor>(),
};

export const limpiarContexto: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: 'INICIAL',
    articulo: articuloVacio(),
    precios: listaEntidadesInicial<ArticuloProveedor>(),
});

export const refrescarPrecios: ProcesarDetalle = async (contexto) => {
    const resultado = await getProveedoresDeArticulo(contexto.articulo.id);

    return Precios.recargar(contexto, resultado);
};

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    if (!id) return limpiarContexto(contexto);

    const articulo = await getArticulo(id);

    return refrescarPrecios({ ...contexto, estado: 'ABIERTO', articulo });
};

export const guardarArticulo = async (
    contexto: ContextoDetalleArticulo,
    articulo: Articulo
): Promise<void> => {
    const cambios = cambiosArticulo(contexto.articulo, articulo);
    if (!Object.keys(cambios).length) return;

    await patchArticulo(contexto.articulo.id, cambios);
};

export const refrescarArticulo: ProcesarDetalle = async (contexto) => {
    const articulo = await getArticulo(contexto.articulo.id);

    return [{ ...contexto, articulo }, [["articulo_cambiado", articulo]]];
};

export const marcarPorDefectoProceso: ProcesarDetalle = async (contexto, payload) => {
    const id = (payload as string) ?? contexto.precios.activo?.id;
    if (!id) return contexto;

    await marcarPorDefecto(id);

    return refrescarPrecios(contexto);
};
