import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoPedido, EstadoPedido } from "./diseño.ts";
import { cargarPedido } from "./pedido.ts";

export const getMaquina: () => Maquina<EstadoPedido, ContextoPedido> = () => ({
    CARGANDO: {
        id_cambiado: [cargarPedido],
    },
    LISTO: {
        id_cambiado: ["CARGANDO", cargarPedido],
    },
    NO_ENCONTRADO: {
        id_cambiado: ["CARGANDO", cargarPedido],
    },
    ERROR: {
        id_cambiado: ["CARGANDO", cargarPedido],
    },
});
