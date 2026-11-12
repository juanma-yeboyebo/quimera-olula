import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { cabecerasTienda } from "#/tienda_online/comun/infraestructura.ts";
import { codigoStoreViewActivo } from "#/tienda_online/comun/storeview.ts";
import { ImagenProducto } from "#/tienda_online/producto/diseño.ts";
import {
    FichaLineaLista,
    ImagenLineaLista,
    LineaListaRegalos,
    ListaRegalosPublica,
} from "./diseño.ts";

const URL_LISTA = "/public/tienda_lista_regalos/lista";

export interface LineaListaApi {
    id: number;
    referencia: string;
    descripcion: string | null;
    imagen: ImagenLineaLista | null;
    precio: number;
    divisa: string;
    cantidad: number;
    vendida: number;
    pendiente: number;
}

export interface ListaApi {
    nombre: string;
    descripcion: string | null;
    lineas: LineaListaApi[];
}

export interface FichaLineaListaApi extends LineaListaApi {
    descripcion_corta: string | null;
    descripcion_larga: string | null;
    meta_titulo: string | null;
    meta_descripcion: string | null;
    imagenes: ImagenProducto[];
}

const cabeceras = (): Record<string, string> => cabecerasTienda(codigoStoreViewActivo() ?? "");

export const lineaDesdeApi = (l: LineaListaApi): LineaListaRegalos => ({
    id: l.id,
    referencia: l.referencia,
    descripcion: l.descripcion ?? l.referencia,
    imagen: l.imagen,
    precio: l.precio,
    divisa: l.divisa,
    cantidad: l.cantidad,
    vendida: l.vendida,
    pendiente: l.pendiente,
});

export const listaDesdeApi = (l: ListaApi): ListaRegalosPublica => ({
    nombre: l.nombre,
    descripcion: l.descripcion,
    lineas: l.lineas.map(lineaDesdeApi),
});

export const fichaLineaDesdeApi = (f: FichaLineaListaApi): FichaLineaLista => ({
    ...lineaDesdeApi(f),
    descripcionCorta: f.descripcion_corta,
    descripcionLarga: f.descripcion_larga,
    metaTitulo: f.meta_titulo,
    metaDescripcion: f.meta_descripcion,
    imagenes: f.imagenes,
});

export const getListaRegalos = async (token: string): Promise<ListaRegalosPublica> => {
    const respuesta = await RestAPI.get<{ datos: ListaApi }>(
        `${URL_LISTA}/${token}`,
        "Error al cargar la lista",
        cabeceras(),
    );
    return listaDesdeApi(respuesta.datos);
};

export const getLineaListaRegalos = async (
    token: string,
    idLinea: string,
): Promise<FichaLineaLista> => {
    const respuesta = await RestAPI.get<{ datos: FichaLineaListaApi }>(
        `${URL_LISTA}/${token}/linea/${idLinea}`,
        "Error al cargar el producto",
        cabeceras(),
    );
    return fichaLineaDesdeApi(respuesta.datos);
};

export const postLigarCarrito = async (token: string, tokenCarrito: string): Promise<void> => {
    await RestAPI.post(
        `${URL_LISTA}/${token}/carrito/${tokenCarrito}`,
        {},
        "Error al ligar el carrito a la lista",
        cabeceras(),
    );
};
