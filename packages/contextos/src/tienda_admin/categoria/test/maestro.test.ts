import { beforeEach, describe, expect, test, vi } from "vitest";
import { NodoCategoria } from "#/tienda_admin/categoria/diseño.ts";
import type { ContextoMaestroCategoria } from "#/tienda_admin/categoria/maestro/diseño.ts";

const getArbolCategorias = vi.fn();
const patchOrdenarCategorias = vi.fn();
const patchMoverCategoria = vi.fn();

vi.mock("#/tienda_admin/categoria/infraestructura.ts", () => ({
    getArbolCategorias: (...a: unknown[]) => getArbolCategorias(...a),
    patchOrdenarCategorias: (...a: unknown[]) => patchOrdenarCategorias(...a),
    patchMoverCategoria: (...a: unknown[]) => patchMoverCategoria(...a),
}));

const m = await import("#/tienda_admin/categoria/maestro/maestro.ts");

const nodo = (id: string, padreId: string | null, hijas: NodoCategoria[] = []): NodoCategoria => ({
    id, padreId, codigo: id, nombre: id, slug: id, orden: 0,
    visible: true, enMenu: true, articulos: 0, hijas,
});

const arbol = [nodo("1", null), nodo("2", null), nodo("3", null)];

const ctx = (extra: Partial<ContextoMaestroCategoria> = {}): ContextoMaestroCategoria => ({
    ...m.contextoMaestroCategoriaInicial,
    websiteId: 7,
    arbol,
    ...extra,
});

describe("[tienda_admin-categoria-arbol-01] El maestro carga el árbol del website activo", () => {
    beforeEach(() => {
        getArbolCategorias.mockReset();
    });

    test("tienda_admin_categoria_arbol_01_cambiar_website_limpia_la_seleccion", async () => {
        const r = await m.cambiarWebsite(ctx({ activa: "2" }), 9);
        expect(r).toMatchObject({ websiteId: 9, activa: undefined });
    });

    test("tienda_admin_categoria_arbol_01_recargar_pide_el_arbol_del_website", async () => {
        getArbolCategorias.mockResolvedValue([nodo("5", null)]);
        const r = (await m.recargarArbol(ctx())) as ContextoMaestroCategoria;
        expect(getArbolCategorias).toHaveBeenCalledWith(7);
        expect(r.arbol.map((n) => n.id)).toEqual(["5"]);
    });

    test("tienda_admin_categoria_arbol_01_recargar_sin_website_no_llama_al_servidor", async () => {
        const r = await m.recargarArbol(ctx({ websiteId: null }));
        expect(getArbolCategorias).not.toHaveBeenCalled();
        expect((r as ContextoMaestroCategoria).arbol).toBe(arbol);
    });

    test("tienda_admin_categoria_arbol_01_conserva_la_activa_si_sigue_existiendo", async () => {
        getArbolCategorias.mockResolvedValue(arbol);
        const r = (await m.recargarArbol(ctx({ activa: "2" }))) as ContextoMaestroCategoria;
        expect(r.activa).toBe("2");
    });

    test("tienda_admin_categoria_arbol_01_deselecciona_si_la_activa_ya_no_existe", async () => {
        getArbolCategorias.mockResolvedValue([nodo("1", null)]);
        const r = (await m.recargarArbol(ctx({ activa: "2" }))) as ContextoMaestroCategoria;
        expect(r.activa).toBeUndefined();
    });
});

describe("[tienda_admin-categoria-arbol-02] Subir, bajar, soltar y mover llaman al servidor", () => {
    beforeEach(() => {
        patchOrdenarCategorias.mockReset();
        patchMoverCategoria.mockReset();
    });

    test("tienda_admin_categoria_arbol_02_subir_ordena_las_hermanas", async () => {
        await m.subirCategoria(ctx(), "2");
        expect(patchOrdenarCategorias).toHaveBeenCalledWith(7, null, ["2", "1", "3"]);
    });

    test("tienda_admin_categoria_arbol_02_bajar_ordena_las_hermanas", async () => {
        await m.bajarCategoria(ctx(), "1");
        expect(patchOrdenarCategorias).toHaveBeenCalledWith(7, null, ["2", "1", "3"]);
    });

    test("tienda_admin_categoria_arbol_02_subir_la_primera_no_llama", async () => {
        await m.subirCategoria(ctx(), "1");
        expect(patchOrdenarCategorias).not.toHaveBeenCalled();
    });

    test("tienda_admin_categoria_arbol_02_soltar_entre_hermanas_ordena", async () => {
        await m.soltarCategoria(ctx(), { origenId: "3", destinoId: "1", posicion: "antes" });
        expect(patchOrdenarCategorias).toHaveBeenCalledWith(7, null, ["3", "1", "2"]);
    });

    test("tienda_admin_categoria_arbol_02_soltar_dentro_mueve", async () => {
        await m.soltarCategoria(ctx(), { origenId: "3", destinoId: "2", posicion: "dentro" });
        expect(patchMoverCategoria).toHaveBeenCalledWith("3", "2");
    });

    test("tienda_admin_categoria_arbol_02_soltar_sobre_si_misma_no_llama", async () => {
        await m.soltarCategoria(ctx(), { origenId: "3", destinoId: "3", posicion: "dentro" });
        expect(patchMoverCategoria).not.toHaveBeenCalled();
        expect(patchOrdenarCategorias).not.toHaveBeenCalled();
    });

    test("tienda_admin_categoria_arbol_02_si_el_servidor_falla_el_error_se_propaga_y_el_contexto_no_cambia", async () => {
        patchMoverCategoria.mockRejectedValue({ estado: 400, descripcion: "no" });
        const contexto = ctx();
        await expect(
            m.soltarCategoria(contexto, { origenId: "3", destinoId: "2", posicion: "dentro" }),
        ).rejects.toMatchObject({ estado: 400 });
        expect(contexto.arbol).toBe(arbol);
    });

    test("tienda_admin_categoria_arbol_02_mover_a_abre_el_modal_con_la_categoria", async () => {
        const r = await m.iniciarMovimiento(ctx(), "2");
        expect(r).toMatchObject({ estado: "MOVIENDO", moviendo: "2" });
    });

    test("tienda_admin_categoria_arbol_02_confirmar_movimiento_mueve_y_vuelve_a_inicial", async () => {
        const r = await m.confirmarMovimiento(ctx({ estado: "MOVIENDO", moviendo: "3" }), "1");
        expect(patchMoverCategoria).toHaveBeenCalledWith("3", "1");
        expect(r).toMatchObject({ estado: "INICIAL", moviendo: null });
    });

    test("tienda_admin_categoria_arbol_02_confirmar_movimiento_a_primer_nivel_envia_null", async () => {
        await m.confirmarMovimiento(ctx({ estado: "MOVIENDO", moviendo: "3" }), "");
        expect(patchMoverCategoria).toHaveBeenCalledWith("3", null);
    });
});

describe("[tienda_admin-categoria-crear-01] Alta de categorías desde el maestro", () => {
    test("tienda_admin_categoria_crear_01_nueva_categoria_es_de_primer_nivel", async () => {
        const r = await m.iniciarAlta(ctx(), null);
        expect(r).toMatchObject({ estado: "CREANDO", padreAlta: null });
    });

    test("tienda_admin_categoria_crear_01_anadir_subcategoria_usa_la_seleccionada_como_padre", async () => {
        const r = await m.iniciarAlta(ctx(), "2");
        expect(r).toMatchObject({ estado: "CREANDO", padreAlta: "2" });
    });

    test("tienda_admin_categoria_crear_01_tras_crear_se_selecciona_la_nueva", async () => {
        const r = await m.categoriaCreada(ctx({ estado: "CREANDO", padreAlta: "2" }), "9");
        expect(r).toMatchObject({ estado: "INICIAL", padreAlta: null, activa: "9" });
    });
});
