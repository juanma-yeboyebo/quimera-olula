import { describe, expect, test, vi } from "vitest";

vi.mock("#/tienda_lista_regalos/lista/maestro/MaestroConDetalleListaRegalos.tsx", () => ({
    MaestroConDetalleListaRegalos: () => null,
}));

const { FactoryTiendaListaRegalos } = await import("#/tienda_lista_regalos/factory.ts");
const { menuTiendaListaRegalos } = await import("#/tienda_lista_regalos/menu.ts");
const { RouterFactoryTiendaListaRegalos } = await import("#/tienda_lista_regalos/router_factory.ts");

describe("[lista_regalos-menu-01] El menú añade Listas de regalo al área Tienda online", () => {
    test("lista_regalos_menu_01_entrada_con_url_y_regla", () => {
        expect(menuTiendaListaRegalos["Tienda online/Listas de regalo"]).toEqual({
            url: "/tienda_lista_regalos/lista",
            regla: "tienda_lista_regalos.lista",
        });
    });

    test("lista_regalos_menu_01_el_area_es_tienda_online", () => {
        expect(menuTiendaListaRegalos["Tienda online"]).toEqual({ icono: "menu_ventas", area: "Comercial" });
    });

    test("lista_regalos_menu_01_la_factory_expone_el_menu", () => {
        expect(FactoryTiendaListaRegalos.menu).toBe(menuTiendaListaRegalos);
    });
});

describe("[lista_regalos-menu-02] El router expone la ruta del admin de listas", () => {
    test("lista_regalos_menu_02_una_ruta_con_el_maestro", () => {
        expect(Object.keys(RouterFactoryTiendaListaRegalos.router)).toEqual(["tienda_lista_regalos/lista"]);
    });
});
