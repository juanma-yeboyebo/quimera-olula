import { describe, expect, test } from "vitest";
import { NodoCategoria } from "#/tienda_admin/categoria/diseño.ts";
import {
    aplanarArbol,
    distintivosCategoria,
    hermanasDe,
    metaNuevaCategoria,
    motivoNoBorrable,
    moverEntreHermanas,
    nuevaCategoriaVacia,
    padresPosibles,
    resolverSoltado,
    zonaDeSoltado,
} from "#/tienda_admin/categoria/dominio.ts";
import { modeloEsValido } from "@olula/lib/dominio.ts";

const nodo = (
    id: string,
    padreId: string | null,
    hijas: NodoCategoria[] = [],
    extra: Partial<NodoCategoria> = {},
): NodoCategoria => ({
    id,
    padreId,
    codigo: `C${id}`,
    nombre: `Cat ${id}`,
    slug: `cat-${id}`,
    orden: 0,
    visible: true,
    enMenu: true,
    articulos: 0,
    hijas,
    ...extra,
});

const arbol = (): NodoCategoria[] => [
    nodo("1", null, [nodo("11", "1", [nodo("111", "11")]), nodo("12", "1")]),
    nodo("2", null),
    nodo("3", null),
];

describe("[tienda_admin-categoria-arbol-01] Distintivos y recorrido del árbol", () => {
    test("tienda_admin_categoria_arbol_01_oculta_si_no_es_visible", () => {
        expect(distintivosCategoria(nodo("1", null, [], { visible: false }))).toEqual(["Oculta"]);
    });

    test("tienda_admin_categoria_arbol_01_fuera_del_menu_si_no_esta_en_menu", () => {
        expect(distintivosCategoria(nodo("1", null, [], { enMenu: false }))).toEqual(["Fuera del menú"]);
    });

    test("tienda_admin_categoria_arbol_01_sin_distintivos_si_esta_visible_y_en_menu", () => {
        expect(distintivosCategoria(nodo("1", null))).toEqual([]);
    });

    test("tienda_admin_categoria_arbol_01_aplana_en_preorden_con_profundidad", () => {
        const plano = aplanarArbol(arbol()).map((p) => [p.nodo.id, p.profundidad]);
        expect(plano).toEqual([["1", 0], ["11", 1], ["111", 2], ["12", 1], ["2", 0], ["3", 0]]);
    });

    test("tienda_admin_categoria_arbol_01_hermanas_de_una_hija_y_de_una_raiz", () => {
        expect(hermanasDe(arbol(), "12").map((n) => n.id)).toEqual(["11", "12"]);
        expect(hermanasDe(arbol(), "2").map((n) => n.id)).toEqual(["1", "2", "3"]);
    });
});

describe("[tienda_admin-categoria-arbol-02] Subir y bajar reordenan entre hermanas", () => {
    test("tienda_admin_categoria_arbol_02_subir_intercambia_con_la_anterior", () => {
        expect(moverEntreHermanas(arbol(), "2", -1)).toEqual({
            tipo: "ordenar",
            padreId: null,
            ids: ["2", "1", "3"],
        });
    });

    test("tienda_admin_categoria_arbol_02_bajar_intercambia_con_la_siguiente", () => {
        expect(moverEntreHermanas(arbol(), "11", 1)).toEqual({
            tipo: "ordenar",
            padreId: "1",
            ids: ["12", "11"],
        });
    });

    test("tienda_admin_categoria_arbol_02_la_primera_no_sube", () => {
        expect(moverEntreHermanas(arbol(), "1", -1)).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_la_ultima_no_baja", () => {
        expect(moverEntreHermanas(arbol(), "3", 1)).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_id_inexistente_no_hace_nada", () => {
        expect(moverEntreHermanas(arbol(), "99", 1)).toBeNull();
    });
});

describe("[tienda_admin-categoria-arbol-02] Soltar un nodo reordena o mueve", () => {
    test("tienda_admin_categoria_arbol_02_soltar_antes_de_una_hermana_reordena", () => {
        expect(resolverSoltado(arbol(), "3", "1", "antes")).toEqual({
            tipo: "ordenar",
            padreId: null,
            ids: ["3", "1", "2"],
        });
    });

    test("tienda_admin_categoria_arbol_02_soltar_despues_de_una_hermana_reordena", () => {
        expect(resolverSoltado(arbol(), "1", "2", "despues")).toEqual({
            tipo: "ordenar",
            padreId: null,
            ids: ["2", "1", "3"],
        });
    });

    test("tienda_admin_categoria_arbol_02_soltar_sin_cambiar_posicion_no_hace_nada", () => {
        expect(resolverSoltado(arbol(), "1", "2", "antes")).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_soltar_dentro_de_otra_la_mueve", () => {
        expect(resolverSoltado(arbol(), "3", "2", "dentro")).toEqual({
            tipo: "mover",
            id: "3",
            padreId: "2",
        });
    });

    test("tienda_admin_categoria_arbol_02_soltar_dentro_de_su_padre_actual_no_hace_nada", () => {
        expect(resolverSoltado(arbol(), "11", "1", "dentro")).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_no_se_mueve_dentro_de_si_misma", () => {
        expect(resolverSoltado(arbol(), "1", "1", "dentro")).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_no_se_mueve_dentro_de_una_descendiente", () => {
        expect(resolverSoltado(arbol(), "1", "111", "dentro")).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_antes_o_despues_de_una_no_hermana_no_hace_nada", () => {
        expect(resolverSoltado(arbol(), "2", "11", "antes")).toBeNull();
    });

    test("tienda_admin_categoria_arbol_02_zona_segun_la_altura_del_puntero", () => {
        expect(zonaDeSoltado(2, 40)).toBe("antes");
        expect(zonaDeSoltado(20, 40)).toBe("dentro");
        expect(zonaDeSoltado(38, 40)).toBe("despues");
        expect(zonaDeSoltado(5, 0)).toBe("dentro");
    });
});

describe("[tienda_admin-categoria-arbol-02] Mover a… ofrece solo padres válidos", () => {
    test("tienda_admin_categoria_arbol_02_excluye_la_propia_sus_descendientes_y_el_padre_actual", () => {
        const ids = padresPosibles(arbol(), "11").map((p) => p.valor);
        expect(ids).not.toContain("11");
        expect(ids).not.toContain("111");
        expect(ids).not.toContain("1");
        expect(ids).toContain("12");
        expect(ids).toContain("2");
    });

    test("tienda_admin_categoria_arbol_02_una_hija_puede_pasar_a_primer_nivel", () => {
        expect(padresPosibles(arbol(), "12")[0]).toEqual({ valor: "", descripcion: "(Primer nivel)" });
    });

    test("tienda_admin_categoria_arbol_02_una_de_primer_nivel_no_ofrece_primer_nivel", () => {
        expect(padresPosibles(arbol(), "2").some((p) => p.valor === "")).toBe(false);
    });
});

describe("[tienda_admin-categoria-borrar-01] Una categoría con hijas o artículos no se puede borrar", () => {
    test("tienda_admin_categoria_borrar_01_con_hijas_indica_el_motivo", () => {
        expect(motivoNoBorrable(arbol()[0])).toBe("Tiene subcategorías");
    });

    test("tienda_admin_categoria_borrar_01_con_articulos_indica_cuantos", () => {
        expect(motivoNoBorrable(nodo("1", null, [], { articulos: 3 }))).toBe("Tiene 3 artículos");
        expect(motivoNoBorrable(nodo("1", null, [], { articulos: 1 }))).toBe("Tiene 1 artículo");
    });

    test("tienda_admin_categoria_borrar_01_vacia_se_puede_borrar", () => {
        expect(motivoNoBorrable(nodo("1", null))).toBeNull();
    });
});

describe("[tienda_admin-categoria-crear-01] El alta pide código y nombre y valida el slug", () => {
    const valida = modeloEsValido(metaNuevaCategoria);

    test("tienda_admin_categoria_crear_01_vacia_no_es_valida", () => {
        expect(valida(nuevaCategoriaVacia)).toBe(false);
    });

    test("tienda_admin_categoria_crear_01_con_codigo_y_nombre_es_valida_sin_slug", () => {
        expect(valida({ ...nuevaCategoriaVacia, codigo: "HIG", nombre: "Higiene" })).toBe(true);
    });

    test("tienda_admin_categoria_crear_01_rechaza_un_slug_con_mayusculas", () => {
        expect(valida({ ...nuevaCategoriaVacia, codigo: "HIG", nombre: "Higiene", slug: "Higiene" })).toBe(false);
    });

    test("tienda_admin_categoria_crear_01_rechaza_un_codigo_de_solo_espacios", () => {
        expect(valida({ ...nuevaCategoriaVacia, codigo: "  ", nombre: "Higiene" })).toBe(false);
    });

    test("tienda_admin_categoria_crear_01_por_defecto_es_visible_y_en_menu", () => {
        expect(nuevaCategoriaVacia.visible).toBe(true);
        expect(nuevaCategoriaVacia.enMenu).toBe(true);
    });
});
