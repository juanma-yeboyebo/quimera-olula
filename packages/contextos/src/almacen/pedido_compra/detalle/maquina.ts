import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto } from "./detalle.ts";
import { ContextoDetallePedidoCompra, EstadoDetallePedidoCompra } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetallePedidoCompra, ContextoDetallePedidoCompra> = () => {
    return {
        INICIAL: {
            // Cuando llega un nuevo ID (por prop del maestro)
            pedido_id_cambiado: [cargarContexto],

            // Cuando se deselecciona desde el maestro
            pedido_deseleccionado: [
                publicar("pedido_deseleccionado", null),
            ],
        },

        ABIERTO: {
            // Cambio de ID: recarga el pedido
            pedido_id_cambiado: [cargarContexto],

            // Apertura del modal de creación de entrada
            crear_entrada_solicitado: "CREANDO_ENTRADA",

            // Apertura del diálogo de lectura de albarán
            leer_albaran_solicitado: "LEYENDO_ALBARAN",
        },

        CREANDO_ENTRADA: {
            // La entrada se creó correctamente: guarda el ID y muestra confirmación
            entrada_creada: async (ctx, payload) => ({
                ...ctx,
                estado: "ENTRADA_CREADA" as const,
                idOrdenCreada: payload as string,
            }),

            // El usuario canceló el modal
            crear_entrada_cancelado: "ABIERTO",
        },

        LEYENDO_ALBARAN: {
            // La foto se analizó correctamente: guarda las líneas detectadas y pasa a comparativa
            foto_analizada: async (ctx, payload) => ({
                ...ctx,
                estado: "COMPARANDO_ALBARAN" as const,
                lineasDetectadas: payload as import("../diseño.ts").LineaNuevaEntradaDesdePedido[],
            }),

            // El usuario canceló la lectura de albarán
            leer_albaran_cancelado: "ABIERTO",
        },

        COMPARANDO_ALBARAN: {
            // La entrada se creó correctamente desde la comparativa
            entrada_creada: async (ctx, payload) => ({
                ...ctx,
                estado: "ENTRADA_CREADA" as const,
                idOrdenCreada: payload as string,
            }),

            // El usuario canceló desde la comparativa
            leer_albaran_cancelado: "ABIERTO",
        },

        ENTRADA_CREADA: {
            // El usuario quiere ver la orden creada (la navegación la hace el componente)
            ver_orden: "ABIERTO",

            // El usuario cierra la confirmación sin navegar
            cerrar_confirmacion: "ABIERTO",
        },
    };
};
