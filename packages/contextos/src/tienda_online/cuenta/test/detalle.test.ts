import { beforeEach, describe, expect, test, vi } from "vitest";
import { ContextoCuenta } from "#/tienda_online/cuenta/detalle/diseño.ts";
import { CuentaTienda, PedidoResumen } from "#/tienda_online/cuenta/diseño.ts";

const getCuenta = vi.fn();
const getPedidos = vi.fn();

vi.mock("#/tienda_online/cuenta/infraestructura.ts", () => ({
    getCuenta: () => getCuenta(),
    getPedidos: (pagina: number) => getPedidos(pagina),
}));

const { cargarCuenta, contextoCuentaInicial, verMasPedidos } = await import(
    "#/tienda_online/cuenta/detalle/detalle.ts"
);

const cuenta: CuentaTienda = {
    email: "ana@example.com",
    nombre: "Ana",
    idFiscal: "B1",
    telefono: null,
    clienteId: "C1",
    direcciones: [],
};

const pedido = (id: string): PedidoResumen => ({
    id,
    codigo: `P-${id}`,
    fecha: "2026-01-01",
    total: 10,
    divisa: "EUR",
    servido: "No",
});

type Resultado = ContextoCuenta | [ContextoCuenta, unknown[]];
const ctxDe = (r: Resultado): ContextoCuenta => (Array.isArray(r) ? r[0] : r);

const errorApi = (estado: number) => ({ nombre: "Error", descripcion: "x", estado });

beforeEach(() => {
    getCuenta.mockReset();
    getPedidos.mockReset();
});

describe("[cuenta-mi_cuenta-01] Carga de mi cuenta", () => {
    test("cuenta_mi_cuenta_01_carga_la_cuenta_y_la_primera_pagina_de_pedidos", async () => {
        getCuenta.mockResolvedValue(cuenta);
        getPedidos.mockResolvedValue({ pedidos: [pedido("1")], total: 1 });

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("LISTA");
        expect(r.cuenta).toEqual(cuenta);
        expect(r.pedidos.map((p) => p.id)).toEqual(["1"]);
        expect(r.total).toBe(1);
        expect(r.pagina).toBe(1);
        expect(getPedidos).toHaveBeenCalledWith(1);
    });

    test("cuenta_mi_cuenta_01_error_distinto_de_404_pasa_a_error", async () => {
        getCuenta.mockRejectedValue(errorApi(500));

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("ERROR");
        expect(getPedidos).not.toHaveBeenCalled();
    });
});

describe("[cuenta-mi_cuenta-02] 404 sin cuenta en la tienda", () => {
    test("cuenta_mi_cuenta_02_404_pasa_a_sin_cuenta_y_no_pide_pedidos", async () => {
        getCuenta.mockRejectedValue(errorApi(404));

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("SIN_CUENTA");
        expect(r.cuenta).toBeNull();
        expect(getPedidos).not.toHaveBeenCalled();
    });
});

describe("[cuenta-pedidos-01] Fallo al cargar pedidos", () => {
    test("cuenta_pedidos_01_la_cuenta_se_muestra_y_se_marca_error_de_pedidos", async () => {
        getCuenta.mockResolvedValue(cuenta);
        getPedidos.mockRejectedValue(errorApi(500));

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("LISTA");
        expect(r.errorPedidos).toBe(true);
        expect(r.pedidos).toEqual([]);
    });
});

describe("[cuenta-pedidos-02] Ver más añade la página siguiente", () => {
    const base: ContextoCuenta = {
        estado: "LISTA",
        cuenta,
        pedidos: [pedido("1"), pedido("2")],
        total: 3,
        pagina: 1,
        errorPedidos: false,
    };

    test("cuenta_pedidos_02_pide_la_pagina_siguiente_y_añade_los_pedidos", async () => {
        getPedidos.mockResolvedValue({ pedidos: [pedido("3")], total: 3 });

        const r = ctxDe(await verMasPedidos(base));

        expect(getPedidos).toHaveBeenCalledWith(2);
        expect(r.pedidos.map((p) => p.id)).toEqual(["1", "2", "3"]);
        expect(r.pagina).toBe(2);
        expect(r.estado).toBe("LISTA");
    });

    test("cuenta_pedidos_02_si_falla_conserva_la_lista_y_la_pagina", async () => {
        getPedidos.mockRejectedValue(errorApi(500));

        const r = ctxDe(await verMasPedidos(base));

        expect(r.pedidos).toHaveLength(2);
        expect(r.pagina).toBe(1);
        expect(r.errorPedidos).toBe(true);
    });
});
