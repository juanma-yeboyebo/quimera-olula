import { menuVentas } from "./menu.ts";
import { CrearLineaBase } from "./pedido/crear_linea/CrearLinea.tsx";
import { DetallePedidoBase } from "./pedido/detalle/DetallePedido.tsx";
import { LineasListaBase } from "./pedido/detalle/Lineas/LineasLista.tsx";
import { TabDatosBase as PedidoTabDatosBase } from "./pedido/detalle/TabDatos.tsx";
import { metaPedido } from "./pedido/detalle/dominio.ts";
import { EditarLineaBase } from "./pedido/editar_linea/EditarLinea.tsx";
import { ventasPedidoInfra } from "./pedido/infraestructura.ts";
import { payloadPatchPedido, pedidoDesdeAPI } from "./pedido/infraestructura_base.ts";
import { getMetaTablaPedido } from "./pedido/maestro/metatabla_pedido.tsx";

export class FactoryVentasOlula {

    static pedido_detalle_lineas_LineasLista = LineasListaBase
    static pedido_DetallePedido = DetallePedidoBase
    // static pedido_infraestructura_linea_desde_api = lineaPedidoDesdeApi
    static pedido_infraestructura = ventasPedidoInfra
    static pedido_CrearLinea = CrearLineaBase
    static pedido_EditarLinea = EditarLineaBase


    static PedidoTabDatos = PedidoTabDatosBase
    static pedidoDesdeAPI = pedidoDesdeAPI
    static metaTablaPedido = getMetaTablaPedido
    static api_payloadPatchPedido = payloadPatchPedido
    static metaPedido = metaPedido
    static menu: Record<string, { icono?: string; url?: string; regla?: string }> = menuVentas
}
