import { describe, expect, test } from "vitest";
import { CarritoTienda, LineaCarritoTienda } from "#/tienda_online/comun/diseño.ts";
import { cantidadValida, estaVacio, hayPagoIniciado } from "#/tienda_online/carrito/dominio.ts";

const linea: LineaCarritoTienda = {
    id: 1,
    referencia: "REF1",
    slug: "producto-1",
    descripcion: "Producto 1",
    imagen: null,
    cantidad: 2,
    precio: 10,
    dtoPorcentual: 0,
    tipoIva: 21,
    ivaIncluido: false,
    importe: 20,
};

const carrito: CarritoTienda = {
    token: "tok-1",
    estado: "ABIERTO",
    divisa: "EUR",
    neto: 20,
    totalIva: 4.2,
    total: 24.2,
    unidades: 2,
    datosCheckout: null,
    lineas: [linea],
    documento: null,
};

describe("[carrito-carga-02] Sin carrito o con el carrito sin líneas se muestra «Tu carrito está vacío»", () => {
    test("carrito_carga_02_sin_carrito_esta_vacio", () => {
        expect(estaVacio(null)).toBe(true);
    });

    test("carrito_carga_02_sin_lineas_esta_vacio", () => {
        expect(estaVacio({ ...carrito, lineas: [] })).toBe(true);
    });

    test("carrito_carga_02_con_lineas_no_esta_vacio", () => {
        expect(estaVacio(carrito)).toBe(false);
    });
});

describe("[carrito-carga-03] Si el carrito está en PAGO_PENDIENTE se muestra el aviso de pago iniciado", () => {
    test("carrito_carga_03_pago_pendiente_hay_pago_iniciado", () => {
        expect(hayPagoIniciado({ ...carrito, estado: "PAGO_PENDIENTE" })).toBe(true);
    });

    test("carrito_carga_03_abierto_no_hay_pago_iniciado", () => {
        expect(hayPagoIniciado(carrito)).toBe(false);
    });

    test("carrito_carga_03_sin_carrito_no_hay_pago_iniciado", () => {
        expect(hayPagoIniciado(null)).toBe(false);
    });
});

describe("[carrito-lineas-02] cantidadValida acepta solo números mayores que 0", () => {
    test.each([1, 2, 10, 0.5, "3", "1.5", " 4 "])("carrito_lineas_02_%s_es_valida", (v) => {
        expect(cantidadValida(v)).toBe(true);
    });

    test.each([0, -1, -0.5, "0", "-2"])("carrito_lineas_02_%s_no_es_valida", (v) => {
        expect(cantidadValida(v)).toBe(false);
    });

    test.each([NaN, Infinity, -Infinity, "", "   ", "abc", "1a", null, undefined, {}, [], true])(
        "carrito_lineas_02_no_numerico_%s_no_es_valida",
        (v) => {
            expect(cantidadValida(v)).toBe(false);
        },
    );
});
