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
