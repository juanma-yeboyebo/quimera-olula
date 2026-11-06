import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { getPedido } from "../infraestructura.ts";
import { ContextoPedido, EstadoPedido } from "./diseño.ts";

export const contextoPedidoInicial: ContextoPedido = { estado: "CARGANDO", pedido: null };

export const cargarPedido: ProcesarContexto<EstadoPedido, ContextoPedido> = async (
    contexto,
    payload,
) => {
    try {
        const pedido = await getPedido(payload as string);
        return { ...contexto, estado: "LISTO", pedido };
    } catch (e) {
        if ((e as { estado?: number })?.estado === 404)
            return { ...contexto, estado: "NO_ENCONTRADO", pedido: null };
        return { ...contexto, estado: "ERROR", pedido: null };
    }
};
