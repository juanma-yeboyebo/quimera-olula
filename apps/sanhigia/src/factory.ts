import { FactoryAuthOlula } from "#/auth/factory.ts";
import { CabeceraSanhigia } from "./componentes/CabeceraSanhigia";
import { ExtraLogoSanhigia } from "./componentes/ExtraLogoSanhigia";
import { MenuUsuarioSanhigia } from "./componentes/MenuUsuarioSanhigia";
import { FactoryAlmacenLegacy } from "./contextos/almacen/factory.ts";
import { FactoryInformesLegacy } from "./contextos/informes/factory.ts";
import { menuUsuarioSanhigia } from "./contextos/menu";
import { procesarElementosSanhigia } from "./contextos/procesarMenuUsuario";
import { FactorySmartsalesLegacy } from "./contextos/smartsales/factory.ts";
import { FactoryVentasLegacy } from "./contextos/ventas/factory.ts";

class FactoryComponentesSanhigia {
    static cabecera = CabeceraSanhigia;
    // static cabecera_acciones = AccionesCabeceraSanhigia;
    static cabecera_menu_usuario = MenuUsuarioSanhigia;
    static cabecera_extra_logo = ExtraLogoSanhigia;
    static menu_usuario_elementos = menuUsuarioSanhigia;
    static menu_usuario_procesar_elementos = procesarElementosSanhigia;
}

export class FactoryLegacy {
    Almacen = FactoryAlmacenLegacy;
    Ventas = FactoryVentasLegacy;
    Informes = FactoryInformesLegacy;
    Smartsales = FactorySmartsalesLegacy;
    Auth = FactoryAuthOlula;
    Componentes = FactoryComponentesSanhigia;
}

export default FactoryLegacy;