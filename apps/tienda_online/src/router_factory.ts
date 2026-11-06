import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { RouterFactoryTiendaOnline } from '#/tienda_online/router_factory.ts';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

export class RouterFactoryTienda {
    Auth = RouterFactoryAuthOlula;
    TiendaOnline = RouterFactoryTiendaOnline;
}

export const router = crearRouter(new RouterFactoryTienda() as unknown as Record<string, { router: RouteObject }>);
