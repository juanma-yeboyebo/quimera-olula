import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { RouterFactoryTpvOlula } from '#/tpv/router_factory.ts';
import { FondoInicio } from '@olula/lib/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

export class RouterFactoryNadia {
    Inicio = { router: { "": FondoInicio } };
    Auth = RouterFactoryAuthOlula;
    Tpv = RouterFactoryTpvOlula;
}

export const router = crearRouter(new RouterFactoryNadia() as unknown as Record<string, { router: RouteObject }>);
