import { beforeEach, describe, expect, test, vi } from "vitest";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { ItemListaRegalos, ListaRegalos } from "#/tienda_lista_regalos/lista/diseño.ts";
import { criteriaListasDefecto, filtrosListaRegalosIniciales } from "#/tienda_lista_regalos/lista/dominio.ts";
import type { ContextoMaestroListaRegalos } from "#/tienda_lista_regalos/lista/maestro/diseño.ts";

const getListasRegalos = vi.fn();
const getListaRegalos = vi.fn();

vi.mock("#/tienda_lista_regalos/lista/infraestructura.ts", () => ({
    getListasRegalos: (...a: unknown[]) => getListasRegalos(...a),
    getListaRegalos: (...a: unknown[]) => getListaRegalos(...a),
}));

const m = await import("#/tienda_lista_regalos/lista/maestro/maestro.ts");
const { getMaquina } = await import("#/tienda_lista_regalos/lista/maestro/maquina.ts");

const item = (id: string): ItemListaRegalos => ({
    id, websiteId: 1, cliente: { codigo: "C1", nombre: "Ana" }, nombre: id,
    publicada: false, creada: "2026-11-01", lineas: 0, unidades: 0, vendidas: 0,
});

const ctx = (extra: Partial<ContextoMaestroListaRegalos> = {}): ContextoMaestroListaRegalos => ({
    estado: "INICIAL",
    listas: listaActivaEntidadesInicial<ItemListaRegalos>(undefined, criteriaListasDefecto),
    filtros: { ...filtrosListaRegalosIniciales, websiteId: 1 },
    ...extra,
});

describe("[lista_regalos-maestro-01] El maestro lista las listas del website activo", () => {
    beforeEach(() => {
        getListasRegalos.mockReset();
    });

    test("lista_regalos_maestro_01_recargar_usa_filtros_y_criteria", async () => {
        getListasRegalos.mockResolvedValue({ datos: [item("1"), item("2")], total: 2 });
        const contexto = ctx();
        const r = (await m.recargarListas(contexto)) as ContextoMaestroListaRegalos;
        expect(getListasRegalos).toHaveBeenCalledWith(contexto.filtros, contexto.listas.criteria);
        expect(r.listas.lista.map((l) => l.id)).toEqual(["1", "2"]);
        expect(r.listas.total).toBe(2);
    });

    test("lista_regalos_maestro_01_sin_website_no_llama_al_servidor", async () => {
        const contexto = ctx({ filtros: filtrosListaRegalosIniciales });
        expect(await m.recargarListas(contexto)).toBe(contexto);
        expect(getListasRegalos).not.toHaveBeenCalled();
    });

    test("lista_regalos_maestro_01_ampliar_anade_a_la_lista", async () => {
        getListasRegalos.mockResolvedValue({ datos: [item("3")], total: 3 });
        const base = ctx();
        const contexto = ctx({ listas: { ...base.listas, lista: [item("1"), item("2")], total: 3 } });
        const r = (await m.ampliarListas(contexto)) as ContextoMaestroListaRegalos;
        expect(r.listas.lista.map((l) => l.id)).toEqual(["1", "2", "3"]);
    });

    test("lista_regalos_maestro_01_cambiar_website_reinicia_la_seleccion", async () => {
        const base = ctx();
        const r = (await m.cambiarWebsite(ctx({ listas: { ...base.listas, activo: "1" } }), 2)) as ContextoMaestroListaRegalos;
        expect(r.filtros.websiteId).toBe(2);
        expect(r.listas.activo).toBeUndefined();
    });

    test("lista_regalos_maestro_01_la_maquina_recarga_al_cambiar_de_website", () => {
        expect(getMaquina().INICIAL.website_cambiado).toEqual([m.cambiarWebsite, m.recargarListas]);
    });
});

describe("[lista_regalos-maestro-02] Cambiar el texto vuelve a la primera página", () => {
    test("lista_regalos_maestro_02_fusiona_el_texto_y_reinicia_la_pagina", async () => {
        const base = ctx();
        const contexto = ctx({
            listas: { ...base.listas, criteria: { ...base.listas.criteria, paginacion: { limite: 10, pagina: 4 } } },
        });
        const r = (await m.cambiarFiltros(contexto, { texto: "ana" })) as ContextoMaestroListaRegalos;
        expect(r.filtros).toEqual({ websiteId: 1, texto: "ana" });
        expect(r.listas.criteria.paginacion).toEqual({ limite: 10, pagina: 1 });
    });

    test("lista_regalos_maestro_02_la_maquina_recarga_al_cambiar_el_filtro", () => {
        expect(getMaquina().INICIAL.filtros_cambiados).toEqual([m.cambiarFiltros, m.recargarListas]);
    });
});

describe("[lista_regalos-crear-01] Nueva lista", () => {
    beforeEach(() => {
        getListaRegalos.mockReset();
    });

    test("lista_regalos_crear_01_la_maquina_abre_y_cierra_el_modal", () => {
        const maquina = getMaquina();
        expect(maquina.INICIAL.crear_lista_solicitado).toBe("CREANDO");
        expect(maquina.CREANDO.alta_de_lista_cancelada).toBe("INICIAL");
        expect(maquina.CREANDO.lista_creada).toBe(m.incluirListaCreadaPorId);
    });

    test("lista_regalos_crear_01_la_lista_creada_se_incluye_y_se_abre", async () => {
        const creada: ListaRegalos = {
            id: "9", websiteId: 1, cliente: { codigo: "C1", nombre: "Ana" }, nombre: "Boda",
            descripcion: "", token: "t", url: null, publicada: false, creada: "2026-11-02", lineas: [],
        };
        getListaRegalos.mockResolvedValue(creada);
        const base = ctx();
        const contexto = ctx({ estado: "CREANDO", listas: { ...base.listas, lista: [item("1")], total: 1 } });
        const r = (await m.incluirListaCreadaPorId(contexto, "9")) as ContextoMaestroListaRegalos;
        expect(getListaRegalos).toHaveBeenCalledWith("9");
        expect(r.estado).toBe("INICIAL");
        expect(r.listas.activo).toBe("9");
        expect(r.listas.total).toBe(2);
        expect(r.listas.lista.map((l) => l.id)).toEqual(["9", "1"]);
        expect(r.listas.lista[0]).toMatchObject({ lineas: 0, unidades: 0, vendidas: 0 });
    });
});
