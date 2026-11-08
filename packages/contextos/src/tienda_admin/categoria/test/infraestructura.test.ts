import { beforeEach, describe, expect, test, vi } from "vitest";

const get = vi.fn();
const getLista = vi.fn();
const post = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        get: (...a: unknown[]) => get(...a),
        getLista: (...a: unknown[]) => getLista(...a),
        post: (...a: unknown[]) => post(...a),
        patch: (...a: unknown[]) => patch(...a),
        delete: (...a: unknown[]) => del(...a),
    },
}));

const infra = await import("#/tienda_admin/categoria/infraestructura.ts");

const nuevaBase = { codigo: " HIG ", nombre: " Higiene ", slug: "higiene", visible: true, enMenu: false };

describe("[tienda_admin-categoria-arbol-01] El árbol se lee del servidor", () => {
    beforeEach(() => {
        getLista.mockReset();
    });

    test("tienda_admin_categoria_arbol_01_pide_el_arbol_del_website", async () => {
        getLista.mockResolvedValue([]);
        await infra.getArbolCategorias(4);
        expect(getLista.mock.calls[0][0]).toBe("/tienda_admin/categoria?website_id=4");
    });

    test("tienda_admin_categoria_arbol_01_convierte_recursivamente_a_camel_case_con_ids_en_texto", () => {
        const nodo = infra.nodoDesdeApi({
            id: 1,
            padre_id: null,
            codigo: "A",
            nombre: "A",
            slug: "a",
            orden: 2,
            visible: true,
            en_menu: false,
            articulos: 5,
            hijas: [
                {
                    id: 2, padre_id: 1, codigo: "B", nombre: "B", slug: "b", orden: 1,
                    visible: false, en_menu: true, articulos: 0, hijas: [],
                },
            ],
        });
        expect(nodo).toMatchObject({ id: "1", padreId: null, enMenu: false, articulos: 5 });
        expect(nodo.hijas[0]).toMatchObject({ id: "2", padreId: "1", visible: false, enMenu: true });
    });
});

describe("[tienda_admin-categoria-crear-01] Cuerpos de alta y cambio", () => {
    beforeEach(() => {
        post.mockReset();
        patch.mockReset();
    });

    test("tienda_admin_categoria_crear_01_el_cuerpo_de_alta_va_en_snake_case_y_recortado", () => {
        expect(infra.nuevaCategoriaAApi(2, null, nuevaBase)).toEqual({
            website_id: 2,
            padre_id: null,
            codigo: "HIG",
            nombre: "Higiene",
            slug: "higiene",
            visible: true,
            en_menu: false,
        });
    });

    test("tienda_admin_categoria_crear_01_la_subcategoria_envia_el_padre_como_numero", () => {
        expect(infra.nuevaCategoriaAApi(2, "7", nuevaBase).padre_id).toBe(7);
    });

    test("tienda_admin_categoria_crear_01_postCategoria_devuelve_el_id_como_texto", async () => {
        post.mockResolvedValue({ id: 9 });
        const id = await infra.postCategoria(2, null, nuevaBase);
        expect(id).toBe("9");
        expect(post.mock.calls[0][0]).toBe("/tienda_admin/categoria");
    });

    test("tienda_admin_categoria_detalle_01_el_cuerpo_de_cambios", () => {
        expect(
            infra.cambiosCategoriaAApi({ nombre: " X ", slug: "x", visible: false, enMenu: false }),
        ).toEqual({ nombre: "X", slug: "x", visible: false, en_menu: false });
    });

    test("tienda_admin_categoria_detalle_01_patchCategoria_llama_a_la_categoria", async () => {
        await infra.patchCategoria("5", { nombre: "X", slug: "x", visible: true, enMenu: true });
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/categoria/5");
    });
});

describe("[tienda_admin-categoria-arbol-02] Cuerpos de mover y ordenar", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("tienda_admin_categoria_arbol_02_mover_a_primer_nivel_envia_null", () => {
        expect(infra.moverCategoriaAApi(null)).toEqual({ padre_id: null });
    });

    test("tienda_admin_categoria_arbol_02_mover_envia_el_padre_como_numero", () => {
        expect(infra.moverCategoriaAApi("3")).toEqual({ padre_id: 3 });
    });

    test("tienda_admin_categoria_arbol_02_ordenar_envia_website_padre_e_ids_numericos", () => {
        expect(infra.ordenarCategoriasAApi(1, "4", ["6", "5"])).toEqual({
            website_id: 1,
            padre_id: 4,
            ids: [6, 5],
        });
    });

    test("tienda_admin_categoria_arbol_02_patchMoverCategoria_usa_la_ruta_mover", async () => {
        await infra.patchMoverCategoria("5", "2");
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/categoria/5/mover");
        expect(patch.mock.calls[0][1]).toEqual({ padre_id: 2 });
    });

    test("tienda_admin_categoria_arbol_02_patchOrdenarCategorias_usa_la_ruta_ordenar", async () => {
        await infra.patchOrdenarCategorias(1, null, ["2", "1"]);
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/categoria/ordenar");
        expect(patch.mock.calls[0][1]).toEqual({ website_id: 1, padre_id: null, ids: [2, 1] });
    });
});

describe("[tienda_admin-categoria-borrar-01] Borrar llama a DELETE", () => {
    test("tienda_admin_categoria_borrar_01_deleteCategoria", async () => {
        await infra.deleteCategoria("8");
        expect(del.mock.calls[0][0]).toBe("/tienda_admin/categoria/8");
    });
});
