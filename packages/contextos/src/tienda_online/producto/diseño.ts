export interface ImagenProducto {
    url: string;
    alt: string | null;
    principal: boolean;
}

export interface CategoriaProducto {
    id: number;
    nombre: string;
    slug: string;
}

export interface FichaProducto {
    referencia: string;
    slug: string;
    descripcion: string;
    descripcionCorta: string | null;
    descripcionLarga: string | null;
    metaTitulo: string | null;
    metaDescripcion: string | null;
    imagenes: ImagenProducto[];
    categorias: CategoriaProducto[];
    disponible: boolean;
    cantidadDisponible: number;
    sinControlStock: boolean;
    precio: number;
    precioConIva: number;
    tipoIva: number;
    divisa: string;
    ivaIncluido: boolean;
}

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
