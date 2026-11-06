import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { obtenerToken } from "../comun/carrito_store.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import {
    CategoriaTienda,
    FiltrosCatalogo,
    ItemCatalogoApi,
    NodoCategoriaApi,
    ProductoCatalogo,
} from "./diseño.ts";
import { criteriaCatalogo } from "./dominio.ts";

const baseUrl = "/public/tienda_online";

export const productoCatalogoDesdeApi = (i: ItemCatalogoApi): ProductoCatalogo => ({
    referencia: i.referencia,
    slug: i.slug,
    descripcion: i.descripcion,
    descripcionCorta: i.descripcion_corta,
    imagen: i.imagen,
    destacado: i.destacado,
    disponible: i.disponible,
    sinControlStock: i.sin_control_stock,
    precio: i.precio,
    precioConIva: i.precio_con_iva,
    tipoIva: i.tipo_iva,
    divisa: i.divisa,
    ivaIncluido: i.iva_incluido,
});

export const categoriaDesdeApi = (n: NodoCategoriaApi): CategoriaTienda => ({
    id: n.id,
    nombre: n.nombre,
    slug: n.slug,
    hijas: n.hijas.map(categoriaDesdeApi),
});

export const getCatalogo = async (
    filtros: FiltrosCatalogo,
    pagina: number,
): Promise<{ productos: ProductoCatalogo[]; total: number }> => {
    const { filtro, orden, paginacion } = criteriaCatalogo(filtros, pagina);
    const respuesta = await RestAPI.get<{ datos: ItemCatalogoApi[]; total: number }>(
        `${baseUrl}/catalogo${criteriaQuery(filtro, orden, paginacion)}`,
        "Error al cargar el catálogo",
        cabecerasTienda(codigoStoreViewActivo() ?? "", obtenerToken() ?? undefined),
    );
    return {
        productos: respuesta.datos.map(productoCatalogoDesdeApi),
        total: respuesta.total,
    };
};

export const getCategorias = async (): Promise<CategoriaTienda[]> => {
    const respuesta = await RestAPI.get<{ datos: NodoCategoriaApi[] }>(
        `${baseUrl}/categoria`,
        "Error al cargar las categorías",
        cabecerasTienda(codigoStoreViewActivo() ?? ""),
    );
    return respuesta.datos.map(categoriaDesdeApi);
};
