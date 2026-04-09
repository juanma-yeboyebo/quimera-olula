import { FactoryVentasOlula } from '#/ventas/factory.ts';

export class FactoryVentasCremaCafe extends FactoryVentasOlula {
    static override menu = {
        "Ventas": { icono: "fichero" },
        "Ventas/Pedidos": { url: "/ventas/pedido", regla: "ventas.pedido.leer" },
    };
}
