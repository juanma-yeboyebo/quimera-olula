import { FactoryVentasOlula } from "#/ventas/factory.ts"
import { menuVentas } from "./menu.ts"

export class FactoryVentasLegacy extends FactoryVentasOlula {
    static menu = menuVentas
}
