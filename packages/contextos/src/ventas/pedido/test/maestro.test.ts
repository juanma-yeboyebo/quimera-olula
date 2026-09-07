import { describe, expect, test } from "vitest";
import { Pedido } from "../diseño.ts";
import { pedidoVacio } from "../detalle/detalle.ts";
import { agruparPorCliente, estadoServidoPedido, puedeAlbaranarse, todosPuedenAlbaranarse } from "../maestro/maestro.ts";

const pedido = (
    id: string,
    servido: string,
    cliente_id = "C1",
    forma_pago_id = "FP1"
): Pedido => ({
    ...pedidoVacio(),
    id,
    servido,
    cliente: { ...pedidoVacio().cliente, cliente_id },
    forma_pago_id,
});

describe("puedeAlbaranarse", () => {
    test("un pedido pendiente puede albaranarse", () => {
        expect(puedeAlbaranarse(pedido("1", "PENDIENTE"))).toBe(true);
    });

    test("un pedido parcialmente servido puede albaranarse", () => {
        expect(puedeAlbaranarse(pedido("1", "PARCIAL"))).toBe(true);
    });

    test("un pedido totalmente servido no puede albaranarse", () => {
        expect(puedeAlbaranarse(pedido("1", "TOTAL"))).toBe(false);
    });
});

describe("todosPuedenAlbaranarse", () => {
    const lista = [
        pedido("1", "PENDIENTE"),
        pedido("2", "PARCIAL"),
        pedido("3", "TOTAL"),
    ];

    test("es falso si no hay ninguno seleccionado", () => {
        expect(todosPuedenAlbaranarse([], lista)).toBe(false);
    });

    test("es cierto si todos los seleccionados son albaranables", () => {
        expect(todosPuedenAlbaranarse(["1", "2"], lista)).toBe(true);
    });

    test("es falso si alguno de los seleccionados no es albaranable", () => {
        expect(todosPuedenAlbaranarse(["1", "3"], lista)).toBe(false);
    });

    test("es falso si algún id no está en la lista", () => {
        expect(todosPuedenAlbaranarse(["1", "99"], lista)).toBe(false);
    });
});

describe("agruparPorCliente", () => {
    const lista = [
        pedido("1", "PENDIENTE", "C1", "FP1"),
        pedido("2", "PENDIENTE", "C1", "FP1"),
        pedido("3", "PENDIENTE", "C2", "FP1"),
        pedido("4", "PENDIENTE", "C1", "FP2"),
    ];

    const ids = (grupos: { ids: string[] }[]) => grupos.map((grupo) => grupo.ids);

    test("agrupa los pedidos del mismo cliente", () => {
        expect(ids(agruparPorCliente(["1", "2"], lista))).toEqual([["1", "2"]]);
    });

    test("separa los pedidos de clientes distintos", () => {
        expect(ids(agruparPorCliente(["1", "3"], lista))).toEqual([["1"], ["3"]]);
    });

    test("no separa por forma de pago", () => {
        expect(ids(agruparPorCliente(["1", "4"], lista))).toEqual([["1", "4"]]);
    });

    test("ignora los ids que no están en la lista", () => {
        expect(ids(agruparPorCliente(["1", "99"], lista))).toEqual([["1"]]);
    });

    test("sin seleccionados no hay grupos", () => {
        expect(agruparPorCliente([], lista)).toEqual([]);
    });

    test("cada grupo lleva la etiqueta del cliente", () => {
        expect(agruparPorCliente(["1"], lista)[0].etiqueta).toBe("C1");
    });

    test("separa por nombre cuando el listado no trae cliente_id", () => {
        const sinId = (id: string, nombre: string): Pedido => ({
            ...pedido(id, "PENDIENTE"),
            cliente: {
                ...pedidoVacio().cliente,
                cliente_id: "",
                nombre_cliente: nombre,
            },
        });
        const sinIds = [sinId("1", "Paco Perez"), sinId("2", "Cliente1223")];

        expect(ids(agruparPorCliente(["1", "2"], sinIds))).toEqual([["1"], ["2"]]);
    });
});

describe("estadoServidoPedido pinta el punto de la lista", () => {
    test("un pedido sin servir sale en verde", () => {
        expect(estadoServidoPedido(pedido("1", "PENDIENTE"))).toBe("pendiente");
    });

    test("uno servido a medias sale en naranja", () => {
        expect(estadoServidoPedido(pedido("1", "PARCIAL"))).toBe("parcial");
    });

    test("uno servido del todo sale apagado", () => {
        expect(estadoServidoPedido(pedido("1", "TOTAL"))).toBe("cerrado");
        expect(estadoServidoPedido(pedido("1", "SERVIDO"))).toBe("cerrado");
    });

    test("el estado se compara sin distinguir mayúsculas", () => {
        expect(estadoServidoPedido(pedido("1", "parcial"))).toBe("parcial");
        expect(estadoServidoPedido(pedido("1", "Total"))).toBe("cerrado");
    });

    test("un estado desconocido no se da por servido", () => {
        expect(estadoServidoPedido(pedido("1", ""))).toBe("pendiente");
        expect(estadoServidoPedido({})).toBe("pendiente");
    });
});
