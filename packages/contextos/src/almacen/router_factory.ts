import { MaestroConDetalleAlmacen } from "./almacen/vistas/MaestroConDetalleAlmacen.tsx"
import { MaestroConDetalleCaja } from "./caja/vistas/MaestroConDetalleCaja.tsx"
import { MaestroConDetalleFamilia } from "./familia/vistas/MaestroConDetalleFamilia.tsx"
import { MaestroDetalleTransferenciasStock } from "./transferencias/vistas/MaestroDetalleTransferenciasStock.tsx"

export class RouterFactoryAlmacenOlula {
    static router = {
        "almacen/transferencias": MaestroDetalleTransferenciasStock,
        "almacen/almacenes": MaestroConDetalleAlmacen,
        "almacen/cajas": MaestroConDetalleCaja,
        "almacen/familias": MaestroConDetalleFamilia,
    }
}
