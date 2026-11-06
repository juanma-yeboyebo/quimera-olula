import { FichaProducto, ImagenProducto } from "./diseño.ts";

export const imagenInicial = (imagenes: ImagenProducto[]): ImagenProducto | null =>
    imagenes.find((i) => i.principal) ?? imagenes[0] ?? null;

export const estaDisponible = (ficha: FichaProducto): boolean =>
    ficha.disponible || ficha.sinControlStock;

export const limitarCantidad = (cantidad: number, ficha: FichaProducto): number => {
    const minima = Math.max(1, cantidad);
    return ficha.sinControlStock ? minima : Math.min(minima, ficha.cantidadDisponible);
};

export const metadatosFicha = (ficha: FichaProducto): { titulo: string; descripcion: string } => ({
    titulo: ficha.metaTitulo ?? ficha.descripcion,
    descripcion: ficha.metaDescripcion ?? ficha.descripcionCorta ?? "",
});
