import { beforeEach, describe, expect, test, vi } from "vitest";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { ArticuloWeb } from "#/tienda_admin/articulo/diseño.ts";
import { filtrosArticuloIniciales } from "#/tienda_admin/articulo/dominio.ts";
import type { ContextoMaestroArticulo } from "#/tienda_admin/articulo/maestro/diseño.ts";

const getArticulos = vi.fn();
const getArbolCategorias = vi.fn();

vi.mock("#/tienda_admin/articulo/infraestructura.ts", () => ({
    getArticulos: (...a: unknown[]) => getArticulos(...a),
}));
vi.mock("#/tienda_admin/categoria/infraestructura.ts", () => ({
    getArbolCategorias: (...a: unknown[]) => getArbolCategorias(...a),
}));

const m = await import("#/tienda_admin/articulo/maestro/maestro.ts");

const art = (id: string): ArticuloWeb => ({
    id, referencia: id, descripcion: id, imagen: null, publicado: true, visible: true, destacado: false,
});

const ctx = (extra: Partial<ContextoMaestroArticulo> = {}): ContextoMaestroArticulo => ({
    estado: "INICIAL",
    articulos: listaActivaEntidadesInicial<ArticuloWeb>(undefined, criteriaDefecto),
    filtros: { ...filtrosArticuloIniciales, websiteId: 1 },
    opcionesCategoria: [],
    ...extra,
});

describe("[tienda_admin-articulo-maestro-01] El maestro lista los artículos del website activo", () => {
    beforeEach(() => {
        getArticulos.mockReset();
        getArbolCategorias.mockReset();
    });

    test("tienda_admin_articulo_maestro_01_recargar_usa_los_filtros_y_el_criteria_del_contexto", async () => {
        getArticulos.mockResolvedValue({ datos: [art("A1"), art("A2")], total: 2 });
        const contexto = ctx();
        const r = (await m.recargarArticulos(contexto)) as ContextoMaestroArticulo;
        expect(getArticulos).toHaveBeenCalledWith(contexto.filtros, contexto.articulos.criteria);
        expect(r.articulos.lista.map((a) => a.id)).toEqual(["A1", "A2"]);
        expect(r.articulos.total).toBe(2);
    });

    test("tienda_admin_articulo_maestro_01_sin_website_no_llama_al_servidor", async () => {
        const contexto = ctx({ filtros: filtrosArticuloIniciales });
        const r = await m.recargarArticulos(contexto);
        expect(getArticulos).not.toHaveBeenCalled();
        expect(r).toBe(contexto);
    });

    test("tienda_admin_articulo_maestro_01_ampliar_anade_a_la_lista", async () => {
        getArticulos.mockResolvedValue({ datos: [art("A3")], total: 3 });
        const base = ctx();
        const contexto = ctx({ articulos: { ...base.articulos, lista: [art("A1"), art("A2")], total: 3 } });
        const r = (await m.ampliarArticulos(contexto)) as ContextoMaestroArticulo;
        expect(r.articulos.lista.map((a) => a.id)).toEqual(["A1", "A2", "A3"]);
    });

    test("tienda_admin_articulo_maestro_01_cambiar_website_carga_las_categorias_y_reinicia_categoria_y_seleccion", async () => {
        getArbolCategorias.mockResolvedValue([
            {
                id: "1", padreId: null, codigo: "1", nombre: "Ropa", slug: "ropa", orden: 0,
                visible: true, enMenu: true, articulos: 0, hijas: [],
            },
        ]);
        const base = ctx({ filtros: { ...filtrosArticuloIniciales, websiteId: 1, categoriaId: "9" } });
        const contexto = ctx({
            filtros: base.filtros,
            articulos: { ...base.articulos, activo: "A1" },
        });
        const r = (await m.cambiarWebsite(contexto, 2)) as ContextoMaestroArticulo;
        expect(getArbolCategorias).toHaveBeenCalledWith(2);
        expect(r.filtros).toMatchObject({ websiteId: 2, categoriaId: null });
        expect(r.articulos.activo).toBeUndefined();
        expect(r.opcionesCategoria.map((o) => o.valor)).toEqual(["", "1"]);
    });
});

describe("[tienda_admin-articulo-maestro-02] Cambiar un filtro vuelve a la primera página", () => {
    test("tienda_admin_articulo_maestro_02_fusiona_los_filtros_y_reinicia_la_pagina", async () => {
        const base = ctx();
        const contexto = ctx({
            articulos: {
                ...base.articulos,
                criteria: { ...base.articulos.criteria, paginacion: { limite: 10, pagina: 4 } },
            },
        });
        const r = (await m.cambiarFiltros(contexto, { estado: "publicado" })) as ContextoMaestroArticulo;
        expect(r.filtros).toMatchObject({ websiteId: 1, estado: "publicado", texto: "" });
        expect(r.articulos.criteria.paginacion).toEqual({ limite: 10, pagina: 1 });
    });

    test("tienda_admin_articulo_maestro_02_cambiar_el_texto_conserva_el_resto", async () => {
        const contexto = ctx({ filtros: { ...filtrosArticuloIniciales, websiteId: 1, estado: "no_publicado" } });
        const r = (await m.cambiarFiltros(contexto, { texto: "cam" })) as ContextoMaestroArticulo;
        expect(r.filtros).toMatchObject({ texto: "cam", estado: "no_publicado" });
    });
});
