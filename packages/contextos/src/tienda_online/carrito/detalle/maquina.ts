import { Maquina } from "@olula/lib/diseño.ts";
import { borrarLinea, cambiarCantidad } from "./detalle.ts";
import { ContextoDetalleCarrito, EstadoDetalleCarrito } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleCarrito, ContextoDetalleCarrito> = () => ({
    LISTO: {
        cantidad_cambiada: ["ACTUALIZANDO", cambiarCantidad],
        linea_borrada: ["ACTUALIZANDO", borrarLinea],
    },
    ACTUALIZANDO: {},
});
