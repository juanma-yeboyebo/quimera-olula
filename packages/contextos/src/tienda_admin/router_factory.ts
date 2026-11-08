import { MaestroConDetalleArticuloWeb } from "./articulo/maestro/MaestroConDetalleArticuloWeb.tsx";
import { MaestroConDetalleCategoriaTiendaAdmin } from "./categoria/maestro/MaestroConDetalleCategoriaTiendaAdmin.tsx";
import { ConfiguracionTiendaAdmin } from "./configuracion/maestro/ConfiguracionTiendaAdmin.tsx";
import { PedidoTiendaAdmin } from "./pedido/maestro/PedidoTiendaAdmin.tsx";

export class RouterFactoryTiendaAdmin {
    static router = {
        "tienda_admin/articulo": MaestroConDetalleArticuloWeb,
        "tienda_admin/categoria": MaestroConDetalleCategoriaTiendaAdmin,
        "tienda_admin/pedido": PedidoTiendaAdmin,
        "tienda_admin/configuracion": ConfiguracionTiendaAdmin,
    }
}
