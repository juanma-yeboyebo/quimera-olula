import { describe, expect, test } from "vitest";
import { CarritoTienda, LineaCarritoTienda } from "#/tienda_online/comun/diseño.ts";
import { estaVacio, hayPagoIniciado, progresoEnvioGratis } from "#/tienda_online/carrito/dominio.ts";

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

describe("[carrito-envio-02] progresoEnvioGratis devuelve falta y porcentaje respecto al umbral", () => {
    test("carrito_envio_02_total_menor_que_umbral", () => {
        expect(progresoEnvioGratis(30, 50)).toEqual({ falta: 20, porcentaje: 60 });
    });

    test("carrito_envio_02_total_cero", () => {
        expect(progresoEnvioGratis(0, 50)).toEqual({ falta: 50, porcentaje: 0 });
    });

    test("carrito_envio_02_total_igual_al_umbral", () => {
        expect(progresoEnvioGratis(50, 50)).toEqual({ falta: 0, porcentaje: 100 });
    });

    test("carrito_envio_02_total_mayor_que_umbral_se_acota", () => {
        expect(progresoEnvioGratis(80, 50)).toEqual({ falta: 0, porcentaje: 100 });
    });

    test("carrito_envio_02_total_negativo_porcentaje_no_baja_de_0", () => {
        expect(progresoEnvioGratis(-10, 50).porcentaje).toBe(0);
    });

    test("carrito_envio_02_umbral_cero", () => {
        expect(progresoEnvioGratis(10, 0)).toEqual({ falta: 0, porcentaje: 100 });
    });

    test("carrito_envio_02_umbral_negativo", () => {
        expect(progresoEnvioGratis(10, -5)).toEqual({ falta: 0, porcentaje: 100 });
    });
});
