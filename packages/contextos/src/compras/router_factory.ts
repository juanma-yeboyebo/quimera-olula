import { MaestroConDetalleAlbaran } from "./albaran/maestro/MaestroConDetalleAlbaran.tsx";
import { MaestroConDetalleArticulo } from "./articulo/maestro/MaestroConDetalleArticulo.tsx";
import { MaestroConDetalleFactura } from "./factura/maestro/MaestroConDetalleFactura.tsx";
import { MaestroConDetallePedido } from "./pedido/maestro/MaestroConDetallePedido.tsx";
import { MaestroConDetalleProveedor } from "./proveedor/maestro/MaestroConDetalleProveedor.tsx";

export class RouterFactoryComprasOlula {
    static router = {
        "compras/pedido": MaestroConDetallePedido,
        "compras/albaran": MaestroConDetalleAlbaran,
        "compras/factura": MaestroConDetalleFactura,
        "compras/proveedor": MaestroConDetalleProveedor,
        "compras/articulo": MaestroConDetalleArticulo,
    };
}
