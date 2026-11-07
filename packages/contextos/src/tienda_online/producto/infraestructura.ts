import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { obtenerToken } from "../comun/carrito_store.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";
import { CategoriaProducto, FichaProducto, ImagenProducto } from "./diseño.ts";

const urls = new TiendaOnline_Urls();

export interface FichaProductoApi {
    referencia: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string | null;
    descripcion_larga: string | null;
    meta_titulo: string | null;
    meta_descripcion: string | null;
    imagenes: ImagenProducto[];
    categorias: CategoriaProducto[];
    disponible: boolean;
    cantidad_disponible: number;
    sin_control_stock: boolean;
    precio: number;
    precio_con_iva: number;
    tipo_iva: number;
    divisa: string;
    iva_incluido: boolean;
}

export const fichaDesdeApi = (p: FichaProductoApi): FichaProducto => ({
    referencia: p.referencia,
    slug: p.slug,
    descripcion: p.descripcion,
    descripcionCorta: p.descripcion_corta,
    descripcionLarga: p.descripcion_larga,
    metaTitulo: p.meta_titulo,
    metaDescripcion: p.meta_descripcion,
    imagenes: p.imagenes,
    categorias: p.categorias,
    disponible: p.disponible,
    cantidadDisponible: p.cantidad_disponible,
    sinControlStock: p.sin_control_stock,
    precio: p.precio,
    precioConIva: p.precio_con_iva,
    tipoIva: p.tipo_iva,
    divisa: p.divisa,
    ivaIncluido: p.iva_incluido,
});

export const getProducto = async (slug: string): Promise<FichaProducto> => {
    const respuesta = await RestAPI.get<{ datos: FichaProductoApi }>(
        `${urls.PRODUCTO}/${slug}`,
        "Error al cargar el producto",
        cabecerasTienda(codigoStoreViewActivo() ?? "", obtenerToken() ?? undefined),
    );
    return fichaDesdeApi(respuesta.datos);
};

export const postLineaCarrito = async (
    token: string,
    referencia: string,
    cantidad: number,
): Promise<number> => {
    const respuesta = await RestAPI.post(
        `${urls.CARRITO}/${token}/linea`,
        { articulo_id: referencia, cantidad },
        "Error al añadir al carrito",
        cabecerasTienda(codigoStoreViewActivo() ?? ""),
    );
    return (respuesta as unknown as { id: number }).id;
};
