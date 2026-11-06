import { describe, expect, test } from "vitest";
import {
    añadirPagina,
    criteriaCatalogo,
    estaDisponible,
    filtrosAUrl,
    filtrosDesdeUrl,
    hayMas,
    rutaCategoria,
} from "#/tienda_online/catalogo/dominio.ts";
import {
    CategoriaTienda,
    FiltrosCatalogo,
    ProductoCatalogo,
} from "#/tienda_online/catalogo/diseño.ts";

const filtrosBase: FiltrosCatalogo = {
    texto: "",
    categoria: null,
    soloDestacados: false,
    orden: "relevancia",
};

const producto = (referencia: string, extra: Partial<ProductoCatalogo> = {}): ProductoCatalogo => ({
    referencia,
    slug: `slug-${referencia}`,
    descripcion: `Producto ${referencia}`,
    descripcionCorta: "",
    imagen: null,
    destacado: false,
    disponible: true,
    sinControlStock: false,
    precio: 10,
    precioConIva: 12.1,
    tipoIva: 21,
    divisa: "EUR",
    ivaIncluido: false,
    ...extra,
});

const arbol: CategoriaTienda[] = [
    {
        id: 1, nombre: "Higiene", slug: "higiene", hijas: [
            { id: 2, nombre: "Manos", slug: "manos", hijas: [
                { id: 4, nombre: "Geles", slug: "geles", hijas: [] },
            ] },
            { id: 3, nombre: "Cuerpo", slug: "cuerpo", hijas: [] },
        ],
    },
    { id: 5, nombre: "Material", slug: "material", hijas: [] },
];

describe("[catalogo-carga-01] La consulta del catálogo siempre envía criteria con orden explícito y paginación {limite: 24, pagina: N}", () => {
    test("catalogo_carga_01_orden_por_defecto_es_orden_asc", () => {
        expect(criteriaCatalogo(filtrosBase, 1).orden).toEqual(["orden", "ASC"]);
    });

    test("catalogo_carga_01_paginacion_limite_24_y_pagina_indicada", () => {
        expect(criteriaCatalogo(filtrosBase, 3).paginacion).toEqual({ limite: 24, pagina: 3 });
    });

    test("catalogo_carga_01_sin_filtros_el_filtro_es_lista_vacia", () => {
        expect(criteriaCatalogo(filtrosBase, 1).filtro).toEqual([]);
    });
});

describe("[catalogo-filtros-01] El buscador de texto filtra con [\"texto\", \"~\", valor]; con el texto vacío no se envía filtro", () => {
    test("catalogo_filtros_01_texto_genera_clausula", () => {
        const c = criteriaCatalogo({ ...filtrosBase, texto: "guantes" }, 1);
        expect(c.filtro).toEqual([["texto", "~", "guantes"]]);
    });

    test("catalogo_filtros_01_texto_vacio_no_genera_clausula", () => {
        expect(criteriaCatalogo({ ...filtrosBase, texto: "" }, 1).filtro).toEqual([]);
    });

    test("catalogo_filtros_01_texto_solo_espacios_no_genera_clausula", () => {
        expect(criteriaCatalogo({ ...filtrosBase, texto: "   " }, 1).filtro).toEqual([]);
    });
});

describe("[catalogo-filtros-02] El selector de orden ofrece Relevancia, Precio menor a mayor, Precio mayor a menor y Nombre", () => {
    test.each([
        ["relevancia", ["orden", "ASC"]],
        ["precio_asc", ["precio", "ASC"]],
        ["precio_desc", ["precio", "DESC"]],
        ["nombre", ["descripcion", "ASC"]],
    ] as const)("catalogo_filtros_02_orden_%s", (orden, esperado) => {
        expect(criteriaCatalogo({ ...filtrosBase, orden }, 1).orden).toEqual(esperado);
    });
});

describe("[catalogo-filtros-03] La casilla «Solo destacados» añade [\"destacado\", \"=\", \"true\"]", () => {
    test("catalogo_filtros_03_destacados_genera_clausula", () => {
        const c = criteriaCatalogo({ ...filtrosBase, soloDestacados: true }, 1);
        expect(c.filtro).toEqual([["destacado", "=", "true"]]);
    });

    test("catalogo_filtros_03_sin_destacados_no_genera_clausula", () => {
        expect(criteriaCatalogo(filtrosBase, 1).filtro).toEqual([]);
    });
});

describe("[catalogo-rutas-01] /categoria/<slug> muestra el catálogo filtrado por esa categoría", () => {
    test("catalogo_rutas_01_categoria_genera_clausula_con_slug", () => {
        const c = criteriaCatalogo({ ...filtrosBase, categoria: "manos" }, 1);
        expect(c.filtro).toEqual([["categoria", "=", "manos"]]);
    });

    test("catalogo_rutas_01_combina_todas_las_clausulas", () => {
        const c = criteriaCatalogo(
            { texto: "gel", categoria: "manos", soloDestacados: true, orden: "nombre" },
            2,
        );
        expect(c.filtro).toEqual(
            expect.arrayContaining([
                ["texto", "~", "gel"],
                ["categoria", "=", "manos"],
                ["destacado", "=", "true"],
            ]),
        );
        expect(c.filtro).toHaveLength(3);
    });
});

describe("[catalogo-rutas-02] Los filtros y el orden se reflejan en la URL (?texto=…&orden=…&destacados=1)", () => {
    test("catalogo_rutas_02_filtros_a_url_incluye_texto_orden_y_destacados", () => {
        const params = filtrosAUrl({
            texto: "gel", categoria: null, soloDestacados: true, orden: "precio_asc",
        });
        expect(params.get("texto")).toBe("gel");
        expect(params.get("orden")).toBe("precio_asc");
        expect(params.get("destacados")).toBe("1");
    });

    test("catalogo_rutas_02_valores_por_defecto_no_aparecen_en_la_url", () => {
        expect(filtrosAUrl(filtrosBase).toString()).toBe("");
    });

    test("catalogo_rutas_02_la_categoria_no_va_en_la_query", () => {
        const params = filtrosAUrl({ ...filtrosBase, categoria: "manos" });
        expect(params.has("categoria")).toBe(false);
    });

    test("catalogo_rutas_02_url_a_filtros_lee_parametros_y_slug", () => {
        const f = filtrosDesdeUrl(
            new URLSearchParams("texto=gel&orden=precio_desc&destacados=1"),
            "manos",
        );
        expect(f).toEqual({
            texto: "gel", categoria: "manos", soloDestacados: true, orden: "precio_desc",
        });
    });

    test("catalogo_rutas_02_url_vacia_da_filtros_por_defecto", () => {
        expect(filtrosDesdeUrl(new URLSearchParams(), null)).toEqual(filtrosBase);
    });

    test("catalogo_rutas_02_orden_invalido_vuelve_a_relevancia", () => {
        const f = filtrosDesdeUrl(new URLSearchParams("orden=inventado"), null);
        expect(f.orden).toBe("relevancia");
    });

    test("catalogo_rutas_02_ida_y_vuelta_es_estable", () => {
        const original: FiltrosCatalogo = {
            texto: "guantes de nitrilo", categoria: "cuerpo", soloDestacados: true, orden: "nombre",
        };
        const params = filtrosAUrl(original);
        const recuperado = filtrosDesdeUrl(new URLSearchParams(params.toString()), original.categoria);
        expect(recuperado).toEqual(original);
    });
});

describe("[catalogo-paginacion-01] Mientras los productos cargados sean menos que total se muestra «Ver más», que añade los productos de la página siguiente", () => {
    test("catalogo_paginacion_01_hay_mas_si_cargados_menor_que_total", () => {
        expect(hayMas(24, 50)).toBe(true);
    });

    test("catalogo_paginacion_01_no_hay_mas_si_cargados_igual_a_total", () => {
        expect(hayMas(50, 50)).toBe(false);
    });

    test("catalogo_paginacion_01_no_hay_mas_con_catalogo_vacio", () => {
        expect(hayMas(0, 0)).toBe(false);
    });

    test("catalogo_paginacion_01_anade_al_final_conservando_el_orden", () => {
        const r = añadirPagina([producto("A"), producto("B")], [producto("C")]);
        expect(r.map((p) => p.referencia)).toEqual(["A", "B", "C"]);
    });
});

describe("[catalogo-paginacion-03] Si la página siguiente devuelve productos ya presentes (misma referencia), no se duplican", () => {
    test("catalogo_paginacion_03_descarta_referencias_repetidas", () => {
        const r = añadirPagina([producto("A"), producto("B")], [producto("B"), producto("C")]);
        expect(r.map((p) => p.referencia)).toEqual(["A", "B", "C"]);
    });

    test("catalogo_paginacion_03_conserva_el_producto_original", () => {
        const original = producto("B", { descripcion: "Original" });
        const r = añadirPagina([original], [producto("B", { descripcion: "Nuevo" })]);
        expect(r).toEqual([original]);
    });

    test("catalogo_paginacion_03_descarta_duplicados_dentro_de_los_nuevos", () => {
        const r = añadirPagina([], [producto("A"), producto("A")]);
        expect(r.map((p) => p.referencia)).toEqual(["A"]);
    });
});

describe("[catalogo-categorias-02] rutaCategoria(arbol, slug) devuelve los nodos desde la raíz hasta la categoría (vacía si no existe)", () => {
    test("catalogo_categorias_02_raiz_devuelve_solo_la_raiz", () => {
        expect(rutaCategoria(arbol, "higiene").map((c) => c.slug)).toEqual(["higiene"]);
    });

    test("catalogo_categorias_02_nodo_profundo_devuelve_ancestros_en_orden", () => {
        expect(rutaCategoria(arbol, "geles").map((c) => c.slug)).toEqual(["higiene", "manos", "geles"]);
    });

    test("catalogo_categorias_02_encuentra_en_otra_rama", () => {
        expect(rutaCategoria(arbol, "material").map((c) => c.id)).toEqual([5]);
    });

    test("catalogo_categorias_02_slug_inexistente_devuelve_vacia", () => {
        expect(rutaCategoria(arbol, "no-existe")).toEqual([]);
    });
});

describe("[catalogo-categorias-03] Si el slug de la URL no existe en el árbol, se muestra el catálogo vacío; no es un error", () => {
    test("catalogo_categorias_03_slug_inexistente_no_lanza", () => {
        expect(() => rutaCategoria(arbol, "no-existe")).not.toThrow();
    });

    test("catalogo_categorias_03_arbol_vacio_devuelve_vacia", () => {
        expect(rutaCategoria([], "higiene")).toEqual([]);
    });
});

describe("[catalogo-categorias-04] La miga de pan se obtiene de rutaCategoria", () => {
    test("catalogo_categorias_04_la_ruta_lleva_nombres_para_la_miga", () => {
        expect(rutaCategoria(arbol, "manos").map((c) => c.nombre)).toEqual(["Higiene", "Manos"]);
    });
});

describe("[catalogo-tarjeta-03] Si el producto no está disponible la tarjeta muestra «Sin stock»; sinControlStock siempre disponible", () => {
    test("catalogo_tarjeta_03_disponible_es_disponible", () => {
        expect(estaDisponible(producto("A", { disponible: true }))).toBe(true);
    });

    test("catalogo_tarjeta_03_no_disponible_sin_control_stock_es_no_disponible", () => {
        expect(estaDisponible(producto("A", { disponible: false, sinControlStock: false }))).toBe(false);
    });

    test("catalogo_tarjeta_03_sin_control_stock_siempre_disponible", () => {
        expect(estaDisponible(producto("A", { disponible: false, sinControlStock: true }))).toBe(true);
    });
});
