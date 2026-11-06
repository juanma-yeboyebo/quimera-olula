import { Maquina } from "@olula/lib/diseño.ts";
import { borrarLinea, cambiarCantidad } from "./detalle.ts";
import { ContextoCarrito, EstadoCarrito } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoCarrito, ContextoCarrito> = () => ({
    LISTO: {
        cantidad_cambiada: ["ACTUALIZANDO", cambiarCantidad],
        linea_borrada: ["ACTUALIZANDO", borrarLinea],
    },
    ACTUALIZANDO: {},
});
