import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { RouterFactoryTiendaAdmin } from '#/tienda_admin/router_factory.ts';
import { FondoInicio } from '@olula/componentes/plantilla/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

export class RouterFactoryTiendaAdminPruebas {
    Inicio = { router: { "": FondoInicio } };
    Auth = RouterFactoryAuthOlula;
    TiendaAdmin = RouterFactoryTiendaAdmin;
}

export const router = crearRouter(new RouterFactoryTiendaAdminPruebas() as unknown as Record<string, { router: RouteObject }>);
