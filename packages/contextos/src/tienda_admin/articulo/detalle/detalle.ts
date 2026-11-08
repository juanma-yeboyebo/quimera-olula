import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { getArbolCategorias } from "../../categoria/infraestructura.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import { resumenDeArticulo } from "../dominio.ts";
import { getArticulo } from "../infraestructura.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo, PayloadCargaArticulo } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleArticulo, ContextoDetalleArticulo>;

export const articuloVacio: ArticuloWebDetalle = {
    id: "",
    referencia: "",
    descripcion: "",
    precio: 0,
    descripcionCorta: "",
    descripcionLarga: "",
    metaTitulo: "",
    metaDescripcion: "",
    publicaciones: [],
    imagenes: [],
    categorias: [],
};

export const contextoDetalleArticuloInicial: ContextoDetalleArticulo = {
    estado: "INICIAL",
    articulo: articuloVacio,
    websiteId: null,
    arbol: [],
};

export const vaciarContexto: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: "INICIAL",
    articulo: articuloVacio,
    arbol: [],
});

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const { id, websiteId } = (payload ?? { websiteId: null }) as PayloadCargaArticulo;
    if (!id) return vaciarContexto({ ...contexto, websiteId });
    const [articulo, arbol] = await Promise.all([
        getArticulo(id),
        websiteId === null ? Promise.resolve([]) : getArbolCategorias(websiteId),
    ]);
    return { ...contexto, estado: "ABIERTO", articulo, websiteId, arbol };
};

export const refrescarArticulo: ProcesarDetalle = async (contexto) => {
    const articulo = await getArticulo(contexto.articulo.id);
    return [
        { ...contexto, articulo },
        [["articulo_cambiado", resumenDeArticulo(articulo, contexto.websiteId)]],
    ];
};
