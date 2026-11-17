import { routerAuth } from '#/auth/router.ts';
import { RouterFactoryTiendaListaRegalosWeb } from '#/tienda_lista_regalos/router_tienda.ts';
import { CarritoTienda } from '#/tienda_online/carrito/detalle/CarritoTienda.tsx';
import { PagoCancelado } from '#/tienda_online/checkout/cancelado/PagoCancelado.tsx';
import { CheckoutTienda } from '#/tienda_online/checkout/detalle/CheckoutTienda.tsx';
import { PagoOk } from '#/tienda_online/checkout/ok/PagoOk.tsx';
import { CrearCuenta } from '#/tienda_online/cuenta/crear/CrearCuenta.tsx';
import { MiCuenta } from '#/tienda_online/cuenta/detalle/MiCuenta.tsx';
import { LoginTienda } from '#/tienda_online/cuenta/login/LoginTienda.tsx';
import { LogoutTienda } from '#/tienda_online/cuenta/logout/LogoutTienda.tsx';
import { DetallePedido } from '#/tienda_online/cuenta/pedido/DetallePedido.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';
import { PortadaDulceBebe } from './componentes/portada_dulce_bebe.tsx';

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

class RouterFactoryTiendaDulceBebe {
    static router = {
        "": PortadaDulceBebe,
        "carrito": CarritoTienda,
        "checkout": CheckoutTienda,
        "checkout/ok": PagoOk,
        "checkout/cancelado": PagoCancelado,
    };
}

export class RouterFactoryTienda {
    Auth = RouterFactoryAuthTienda;
    TiendaOnline = RouterFactoryTiendaDulceBebe;
    TiendaListaRegalos = RouterFactoryTiendaListaRegalosWeb;
}

export const router = crearRouter(new RouterFactoryTienda() as unknown as Record<string, { router: RouteObject }>);
