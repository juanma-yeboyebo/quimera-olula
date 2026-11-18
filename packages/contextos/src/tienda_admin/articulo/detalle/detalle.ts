import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { getArbolCategorias } from "../../categoria/infraestructura.ts";
import { ArticuloWebDetalle, FotoNoSubida, ImagenArticulo } from "../diseño.ts";
import { motivoError, resumenDeArticulo } from "../dominio.ts";
import {
    getArticulo,
    patchImagenPrincipal,
    patchOrdenImagenes,
    postImagenArticulo,
} from "../infraestructura.ts";
import { ContextoDetalleArticulo, EstadoDetalleArticulo, PayloadCargaArticulo } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleArticulo, ContextoDetalleArticulo>;

export const articuloVacio: ArticuloWebDetalle = {
    id: "",
    referencia: "",
    descripcion: "",
    precio: 0,
    textos: {},
    idiomas: [],
    publicaciones: [],
    imagenes: [],
    categorias: [],
};

export const contextoDetalleArticuloInicial: ContextoDetalleArticulo = {
    estado: "INICIAL",
    articulo: articuloVacio,
    websiteId: null,
    arbol: [],
    fotoActiva: null,
    websitePublicacion: null,
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

export const activarPublicacion: ProcesarDetalle = async (contexto, payload) => ({
    ...contexto,
    estado: "PUBLICANDO",
    websitePublicacion: payload as number,
});

export const desactivarPublicacion: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: "ABIERTO",
    websitePublicacion: null,
});

export const activarFoto: ProcesarDetalle = async (contexto, payload) => ({
    ...contexto,
    estado: "BORRANDO_FOTO",
    fotoActiva: payload as ImagenArticulo,
});

export const desactivarFoto: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: "ABIERTO",
    fotoActiva: null,
});

export const ordenarFotos: ProcesarDetalle = async (contexto, payload) => {
    await patchOrdenImagenes(contexto.articulo.referencia, payload as number[]);
    return contexto;
};

export const marcarFotoPrincipal: ProcesarDetalle = async (contexto, payload) => {
    await patchImagenPrincipal(contexto.articulo.referencia, (payload as ImagenArticulo).id);
    return contexto;
};

export const subirFotos = async (
    referencia: string,
    ficheros: File[],
    alProgresar: (actual: number) => void,
): Promise<FotoNoSubida[]> => {
    const fallidas: FotoNoSubida[] = [];
    for (const [indice, fichero] of ficheros.entries()) {
        alProgresar(indice + 1);
        try {
            await postImagenArticulo(referencia, fichero);
        } catch (error) {
            fallidas.push({ nombre: fichero.name, motivo: motivoError(error) });
        }
    }
    return fallidas;
};
