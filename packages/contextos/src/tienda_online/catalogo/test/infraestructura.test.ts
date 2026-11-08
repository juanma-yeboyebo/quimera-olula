import { beforeEach, describe, expect, test, vi } from "vitest";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { FiltrosCatalogo } from "#/tienda_online/catalogo/diseño.ts";

const get = vi.fn();
const obtenerToken = vi.fn();
const codigoStoreViewActivo = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        get: (url: string, msg?: string, headers?: Record<string, string>) =>
            get(url, msg, headers),
    },
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => obtenerToken(),
}));

vi.mock("#/tienda_online/comun/storeview.ts", () => ({
    codigoStoreViewActivo: () => codigoStoreViewActivo(),
}));

const { getCatalogo, getCategorias } = await import(
    "#/tienda_online/catalogo/infraestructura.ts"
);

const filtros: FiltrosCatalogo = {
    texto: "gel", categoria: "manos", soloDestacados: false, orden: "precio_asc",
};

const itemApi = {
    referencia: "A1",
    slug: "gel-a1",
    descripcion: "Gel",
    descripcion_corta: "Gel de manos",
    imagen: { url: "https://img/a1.jpg", alt: "Gel A1" },
    destacado: true,
    disponible: false,
    sin_control_stock: true,
    precio: 10,
    precio_con_iva: 12.1,
    tipo_iva: 21,
    divisa: "EUR",
    iva_incluido: false,
};

beforeEach(() => {
    get.mockReset();
    obtenerToken.mockReset();
    codigoStoreViewActivo.mockReset();
    codigoStoreViewActivo.mockReturnValue("sanhigia_es");
    obtenerToken.mockReturnValue(null);
});

describe("[catalogo-carga-01] La consulta del catálogo siempre envía criteria con orden explícito y paginación {limite: 24, pagina: N}", () => {
    test("catalogo_carga_01_la_url_lleva_la_criteria_de_criteriaCatalogo", async () => {
        get.mockResolvedValue({ datos: [], total: 0 });

        await getCatalogo(filtros, 2);

        const esperado = criteriaQuery(
            [["texto", "~", "gel"], ["categoria", "=", "manos"]],
            ["precio", "ASC"],
            { limite: 24, pagina: 2 },
        );
        expect(get.mock.calls[0][0]).toBe(`/public/tienda_online/catalogo${esperado}`);
    });

    test("catalogo_carga_01_con_filtros_vacios_envia_igualmente_query_con_orden_y_paginacion", async () => {
        get.mockResolvedValue({ datos: [], total: 0 });

        await getCatalogo({ texto: "", categoria: null, soloDestacados: false, orden: "relevancia" }, 1);

        const url = get.mock.calls[0][0] as string;
        expect(url.startsWith("/public/tienda_online/catalogo?q=")).toBe(true);
        const criteria = JSON.parse(decodeURIComponent(url.split("?q=")[1]));
        expect(criteria.orden).toEqual(["orden", "ASC"]);
        expect(criteria.paginacion).toEqual({ limite: 24, pagina: 1 });
    });
});

describe("[catalogo-carga-02] La consulta del catálogo envía X-Carrito-Token si hay un carrito guardado", () => {
    test("catalogo_carga_02_envia_store_view", async () => {
        get.mockResolvedValue({ datos: [], total: 0 });

        await getCatalogo(filtros, 1);

        expect(get.mock.calls[0][2]).toMatchObject({ "X-Store-View": "sanhigia_es" });
    });

    test("catalogo_carga_02_envia_token_si_hay_carrito", async () => {
        obtenerToken.mockReturnValue("tok-123");
        get.mockResolvedValue({ datos: [], total: 0 });

        await getCatalogo(filtros, 1);

        expect(get.mock.calls[0][2]).toMatchObject({
            "X-Store-View": "sanhigia_es",
            "X-Carrito-Token": "tok-123",
        });
    });

    test("catalogo_carga_02_no_envia_token_si_no_hay_carrito", async () => {
        get.mockResolvedValue({ datos: [], total: 0 });

        await getCatalogo(filtros, 1);

        expect(get.mock.calls[0][2]).not.toHaveProperty("X-Carrito-Token");
    });
});

describe("[catalogo-carga-03] El ítem de la API se mapea a ProductoCatalogo", () => {
    test("catalogo_carga_03_mapea_snake_a_camel", async () => {
        get.mockResolvedValue({ datos: [itemApi], total: 1 });

        const { productos } = await getCatalogo(filtros, 1);

        expect(productos).toEqual([
            {
                referencia: "A1",
                slug: "gel-a1",
                descripcion: "Gel",
                descripcionCorta: "Gel de manos",
                imagen: { url: "https://img/a1.jpg", alt: "Gel A1" },
                destacado: true,
                disponible: false,
                sinControlStock: true,
                precio: 10,
                precioConIva: 12.1,
                tipoIva: 21,
                divisa: "EUR",
                ivaIncluido: false,
            },
        ]);
    });

    test("catalogo_carga_03_conserva_imagen_nula", async () => {
        get.mockResolvedValue({ datos: [{ ...itemApi, imagen: null }], total: 1 });

        const { productos } = await getCatalogo(filtros, 1);

        expect(productos[0].imagen).toBeNull();
    });

    test("catalogo_carga_03_devuelve_el_total", async () => {
        get.mockResolvedValue({ datos: [itemApi], total: 57 });

        const { total } = await getCatalogo(filtros, 1);

        expect(total).toBe(57);
    });
});

describe("[catalogo-categorias-01] El árbol de categorías se mapea a CategoriaTienda { id, nombre, slug, hijas }", () => {
    test("catalogo_categorias_01_llama_a_la_ruta_de_categorias", async () => {
        get.mockResolvedValue({ datos: [] });

        await getCategorias();

        expect(get.mock.calls[0][0]).toBe("/public/tienda_online/categoria");
        expect(get.mock.calls[0][2]).toMatchObject({ "X-Store-View": "sanhigia_es" });
    });

    test("catalogo_categorias_01_mapea_recursivamente_las_hijas", async () => {
        get.mockResolvedValue({
            datos: [
                {
                    id: 1, nombre: "Higiene", slug: "higiene", hijas: [
                        { id: 2, nombre: "Manos", slug: "manos", hijas: [] },
                    ],
                },
            ],
        });

        const arbol = await getCategorias();

        expect(arbol).toEqual([
            {
                id: 1, nombre: "Higiene", slug: "higiene", enMenu: true, hijas: [
                    { id: 2, nombre: "Manos", slug: "manos", enMenu: true, hijas: [] },
                ],
            },
        ]);
    });

    test("tienda_menu_10_mapea_en_menu_y_por_defecto_es_true", async () => {
        get.mockResolvedValue({
            datos: [
                { id: 1, nombre: "A", slug: "a", en_menu: false, hijas: [] },
                { id: 2, nombre: "B", slug: "b", hijas: [] },
            ],
        });

        const arbol = await getCategorias();

        expect(arbol.map((c) => c.enMenu)).toEqual([false, true]);
    });
});
