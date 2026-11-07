import { RestAPI } from "@olula/lib/api/rest_api.ts";
import {
    CarritoTienda,
    EstadoCarrito,
    ImagenLineaCarrito,
    LineaCarritoTienda,
    StoreView,
    WebsiteTienda,
} from "./diseño.ts";
import { codigoStoreViewActivo } from "./storeview.ts";
import TiendaOnline_Urls from "./urls.ts";

const urls = new TiendaOnline_Urls();

export interface StoreViewApi {
    codigo: string;
    nombre: string;
    idioma: string;
    url_base: string;
    website: WebsiteTienda;
}

export interface LineaCarritoApi {
    id: number;
    referencia: string;
    slug: string;
    descripcion: string;
    imagen: ImagenLineaCarrito | null;
    cantidad: number;
    precio: number;
    dto_porcentual: number;
    tipo_iva: number;
    iva_incluido: boolean;
    importe: number;
}

export interface CarritoApi {
    token: string;
    estado: EstadoCarrito;
    divisa: string;
    neto: number;
    total_iva: number;
    total: number;
    unidades: number;
    datos_checkout: Record<string, unknown> | null;
    lineas: LineaCarritoApi[];
    documento: Record<string, unknown> | null;
}

export const cabecerasTienda = (
    codigoStoreView: string,
    tokenCarrito?: string,
): Record<string, string> => ({
    "X-Store-View": codigoStoreView,
    ...(tokenCarrito ? { "X-Carrito-Token": tokenCarrito } : {}),
});

const cabecerasActivas = (): Record<string, string> =>
    cabecerasTienda(codigoStoreViewActivo() ?? "");

export const storeViewDesdeApi = (s: StoreViewApi): StoreView => ({
    codigo: s.codigo,
    nombre: s.nombre,
    idioma: s.idioma,
    urlBase: s.url_base,
    website: s.website,
});

const lineaDesdeApi = (l: LineaCarritoApi): LineaCarritoTienda => ({
    id: l.id,
    referencia: l.referencia,
    slug: l.slug,
    descripcion: l.descripcion,
    imagen: l.imagen,
    cantidad: l.cantidad,
    precio: l.precio,
    dtoPorcentual: l.dto_porcentual,
    tipoIva: l.tipo_iva,
    ivaIncluido: l.iva_incluido,
    importe: l.importe,
});

export const carritoDesdeApi = (c: CarritoApi): CarritoTienda => ({
    token: c.token,
    estado: c.estado,
    divisa: c.divisa,
    neto: c.neto,
    totalIva: c.total_iva,
    total: c.total,
    unidades: c.unidades,
    datosCheckout: c.datos_checkout,
    lineas: c.lineas.map(lineaDesdeApi),
    documento: c.documento,
});

export const getStoreView = async (codigo: string): Promise<StoreView> => {
    const respuesta = await RestAPI.get<{ datos: StoreViewApi }>(
        `${urls.STOREVIEW}/${codigo}`,
        "Error al cargar la tienda",
        cabecerasTienda(codigo),
    );
    return storeViewDesdeApi(respuesta.datos);
};

export const getCarrito = async (token: string): Promise<CarritoTienda> => {
    const respuesta = await RestAPI.get<{ datos: CarritoApi }>(
        `${urls.CARRITO}/${token}`,
        "Error al cargar el carrito",
        cabecerasActivas(),
    );
    return carritoDesdeApi(respuesta.datos);
};

export const postCarrito = async (): Promise<string> => {
    const respuesta = await RestAPI.post(
        urls.CARRITO,
        {},
        "Error al crear el carrito",
        cabecerasActivas(),
    );
    return (respuesta as unknown as { token: string }).token;
};
