import { FactoryAuthOlula } from "#/auth/factory.ts";
import { FactoryAlmacenLegacy } from "./contextos/almacen/factory.ts";
import { FactoryInformesLegacy } from "./contextos/informes/factory.ts";
import { FactorySmartsalesLegacy } from "./contextos/smartsales/factory.ts";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";

export class FactoryLegacy {
    Almacen = FactoryAlmacenLegacy;
    Ventas = FactoryVentasLegacy;
    Informes = FactoryInformesLegacy;
    Smartsales = FactorySmartsalesLegacy;
    Auth = FactoryAuthOlula;
}

export default FactoryLegacy;