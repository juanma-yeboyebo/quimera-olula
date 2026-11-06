import { beforeEach, describe, expect, test, vi } from "vitest";

const postCancelarPago = vi.fn();
const obtenerToken = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();

vi.mock("#/tienda_online/checkout/infraestructura.ts", () => ({
    postCancelarPago: (token: string) => postCancelarPago(token),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => obtenerToken(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
}));

const { cancelarPago } = await import("#/tienda_online/checkout/cancelado/cancelado.ts");

const CLAVE = "tienda_online.pago_en_curso.sanhigia_es";

beforeEach(() => {
    postCancelarPago.mockReset();
    obtenerToken.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    sessionStorage.clear();
    obtenerToken.mockReturnValue(null);
    recargarCarrito.mockResolvedValue(undefined);
    postCancelarPago.mockResolvedValue(undefined);
});

describe("[checkout-cancelado-01] Cancelar envía POST con el token guardado, borra el de sessionStorage y recarga el carrito", () => {
    test("checkout_cancelado_01_usa_el_token_del_almacen", async () => {
        obtenerToken.mockReturnValue("tok-almacen");
        sessionStorage.setItem(CLAVE, "tok-session");

        await cancelarPago("sanhigia_es");

        expect(postCancelarPago).toHaveBeenCalledExactlyOnceWith("tok-almacen");
    });

    test("checkout_cancelado_01_sin_token_en_el_almacen_usa_el_de_session_storage", async () => {
        sessionStorage.setItem(CLAVE, "tok-session");

        await cancelarPago("sanhigia_es");

        expect(postCancelarPago).toHaveBeenCalledExactlyOnceWith("tok-session");
    });

    test("checkout_cancelado_01_borra_la_clave_recarga_y_devuelve_true", async () => {
        obtenerToken.mockReturnValue("tok-almacen");
        sessionStorage.setItem(CLAVE, "tok-session");

        const r = await cancelarPago("sanhigia_es");

        expect(sessionStorage.getItem(CLAVE)).toBeNull();
        expect(recargarCarrito).toHaveBeenCalledOnce();
        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(r).toBe(true);
    });
});

describe("[checkout-cancelado-02] Si la cancelación falla con 404 o 409 se olvida el carrito", () => {
    test.each([404, 409])("checkout_cancelado_02_%i_olvida_el_carrito_y_devuelve_false", async (estado) => {
        obtenerToken.mockReturnValue("tok-almacen");
        postCancelarPago.mockRejectedValue({ nombre: "Error", descripcion: "x", estado });

        const r = await cancelarPago("sanhigia_es");

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(r).toBe(false);
    });
});
