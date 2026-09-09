import { RouterFactoryVentasOlula } from "#/ventas/router_factory.ts";
import { crearRouter } from "@olula/lib/router.ts";
import { RouteObject } from "react-router";
import { RouterFactoryAuthOlula } from "./contextos/auth/router.ts";
import { MaestroConDetalleVentaTpv } from "./contextos/tpv/venta/maestro/MaestroConDetalleVentaTpv.tsx";

// "tpv/venta" no es el módulo genérico de packages/contextos: El Ganso
// tiene su propio módulo completo de venta TPV — ver ARQUITECTURA_GMIXTO.md.
export class RouterFactoryVentasGanso extends RouterFactoryVentasOlula {
    static router = {
        ...RouterFactoryVentasOlula.router,
        "tpv/venta": MaestroConDetalleVentaTpv,
    }
}

// export class RouterFactoryLegacy extends RouterFactoryOlula {
//     Inicio = undefined;
//     Crm = undefined;
// }
export class RouterFactoryLegacy {
    Ventas = RouterFactoryVentasGanso;
    Auth = RouterFactoryAuthOlula;
}

export const router = crearRouter(new RouterFactoryLegacy() as unknown as Record<string, { router: RouteObject }>);
