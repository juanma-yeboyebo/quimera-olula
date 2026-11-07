export type EstadoDetalleCarrito = "LISTO" | "ACTUALIZANDO";

export type ContextoDetalleCarrito = {
    estado: EstadoDetalleCarrito;
    error: string | null;
};
