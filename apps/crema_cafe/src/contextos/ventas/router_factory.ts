import { MaestroConDetallePedido } from '#/ventas/pedido/maestro/MaestroConDetallePedido.tsx';

export class RouterFactoryVentasCremaCafe {
    static router = {
        "ventas/pedido": MaestroConDetallePedido,
        "ventas/pedido/:id": MaestroConDetallePedido,
    };
}
