import { FactoryVentasOlula } from "#/ventas/factory.ts";
import { menuVentas } from "./menu.ts";

// El módulo de venta TPV no pasa por esta fábrica (ver
// apps/elganso_stores/src/router_factory.ts): tiene su propio componente
// completo en contextos/tpv/venta/, sin slots inyectados.
export class FactoryVentasGanso extends FactoryVentasOlula {
    static menu = menuVentas;
}
