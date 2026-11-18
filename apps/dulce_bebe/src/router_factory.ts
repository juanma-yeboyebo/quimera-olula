import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { MaestroConDetalleCredencialExterna } from '#/comun/credencial_externa/maestro/MaestroConDetalleCredencialExterna.tsx';
import { MaestroConDetalleArticuloWeb } from '#/tienda_admin/articulo/maestro/MaestroConDetalleArticuloWeb.tsx';
import { MaestroConDetalleCategoriaTiendaAdmin } from '#/tienda_admin/categoria/maestro/MaestroConDetalleCategoriaTiendaAdmin.tsx';
import { MaestroConDetalleFormaPago } from '#/tienda_admin/forma_pago/maestro/MaestroConDetalleFormaPago.tsx';
import { RouterFactoryTiendaListaRegalos } from '#/tienda_lista_regalos/router_factory.ts';
import { RouterFactoryTpvOlula } from '#/tpv/router_factory.ts';
import { MaestroConDetalleArticulo } from '#/ventas/articulo/MaestroConDetalleArticulo.tsx';
import { FondoInicio } from '@olula/componentes/plantilla/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

export class RouterFactoryDulceBebe {
    Inicio = { router: { "": FondoInicio } };
    Auth = RouterFactoryAuthOlula;
    Tpv = RouterFactoryTpvOlula;
    Comun = {
        router: {
            "comun/credencial-externa": MaestroConDetalleCredencialExterna,
            "comun/credencial-externa/:id": MaestroConDetalleCredencialExterna,
        },
    };
    Ventas = {
        router: {
            "ventas/articulo": MaestroConDetalleArticulo,
        },
    };
    TiendaAdmin = {
        router: {
            "tienda_admin/articulo": MaestroConDetalleArticuloWeb,
            "tienda_admin/categoria": MaestroConDetalleCategoriaTiendaAdmin,
            "tienda_admin/forma_pago": MaestroConDetalleFormaPago,
        },
    };
    TiendaListaRegalos = RouterFactoryTiendaListaRegalos;
}

export const router = crearRouter(new RouterFactoryDulceBebe() as unknown as Record<string, { router: RouteObject }>);
