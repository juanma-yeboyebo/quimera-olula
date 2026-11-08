import { describe, expect, test } from "vitest";
import {
    RUTA_PEDIDOS_VENTAS,
    TEXTO_PEDIDOS_PROXIMAMENTE,
    TITULO_PEDIDOS_TIENDA,
} from "#/tienda_admin/pedido/maestro/PedidoTiendaAdmin.tsx";

describe("[tienda_admin-pedido-01] La pantalla de pedidos es informativa", () => {
    test("tienda_admin_pedido_01_titulo_y_texto", () => {
        expect(TITULO_PEDIDOS_TIENDA).toBe("Pedidos de la tienda");
        expect(TEXTO_PEDIDOS_PROXIMAMENTE).toBe(
            "Próximamente: los pedidos de la tienda filtrados desde Ventas → Pedidos",
        );
    });

    test("tienda_admin_pedido_01_enlaza_a_los_pedidos_de_ventas", () => {
        expect(RUTA_PEDIDOS_VENTAS).toBe("/ventas/pedido");
    });
});
