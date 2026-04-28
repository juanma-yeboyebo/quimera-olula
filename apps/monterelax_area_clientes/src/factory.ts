import { AccionesCabeceraMonterelax } from "./componentes/AccionesCabeceraMonterelax.tsx";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";

class FactoryComponentesMonterelax {
    static cabecera_acciones = AccionesCabeceraMonterelax;
}

export class FactoryLegacy {
    // Auth = FactoryAuthOlula;
    Componentes = FactoryComponentesMonterelax;
    Ventas = FactoryVentasLegacy;
}

export default FactoryLegacy;
