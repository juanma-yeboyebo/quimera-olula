import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { obtenerToken } from "../comun/carrito_store.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import { FichaProducto, FichaProductoApi } from "./diseño.ts";

const baseUrl = "/public/tienda_online";

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
        `${baseUrl}/producto/${slug}`,
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
        `${baseUrl}/carrito/${token}/linea`,
        { articulo_id: referencia, cantidad },
        "Error al añadir al carrito",
        cabecerasTienda(codigoStoreViewActivo() ?? ""),
    );
    return (respuesta as unknown as { id: number }).id;
};
