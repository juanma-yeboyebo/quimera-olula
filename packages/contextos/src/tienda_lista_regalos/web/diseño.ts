import { ImagenProducto } from "#/tienda_online/producto/diseño.ts";

export interface ImagenLineaLista {
    url: string;
    alt: string | null;
}

export interface LineaListaRegalos {
    id: number;
    referencia: string;
    descripcion: string;
    imagen: ImagenLineaLista | null;
    precio: number;
    divisa: string;
    cantidad: number;
    vendida: number;
    pendiente: number;
}

export interface ListaRegalosPublica {
    nombre: string;
    descripcion: string | null;
    lineas: LineaListaRegalos[];
}

export interface FichaLineaLista extends LineaListaRegalos {
    descripcionCorta: string | null;
    descripcionLarga: string | null;
    metaTitulo: string | null;
    metaDescripcion: string | null;
    imagenes: ImagenProducto[];
}

export type ResultadoAnadirLista = "AÑADIDO" | "CARRITO_DE_OTRA_LISTA" | "ERROR";
