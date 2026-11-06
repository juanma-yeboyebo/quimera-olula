export type OrdenCatalogo = "relevancia" | "precio_asc" | "precio_desc" | "nombre";

export interface ImagenCatalogo {
    url: string;
    alt: string | null;
}

export interface ProductoCatalogo {
    referencia: string;
    slug: string;
    descripcion: string;
    descripcionCorta: string;
    imagen: ImagenCatalogo | null;
    destacado: boolean;
    disponible: boolean;
    sinControlStock: boolean;
    precio: number;
    precioConIva: number;
    tipoIva: number;
    divisa: string;
    ivaIncluido: boolean;
}

export interface CategoriaTienda {
    id: number;
    nombre: string;
    slug: string;
    hijas: CategoriaTienda[];
}

export interface FiltrosCatalogo {
    texto: string;
    categoria: string | null;
    soloDestacados: boolean;
    orden: OrdenCatalogo;
}

export type EstadoCatalogo = "CARGANDO" | "LISTO" | "ERROR";

export type ContextoCatalogo = {
    estado: EstadoCatalogo;
    productos: ProductoCatalogo[];
    total: number;
    pagina: number;
    filtros: FiltrosCatalogo;
};

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
    hijas: NodoCategoriaApi[];
}
