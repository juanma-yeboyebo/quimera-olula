export type EstadoCarrito = "LISTO" | "ACTUALIZANDO";

export type ContextoCarrito = {
    estado: EstadoCarrito;
    error: string | null;
};
