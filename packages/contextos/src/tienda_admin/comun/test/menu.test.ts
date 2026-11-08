import { describe, expect, test } from "vitest";
import { FactoryTiendaAdmin } from "#/tienda_admin/factory.ts";
import { menuTiendaAdmin } from "#/tienda_admin/menu.ts";
import { RouterFactoryTiendaAdmin } from "#/tienda_admin/router_factory.ts";

describe("[tienda_admin-menu-01] El menú define el área Tienda online", () => {
    test("tienda_admin_menu_01_articulos_y_categorias_llevan_su_regla", () => {
        expect(menuTiendaAdmin["Tienda online/Artículos web"]).toEqual({
            url: "/tienda_admin/articulo",
            regla: "tienda_admin.articulo",
        });
        expect(menuTiendaAdmin["Tienda online/Categorías"]).toEqual({
            url: "/tienda_admin/categoria",
            regla: "tienda_admin.categoria",
        });
    });

    test("tienda_admin_menu_01_pedidos_y_configuracion_no_llevan_regla", () => {
        expect(menuTiendaAdmin["Tienda online/Pedidos"]).toEqual({ url: "/tienda_admin/pedido" });
        expect(menuTiendaAdmin["Tienda online/Configuración"]).toEqual({ url: "/tienda_admin/configuracion" });
    });

    test("tienda_admin_menu_01_la_factory_expone_el_menu", () => {
        expect(FactoryTiendaAdmin.menu).toBe(menuTiendaAdmin);
    });
});

describe("[tienda_admin-menu-02] El router expone las cuatro rutas", () => {
    test("tienda_admin_menu_02_cuatro_rutas", () => {
        expect(Object.keys(RouterFactoryTiendaAdmin.router)).toEqual([
            "tienda_admin/articulo",
            "tienda_admin/categoria",
            "tienda_admin/pedido",
            "tienda_admin/configuracion",
        ]);
    });
});
