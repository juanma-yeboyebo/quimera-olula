import { beforeEach, describe, expect, test, vi } from "vitest";

const login = vi.fn();
const logout = vi.fn();
const whoAmI = vi.fn();
const whoAmIActualizar = vi.fn();
const permisosActualizar = vi.fn();
const obtenerToken = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();
const adoptarToken = vi.fn();
const postAsociarCarrito = vi.fn();
const getCarritoUsuario = vi.fn();

vi.mock("#/auth/login/dominio.ts", () => ({
    login: (id: string, contraseña: string) => login(id, contraseña),
    logout: () => logout(),
}));

vi.mock("#/auth/login/infraestructura.ts", () => ({
    whoAmI: () => whoAmI(),
    whoAmIStorage: { actualizar: (d: unknown) => whoAmIActualizar(d) },
    permisosGrupo: { actualizar: (p: unknown) => permisosActualizar(p) },
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => obtenerToken(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
    adoptarToken: (t: string) => adoptarToken(t),
}));

vi.mock("#/tienda_online/cuenta/infraestructura.ts", () => ({
    postAsociarCarrito: (t: string) => postAsociarCarrito(t),
    getCarritoUsuario: () => getCarritoUsuario(),
}));

const { cerrarSesion, enlazarCarritoTrasLogin, iniciarSesion } = await import(
    "#/tienda_online/cuenta/sesion.ts"
);

const errorApi = (estado: number) => ({ nombre: "Error", descripcion: "x", estado });

beforeEach(() => {
    login.mockReset();
    logout.mockReset();
    whoAmI.mockReset();
    whoAmIActualizar.mockReset();
    permisosActualizar.mockReset();
    obtenerToken.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    adoptarToken.mockReset();
    postAsociarCarrito.mockReset();
    getCarritoUsuario.mockReset();
    login.mockResolvedValue(undefined);
    logout.mockResolvedValue(undefined);
    whoAmI.mockResolvedValue({ permisos: ["p1"] });
    recargarCarrito.mockResolvedValue(undefined);
    adoptarToken.mockResolvedValue(undefined);
    postAsociarCarrito.mockResolvedValue(undefined);
    getCarritoUsuario.mockResolvedValue(null);
    obtenerToken.mockReturnValue(null);
});

describe("[cuenta-login-01] Login con whoAmI", () => {
    test("cuenta_login_01_llama_a_login_y_guarda_whoami_y_permisos", async () => {
        const ok = await iniciarSesion("a@b.es", "secreto");

        expect(ok).toBe(true);
        expect(login).toHaveBeenCalledWith("a@b.es", "secreto");
        expect(whoAmIActualizar).toHaveBeenCalledWith({ permisos: ["p1"] });
        expect(permisosActualizar).toHaveBeenCalledWith(["p1"]);
    });
});

describe("[cuenta-login-02] Login fallido", () => {
    test("cuenta_login_02_devuelve_false_y_no_toca_el_carrito", async () => {
        login.mockRejectedValue(errorApi(401));
        obtenerToken.mockReturnValue("tok-1");

        const ok = await iniciarSesion("a@b.es", "mala");

        expect(ok).toBe(false);
        expect(postAsociarCarrito).not.toHaveBeenCalled();
        expect(getCarritoUsuario).not.toHaveBeenCalled();
        expect(recargarCarrito).not.toHaveBeenCalled();
        expect(olvidarCarrito).not.toHaveBeenCalled();
    });

    test("cuenta_login_02_si_falla_whoami_devuelve_false", async () => {
        whoAmI.mockRejectedValue(errorApi(500));

        expect(await iniciarSesion("a@b.es", "x")).toBe(false);
    });
});

describe("[cuenta-login-03] Con token se asocia y se recarga", () => {
    test("cuenta_login_03_asocia_el_token_y_recarga_el_carrito", async () => {
        obtenerToken.mockReturnValue("tok-1");

        await iniciarSesion("a@b.es", "x");

        expect(postAsociarCarrito).toHaveBeenCalledWith("tok-1");
        expect(recargarCarrito).toHaveBeenCalledOnce();
        expect(adoptarToken).not.toHaveBeenCalled();
        expect(getCarritoUsuario).not.toHaveBeenCalled();
    });
});

describe("[cuenta-login-04] 404 o 409 al asociar", () => {
    test.each([404, 409])("cuenta_login_04_con_%i_olvida_el_carrito_y_lee_el_del_usuario", async (estado) => {
        obtenerToken.mockReturnValue("tok-1");
        postAsociarCarrito.mockRejectedValue(errorApi(estado));
        getCarritoUsuario.mockResolvedValue({ token: "tok-u" });

        await enlazarCarritoTrasLogin();

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(getCarritoUsuario).toHaveBeenCalledOnce();
        expect(adoptarToken).toHaveBeenCalledWith("tok-u");
    });
});

describe("[cuenta-login-05] Sin token se adopta el carrito del usuario", () => {
    test("cuenta_login_05_adopta_el_token_del_carrito_del_usuario", async () => {
        getCarritoUsuario.mockResolvedValue({ token: "tok-u" });

        await enlazarCarritoTrasLogin();

        expect(postAsociarCarrito).not.toHaveBeenCalled();
        expect(adoptarToken).toHaveBeenCalledWith("tok-u");
    });

    test("cuenta_login_05_sin_carrito_no_hace_nada", async () => {
        getCarritoUsuario.mockResolvedValue(null);

        await enlazarCarritoTrasLogin();

        expect(adoptarToken).not.toHaveBeenCalled();
        expect(olvidarCarrito).not.toHaveBeenCalled();
    });
});

describe("[cuenta-login-06] Un fallo de carrito no impide el login", () => {
    test("cuenta_login_06_error_al_asociar_no_lanza_y_el_login_es_correcto", async () => {
        obtenerToken.mockReturnValue("tok-1");
        postAsociarCarrito.mockRejectedValue(errorApi(500));

        expect(await iniciarSesion("a@b.es", "x")).toBe(true);
        expect(olvidarCarrito).not.toHaveBeenCalled();
    });

    test("cuenta_login_06_error_al_leer_el_carrito_del_usuario_no_lanza", async () => {
        getCarritoUsuario.mockRejectedValue(errorApi(500));

        expect(await iniciarSesion("a@b.es", "x")).toBe(true);
    });

    test("cuenta_login_06_error_al_adoptar_no_lanza", async () => {
        getCarritoUsuario.mockResolvedValue({ token: "tok-u" });
        adoptarToken.mockRejectedValue(errorApi(500));

        await expect(enlazarCarritoTrasLogin()).resolves.toBeUndefined();
    });
});

describe("[cuenta-logout-01] Cerrar sesión", () => {
    test("cuenta_logout_01_llama_a_logout_y_despues_olvida_el_carrito", async () => {
        const orden: string[] = [];
        logout.mockImplementation(async () => {
            orden.push("logout");
        });
        olvidarCarrito.mockImplementation(() => {
            orden.push("olvidar");
        });

        await cerrarSesion();

        expect(orden).toEqual(["logout", "olvidar"]);
    });

    test("cuenta_logout_01_olvida_el_carrito_aunque_logout_falle", async () => {
        logout.mockRejectedValue(errorApi(500));

        await expect(cerrarSesion()).rejects.toEqual(errorApi(500));
        expect(olvidarCarrito).toHaveBeenCalledOnce();
    });
});
