import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { obtenerToken } from "../comun/carrito_store.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";
import {
    CategoriaTienda,
    FiltrosCatalogo,
    ImagenCatalogo,
    ProductoCatalogo,
} from "./diseño.ts";
import { criteriaCatalogo } from "./dominio.ts";

const urls = new TiendaOnline_Urls();

export interface ItemCatalogoApi {
    referencia: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string;
    imagen: ImagenCatalogo | null;
    destacado: boolean;
    disponible: boolean;
    sin_control_stock: boolean;
    precio: number;
    precio_con_iva: number;
    tipo_iva: number;
    divisa: string;
    iva_incluido: boolean;
}

export interface NodoCategoriaApi {
    id: number;
    nombre: string;
    slug: string;
    en_menu?: boolean;
    hijas: NodoCategoriaApi[];
}

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
    enMenu: n.en_menu ?? true,
    hijas: n.hijas.map(categoriaDesdeApi),
});

export const getCatalogo = async (
    filtros: FiltrosCatalogo,
    pagina: number,
): Promise<{ productos: ProductoCatalogo[]; total: number }> => {
    const { filtro, orden, paginacion } = criteriaCatalogo(filtros, pagina);
    const respuesta = await RestAPI.get<{ datos: ItemCatalogoApi[]; total: number }>(
        `${urls.CATALOGO}${criteriaQuery(filtro, orden, paginacion)}`,
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
        urls.CATEGORIA,
        "Error al cargar las categorías",
        cabecerasTienda(codigoStoreViewActivo() ?? ""),
    );
    return respuesta.datos.map(categoriaDesdeApi);
};
