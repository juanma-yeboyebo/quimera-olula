import { FactoryAuthOlula } from '#/auth/factory.ts';
import { menuTiendaAdmin } from '#/tienda_admin/menu.ts';
import { FactoryTiendaListaRegalos } from '#/tienda_lista_regalos/factory.ts';
import { menuVentas } from '#/ventas/menu.ts';
import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';
import { FactoryTpvDulceBebe } from './contextos/tpv/factory.ts';

class FactoryComponentesDulceBebe {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
}

class FactoryComunDulceBebe {
    static menu = {
        "Administración/Credenciales": { url: "/comun/credencial-externa", regla: "comun.credencial_externa" },
    };
}

class FactoryVentasDulceBebe {
    static menu = {
        "Ventas": menuVentas["Ventas"],
        "Ventas/Artículos": menuVentas["Ventas/Artículos"],
    };
}

class FactoryTiendaAdminDulceBebe {
    static menu = {
        "Tienda online": menuTiendaAdmin["Tienda online"],
        "Tienda online/Artículos web": menuTiendaAdmin["Tienda online/Artículos web"],
        "Tienda online/Categorías": menuTiendaAdmin["Tienda online/Categorías"],
        "Tienda online/Formas de pago": menuTiendaAdmin["Tienda online/Formas de pago"],
    };
}

export class FactoryDulceBebe {
    Auth = FactoryAuthOlula;
    Componentes = FactoryComponentesDulceBebe;
    TPV = FactoryTpvDulceBebe;
    Comun = FactoryComunDulceBebe;
    Ventas = FactoryVentasDulceBebe;
    TiendaAdmin = FactoryTiendaAdminDulceBebe;
    TiendaListaRegalos = FactoryTiendaListaRegalos;
}

export default FactoryDulceBebe;
