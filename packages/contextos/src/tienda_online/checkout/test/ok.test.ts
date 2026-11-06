import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { CarritoTienda, EstadoCarrito } from "#/tienda_online/comun/diseño.ts";

const getCarrito = vi.fn();
const olvidarCarrito = vi.fn();

vi.mock("#/tienda_online/comun/infraestructura.ts", () => ({
    getCarrito: (token: string) => getCarrito(token),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    olvidarCarrito: () => olvidarCarrito(),
}));

const { pasoConsulta, consultarPago, cerrarPago } = await import(
    "#/tienda_online/checkout/ok/ok.ts"
);

const carritoEn = (estado: EstadoCarrito): CarritoTienda => ({
    token: "tok-1",
    estado,
    divisa: "EUR",
    neto: 0,
    totalIva: 0,
    total: 0,
    unidades: 0,
    datosCheckout: null,
    lineas: [],
    documento: estado === "CONVERTIDO" ? { tipo: "pedido", id: 1, codigo: "PED-1" } : null,
});

const CLAVE = "tienda_online.pago_en_curso.sanhigia_es";

beforeEach(() => {
    getCarrito.mockReset();
    olvidarCarrito.mockReset();
    sessionStorage.clear();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("[checkout-ok-02] La página lee el carrito hasta verlo PAGADO, CONVERTIDO o ERROR_CONVERSION", () => {
    test.each([
        ["PAGADO", "CONFIRMADO"],
        ["CONVERTIDO", "CONFIRMADO"],
        ["ERROR_CONVERSION", "INCIDENCIA"],
        ["PAGO_PENDIENTE", "PENDIENTE"],
    ] as const)("checkout_ok_02_paso_con_%s_devuelve_%s", async (estado, resultado) => {
        const carrito = carritoEn(estado);
        getCarrito.mockResolvedValue(carrito);

        const r = await pasoConsulta("tok-1");

        expect(getCarrito).toHaveBeenCalledWith("tok-1");
        expect(r).toEqual({ resultado, carrito });
    });

    test("checkout_ok_02_si_ya_esta_pagado_no_vuelve_a_consultar", async () => {
        vi.useFakeTimers();
        getCarrito.mockResolvedValue(carritoEn("PAGADO"));

        const r = await consultarPago("tok-1", { intervaloMs: 2000, maxMs: 60000 });

        expect(r.resultado).toBe("CONFIRMADO");
        expect(getCarrito).toHaveBeenCalledTimes(1);
    });

    test("checkout_ok_02_sigue_consultando_cada_intervalo_hasta_confirmar", async () => {
        vi.useFakeTimers();
        getCarrito
            .mockResolvedValueOnce(carritoEn("PAGO_PENDIENTE"))
            .mockResolvedValueOnce(carritoEn("PAGO_PENDIENTE"))
            .mockResolvedValueOnce(carritoEn("CONVERTIDO"));

        const promesa = consultarPago("tok-1", { intervaloMs: 2000, maxMs: 60000 });
        await vi.advanceTimersByTimeAsync(1999);
        expect(getCarrito).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(2000);
        expect(getCarrito).toHaveBeenCalledTimes(2);
        await vi.advanceTimersByTimeAsync(2000);
        const r = await promesa;

        expect(getCarrito).toHaveBeenCalledTimes(3);
        expect(r.resultado).toBe("CONFIRMADO");
        expect(r.carrito?.documento).toEqual({ tipo: "pedido", id: 1, codigo: "PED-1" });
    });

    test("checkout_ok_02_error_conversion_termina_como_incidencia", async () => {
        vi.useFakeTimers();
        getCarrito.mockResolvedValue(carritoEn("ERROR_CONVERSION"));

        const r = await consultarPago("tok-1", { intervaloMs: 2000, maxMs: 60000 });

        expect(r.resultado).toBe("INCIDENCIA");
    });
});

describe("[checkout-ok-06] Pasados 60 segundos sin confirmación se deja de consultar y no se olvida el carrito", () => {
    test("checkout_ok_06_devuelve_pendiente_tras_el_maximo", async () => {
        vi.useFakeTimers();
        getCarrito.mockResolvedValue(carritoEn("PAGO_PENDIENTE"));

        const promesa = consultarPago("tok-1", { intervaloMs: 2000, maxMs: 60000 });
        await vi.advanceTimersByTimeAsync(60000);
        const r = await promesa;

        expect(r.resultado).toBe("PENDIENTE");
    });

    test("checkout_ok_06_deja_de_consultar_tras_el_maximo", async () => {
        vi.useFakeTimers();
        getCarrito.mockResolvedValue(carritoEn("PAGO_PENDIENTE"));

        const promesa = consultarPago("tok-1", { intervaloMs: 2000, maxMs: 60000 });
        await vi.advanceTimersByTimeAsync(60000);
        await promesa;
        const llamadas = getCarrito.mock.calls.length;
        await vi.advanceTimersByTimeAsync(20000);

        expect(llamadas).toBeGreaterThanOrEqual(30);
        expect(llamadas).toBeLessThanOrEqual(31);
        expect(getCarrito).toHaveBeenCalledTimes(llamadas);
    });

    test("checkout_ok_06_no_olvida_el_carrito_ni_borra_el_token", async () => {
        vi.useFakeTimers();
        sessionStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoEn("PAGO_PENDIENTE"));

        const promesa = consultarPago("tok-1", { intervaloMs: 2000, maxMs: 60000 });
        await vi.advanceTimersByTimeAsync(60000);
        await promesa;

        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(sessionStorage.getItem(CLAVE)).toBe("tok-1");
    });
});

describe("[checkout-ok-05] Al llegar a CONFIRMADO o INCIDENCIA se olvida el carrito y se borra el token", () => {
    test("checkout_ok_05_olvida_el_carrito_y_borra_la_clave_del_storeview", () => {
        sessionStorage.setItem(CLAVE, "tok-1");
        sessionStorage.setItem("tienda_online.pago_en_curso.otra", "tok-2");

        cerrarPago("sanhigia_es");

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(sessionStorage.getItem(CLAVE)).toBeNull();
        expect(sessionStorage.getItem("tienda_online.pago_en_curso.otra")).toBe("tok-2");
    });
});
