import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos } from "@olula/lib/dominio.ts";
import { pedidoCompraVacio } from "../dominio.ts";
import { getPedido } from "../infraestructura.ts";
import { ContextoDetallePedidoCompra, EstadoDetallePedidoCompra } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetallePedidoCompra, ContextoDetallePedidoCompra>;

const pipePedidoCompra = ejecutarListaProcesos<EstadoDetallePedidoCompra, ContextoDetallePedidoCompra>;

export const contextoDetallePedidoCompraInicial: ContextoDetallePedidoCompra = {
    estado: "INICIAL",
    pedido: pedidoCompraVacio,
    idOrdenCreada: "",
    lineasDetectadas: [],
};

/**
 * Carga el pedido desde la API y pasa a estado ABIERTO.
 * Se invoca cuando cambia el ID recibido por prop.
 */
export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    if (!id) {
        return { ...contexto, estado: "INICIAL", pedido: pedidoCompraVacio };
    }
    const pedido = await getPedido(id);
    return pipePedidoCompra(contexto, [
        async (ctx) => ({ ...ctx, pedido }),
        "ABIERTO",
    ]);
};
