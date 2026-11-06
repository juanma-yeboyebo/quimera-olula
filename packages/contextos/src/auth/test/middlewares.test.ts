import { beforeEach, describe, expect, test, vi } from "vitest";

const comprobarToken = vi.fn();

vi.mock("#/auth/login/dominio.ts", () => ({
    comprobarToken: () => comprobarToken(),
}));

const { esRutaPublica, crearAuthMiddleware } = await import("#/auth/middlewares.ts");

const FIJAS = ["/login", "/auth/passkey/enlace-magico", "/auth/reset-password"];

const ejecutar = (ruta: string, extra: string[], next = vi.fn(async () => undefined)) => {
    const middleware = crearAuthMiddleware(extra) as unknown as (
        args: { request: Request },
        next: () => Promise<unknown>,
    ) => Promise<unknown>;
    const request = new Request(`http://localhost${ruta}`);
    return { next, resultado: middleware({ request }, next) };
};

describe("[auth-rutas_publicas-01] Las rutas públicas fijas se atienden sin comprobar el token", () => {
    test.each(FIJAS)("auth_rutas_publicas_01_%s_es_publica", (ruta) => {
        expect(esRutaPublica(ruta, [])).toBe(true);
        expect(esRutaPublica(ruta, ["/producto"])).toBe(true);
    });

    test("auth_rutas_publicas_01_ruta_no_fija_no_es_publica", () => {
        expect(esRutaPublica("/mi-cuenta", [])).toBe(false);
        expect(esRutaPublica("/login/otra", [])).toBe(false);
    });
});

describe("[auth-rutas_publicas-02] Una app puede declarar rutas públicas adicionales; sin ellas el comportamiento es el actual", () => {
    test("auth_rutas_publicas_02_extra_vacio_solo_fijas", () => {
        expect(esRutaPublica("/catalogo", [])).toBe(false);
        expect(esRutaPublica("/producto/x", [])).toBe(false);
    });

    test("auth_rutas_publicas_02_extra_se_suma_a_las_fijas", () => {
        expect(esRutaPublica("/catalogo", ["/catalogo"])).toBe(true);
        expect(esRutaPublica("/login", ["/catalogo"])).toBe(true);
        expect(esRutaPublica("/mi-cuenta", ["/catalogo"])).toBe(false);
    });
});

describe("[auth-rutas_publicas-03] Las rutas públicas de la factory se comparan por prefijo de segmento", () => {
    test("auth_rutas_publicas_03_cubre_la_ruta_exacta", () => {
        expect(esRutaPublica("/producto", ["/producto"])).toBe(true);
    });

    test("auth_rutas_publicas_03_cubre_subrutas", () => {
        expect(esRutaPublica("/producto/camiseta-azul", ["/producto"])).toBe(true);
    });

    test("auth_rutas_publicas_03_no_cubre_otro_segmento_con_mismo_prefijo", () => {
        expect(esRutaPublica("/productos", ["/producto"])).toBe(false);
    });

    test("auth_rutas_publicas_03_raiz_solo_cubre_la_raiz_exacta", () => {
        expect(esRutaPublica("/", ["/"])).toBe(true);
        expect(esRutaPublica("/mi-cuenta", ["/"])).toBe(false);
    });
});

describe("[auth-rutas_publicas-04] En una ruta pública no se comprueba el token pero se llama a next()", () => {
    beforeEach(() => { comprobarToken.mockReset(); });

    test("auth_rutas_publicas_04_no_comprueba_token_y_llama_a_next", async () => {
        const { next, resultado } = ejecutar("/producto/x", ["/producto"]);
        await resultado;

        expect(comprobarToken).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
    });

    test("auth_rutas_publicas_04_ruta_fija_tampoco_comprueba_token", async () => {
        const { next, resultado } = ejecutar("/login", []);
        await resultado;

        expect(comprobarToken).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
    });
});

describe("[auth-rutas_publicas-05] En una ruta no pública con token inválido se redirige a /login", () => {
    beforeEach(() => { comprobarToken.mockReset(); });

    test("auth_rutas_publicas_05_token_rechazado_redirige_a_login", async () => {
        comprobarToken.mockRejectedValue(new Error("token inválido"));
        const { next, resultado } = ejecutar("/mi-cuenta", ["/producto"]);

        const lanzado = await resultado.then(
            () => null,
            (e: unknown) => e,
        );

        expect(lanzado).toBeInstanceOf(Response);
        expect((lanzado as Response).status).toBe(302);
        expect((lanzado as Response).headers.get("Location")).toBe("/login");
        expect(next).not.toHaveBeenCalled();
    });

    test("auth_rutas_publicas_05_token_valido_continua", async () => {
        comprobarToken.mockResolvedValue(undefined);
        const { next, resultado } = ejecutar("/mi-cuenta", ["/producto"]);
        await resultado;

        expect(comprobarToken).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledOnce();
    });
});
