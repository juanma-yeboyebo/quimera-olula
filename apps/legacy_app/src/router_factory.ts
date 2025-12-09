import { crearRouter } from "@olula/lib/router.ts";
import { RouterFactoryOlula } from "@olula/olula/router_factory.ts";
import { RouteObject } from "react-router";

export class RouterFactoryLegacy extends RouterFactoryOlula { }

export const router = crearRouter(new RouterFactoryLegacy() as unknown as Record<string, { router: RouteObject }>);
