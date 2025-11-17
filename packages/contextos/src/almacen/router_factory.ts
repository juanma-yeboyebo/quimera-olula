import { MaestroConDetalleAlmacen } from "./almacen/vistas/MaestroConDetalleAlmacen.tsx"
import { MaestroConDetalleArticulo } from "./articulo/vistas/MaestroConDetalleArticulo.tsx"
import { MaestroConDetalleCaja } from "./caja/vistas/MaestroConDetalleCaja.tsx"
import { MaestroConDetalleFamilia } from "./familia/vistas/MaestroConDetalleFamilia.tsx"
import { MaestroDetalleTransferenciasStock } from "./transferencias/vistas/MaestroDetalleTransferenciasStock.tsx"

export class RouterFactoryAlmacenOlula {
    static router = {
        "almacen/transferencias": MaestroDetalleTransferenciasStock,
        "almacen/articulo": MaestroConDetalleArticulo,
        "almacen/almacenes": MaestroConDetalleAlmacen,
        "almacen/cajas": MaestroConDetalleCaja,
        "almacen/familias": MaestroConDetalleFamilia,
    }
}
