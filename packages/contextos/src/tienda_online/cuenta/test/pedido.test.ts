import { beforeEach, describe, expect, test, vi } from "vitest";
import { PedidoDetalle } from "#/tienda_online/cuenta/diseño.ts";
import { ContextoPedido } from "#/tienda_online/cuenta/pedido/diseño.ts";

const getPedido = vi.fn();

vi.mock("#/tienda_online/cuenta/infraestructura.ts", () => ({
    getPedido: (id: string) => getPedido(id),
}));

const { cargarPedido, contextoPedidoInicial } = await import(
    "#/tienda_online/cuenta/pedido/pedido.ts"
);

const pedido: PedidoDetalle = {
    id: "7",
    codigo: "P7",
    fecha: "2026-02-02",
    total: 121,
    divisa: "EUR",
    servido: "Sí",
    neto: 100,
    totalIva: 21,
    lineas: [],
};

type Resultado = ContextoPedido | [ContextoPedido, unknown[]];
const ctxDe = (r: Resultado): ContextoPedido => (Array.isArray(r) ? r[0] : r);

beforeEach(() => {
    getPedido.mockReset();
});

describe("[cuenta-pedido-01] Carga del detalle de pedido", () => {
    test("cuenta_pedido_01_carga_el_pedido_por_id", async () => {
        getPedido.mockResolvedValue(pedido);

        const r = ctxDe(await cargarPedido(contextoPedidoInicial, "7"));

        expect(getPedido).toHaveBeenCalledWith("7");
        expect(r.estado).toBe("LISTO");
        expect(r.pedido).toEqual(pedido);
    });

    test("cuenta_pedido_01_error_distinto_de_404_pasa_a_error", async () => {
        getPedido.mockRejectedValue({ nombre: "Error", descripcion: "x", estado: 500 });

        const r = ctxDe(await cargarPedido(contextoPedidoInicial, "7"));

        expect(r.estado).toBe("ERROR");
    });
});

describe("[cuenta-pedido-02] 404 pedido no encontrado", () => {
    test("cuenta_pedido_02_404_pasa_a_no_encontrado", async () => {
        getPedido.mockRejectedValue({ nombre: "Error", descripcion: "x", estado: 404 });

        const r = ctxDe(await cargarPedido(contextoPedidoInicial, "9"));

        expect(r.estado).toBe("NO_ENCONTRADO");
        expect(r.pedido).toBeNull();
    });
});
