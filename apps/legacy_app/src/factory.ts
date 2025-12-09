import { FactoryOlula } from "@olula/olula/factory.ts";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";

export class FactoryLegacy extends FactoryOlula {
    Ventas = FactoryVentasLegacy
}

export default FactoryLegacy;