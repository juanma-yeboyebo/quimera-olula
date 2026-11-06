import { MiddlewareFunction, redirect } from "react-router";
import { comprobarToken } from "./login/dominio.ts";

const rutasPublicasFijas = ["/login", "/auth/passkey/enlace-magico", "/auth/reset-password"];

export const esRutaPublica = (pathname: string, extra: string[]): boolean =>
    rutasPublicasFijas.includes(pathname) ||
    extra.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")));

export const crearAuthMiddleware = (extra: string[]): MiddlewareFunction =>
    async ({ request }, next) => {
        const url = new URL(request.url);

        if (esRutaPublica(url.pathname, extra)) return await next();

        await comprobarToken().catch((_e) => {
            throw redirect("/login")
        })

        return await next();
    };

export const authMiddleware = crearAuthMiddleware([]);
