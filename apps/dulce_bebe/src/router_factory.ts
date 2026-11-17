import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { RouterFactoryTiendaListaRegalos } from '#/tienda_lista_regalos/router_factory.ts';
import { RouterFactoryTpvOlula } from '#/tpv/router_factory.ts';
import { FondoInicio } from '@olula/componentes/plantilla/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

export class RouterFactoryDulceBebe {
    Inicio = { router: { "": FondoInicio } };
    Auth = RouterFactoryAuthOlula;
    Tpv = RouterFactoryTpvOlula;
    TiendaListaRegalos = RouterFactoryTiendaListaRegalos;
}

export const router = crearRouter(new RouterFactoryDulceBebe() as unknown as Record<string, { router: RouteObject }>);
