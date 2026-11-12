import { describe, expect, test, vi } from "vitest";

vi.mock("#/tienda_lista_regalos/web/lista/ListaRegalosTienda.tsx", () => ({
    ListaRegalosTienda: () => null,
}));

vi.mock("#/tienda_lista_regalos/web/ficha/FichaLineaListaRegalos.tsx", () => ({
    FichaLineaListaRegalos: () => null,
}));

const { RouterFactoryTiendaListaRegalosWeb } = await import("#/tienda_lista_regalos/router_tienda.ts");
const { ListaRegalosTienda } = await import("#/tienda_lista_regalos/web/lista/ListaRegalosTienda.tsx");
const { FichaLineaListaRegalos } = await import(
    "#/tienda_lista_regalos/web/ficha/FichaLineaListaRegalos.tsx"
);

describe("[lista_regalos-web-rutas-01] RouterFactoryTiendaListaRegalosWeb tiene la lista y la ficha", () => {
    test("lista_regalos_web_rutas_01_rutas_de_lista_y_ficha", () => {
        expect(RouterFactoryTiendaListaRegalosWeb.router).toEqual({
            "lista/:token": ListaRegalosTienda,
            "lista/:token/producto/:idlinea": FichaLineaListaRegalos,
        });
    });
});
