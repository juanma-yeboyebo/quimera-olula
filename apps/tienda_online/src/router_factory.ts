import { routerAuth } from '#/auth/router.ts';
import { CrearCuenta } from '#/tienda_online/cuenta/crear/CrearCuenta.tsx';
import { MiCuenta } from '#/tienda_online/cuenta/detalle/MiCuenta.tsx';
import { LoginTienda } from '#/tienda_online/cuenta/login/LoginTienda.tsx';
import { LogoutTienda } from '#/tienda_online/cuenta/logout/LogoutTienda.tsx';
import { DetallePedido } from '#/tienda_online/cuenta/pedido/DetallePedido.tsx';
import { RouterFactoryTiendaOnline } from '#/tienda_online/router_factory.ts';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

class RouterFactoryAuthTienda {
    static router = {
        ...routerAuth,
        login: LoginTienda,
        logout: LogoutTienda,
        registro: CrearCuenta,
        "mi-cuenta": MiCuenta,
        "mi-cuenta/pedido/:id": DetallePedido,
    };
}

export class RouterFactoryTienda {
    Auth = RouterFactoryAuthTienda;
    TiendaOnline = RouterFactoryTiendaOnline;
}

export const router = crearRouter(new RouterFactoryTienda() as unknown as Record<string, { router: RouteObject }>);
