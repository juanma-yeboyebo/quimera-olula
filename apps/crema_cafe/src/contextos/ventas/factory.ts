import { FactoryVentasOlula } from '#/ventas/factory.ts';

export class FactoryVentasCremaCafe extends FactoryVentasOlula {
    static override menu = {
        "Ventas": { icono: "fichero" },
    };
}
