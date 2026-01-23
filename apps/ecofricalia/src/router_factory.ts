import { RouterFactoryAuthOlula } from '#/auth/router_factory.ts';
import { RouterFactoryCrmOlula } from '#/crm/router_factory.ts';
import { FondoInicio } from '@olula/lib/FondoInicio.tsx';
import { crearRouter } from '@olula/lib/router.ts';
import { RouteObject } from 'react-router';

export class RouterFactoryEcofricalia {
    Inicio = { router: { "": FondoInicio } };
    Auth = RouterFactoryAuthOlula;
    Crm = RouterFactoryCrmOlula;
}

export const router = crearRouter(new RouterFactoryEcofricalia() as unknown as Record<string, { router: RouteObject }>);