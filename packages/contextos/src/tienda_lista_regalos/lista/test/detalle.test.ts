import { beforeEach, describe, expect, test, vi } from "vitest";
import { LineaListaRegalos, ListaRegalos } from "#/tienda_lista_regalos/lista/diseño.ts";
import type { ContextoDetalleListaRegalos } from "#/tienda_lista_regalos/lista/detalle/diseño.ts";

const getListaRegalos = vi.fn();
const patchListaRegalos = vi.fn();
const patchLineaListaRegalos = vi.fn();

vi.mock("#/tienda_lista_regalos/lista/infraestructura.ts", () => ({
    getListaRegalos: (...a: unknown[]) => getListaRegalos(...a),
    patchListaRegalos: (...a: unknown[]) => patchListaRegalos(...a),
    patchLineaListaRegalos: (...a: unknown[]) => patchLineaListaRegalos(...a),
}));

const d = await import("#/tienda_lista_regalos/lista/detalle/detalle.ts");
const { getMaquina } = await import("#/tienda_lista_regalos/lista/detalle/maquina.ts");

const linea = (id: string, orden: number, extra: Partial<LineaListaRegalos> = {}): LineaListaRegalos => ({
    id, referencia: `R${id}`, descripcion: "", precio: 10, cantidad: 2,
    cantidadVendida: 0, pendiente: 2, orden, ...extra,
});

const lista = (extra: Partial<ListaRegalos> = {}): ListaRegalos => ({
    id: "7", websiteId: 1, cliente: { codigo: "C1", nombre: "Ana" }, nombre: "Boda",
    descripcion: "", token: "tok", url: "https://tienda/lista/tok", publicada: false,
    creada: "2026-11-01", lineas: [linea("1", 1), linea("2", 2), linea("3", 3)], ...extra,
});

const abierto = (extra: Partial<ContextoDetalleListaRegalos> = {}): ContextoDetalleListaRegalos => {
    const l = lista();
    return {
        estado: "ABIERTO",
        lista: l,
        lineas: { lista: l.lineas, total: l.lineas.length, activo: null },
        ...extra,
    };
};

beforeEach(() => {
    getListaRegalos.mockReset();
    patchListaRegalos.mockReset();
    patchLineaListaRegalos.mockReset();
});

describe("[lista_regalos-detalle-01] El detalle carga la lista y permite borrarla", () => {
    test("lista_regalos_detalle_01_cargar_abre_con_las_lineas", async () => {
        getListaRegalos.mockResolvedValue(lista());
        const [r] = (await d.cargarContexto(d.contextoDetalleListaRegalosInicial, "7")) as [ContextoDetalleListaRegalos];
        expect(getListaRegalos).toHaveBeenCalledWith("7");
        expect(r.estado).toBe("ABIERTO");
        expect(r.lineas.lista.map((l) => l.id)).toEqual(["1", "2", "3"]);
    });

    test("lista_regalos_detalle_01_sin_id_vacia_el_detalle", async () => {
        const r = (await d.cargarContexto(abierto(), undefined)) as ContextoDetalleListaRegalos;
        expect(getListaRegalos).not.toHaveBeenCalled();
        expect(r.estado).toBe("INICIAL");
        expect(r.lista.id).toBe("");
    });

    test("lista_regalos_detalle_01_borrar_pide_confirmacion_y_avisa_al_maestro", () => {
        const maquina = getMaquina();
        expect(maquina.ABIERTO.borrado_solicitado).toBe("BORRANDO");
        expect(maquina.BORRANDO.borrado_cancelado).toBe("ABIERTO");
        expect(maquina.BORRANDO.lista_borrada).toHaveLength(2);
    });

    test("lista_regalos_detalle_01_refrescar_propaga_el_item_al_maestro", async () => {
        getListaRegalos.mockResolvedValue(lista({ publicada: true }));
        const [r, eventos] = (await d.refrescarLista(abierto())) as [ContextoDetalleListaRegalos, [string, { publicada: boolean; unidades: number }][]];
        expect(r.lista.publicada).toBe(true);
        expect(eventos[0][0]).toBe("lista_cambiada");
        expect(eventos[0][1]).toMatchObject({ publicada: true, unidades: 6 });
    });
});

describe("[lista_regalos-datos-01] Guardar los datos", () => {
    test("lista_regalos_datos_01_sin_cambios_no_llama_al_servidor", async () => {
        const ctx = abierto();
        const guardado = await d.guardarDatos(ctx, {
            clienteId: "C1", clienteNombre: "Ana", nombre: "Boda", descripcion: "", publicada: false,
        });
        expect(guardado).toBe(false);
        expect(patchListaRegalos).not.toHaveBeenCalled();
    });

    test("lista_regalos_datos_01_con_cambios_llama_a_patch", async () => {
        const guardado = await d.guardarDatos(abierto(), {
            clienteId: "C1", clienteNombre: "Ana", nombre: "Boda", descripcion: "Mesa", publicada: true,
        });
        expect(guardado).toBe(true);
        expect(patchListaRegalos).toHaveBeenCalledWith("7", { descripcion: "Mesa", publicada: true });
    });

    test("lista_regalos_datos_01_tras_guardar_se_refresca", () => {
        expect(getMaquina().ABIERTO.lista_guardada).toEqual([d.refrescarLista]);
    });
});

describe("[lista_regalos-productos-02] Añadir producto", () => {
    test("lista_regalos_productos_02_la_maquina_abre_y_cierra_el_modal", () => {
        const maquina = getMaquina();
        expect(maquina.ABIERTO.alta_linea_solicitada).toBe("CREANDO_LINEA");
        expect(maquina.CREANDO_LINEA.alta_de_linea_cancelada).toBe("ABIERTO");
        expect(maquina.CREANDO_LINEA.linea_creada).toEqual([d.onLineaCreada, "ABIERTO"]);
    });

    test("lista_regalos_productos_02_tras_crear_se_recarga_y_activa_la_nueva", async () => {
        getListaRegalos.mockResolvedValue(lista({ lineas: [linea("1", 1), linea("4", 2)] }));
        const [r] = (await d.onLineaCreada(abierto(), "4")) as [ContextoDetalleListaRegalos];
        expect(r.lineas.lista.map((l) => l.id)).toEqual(["1", "4"]);
        expect(r.lineas.activo?.id).toBe("4");
    });
});

describe("[lista_regalos-productos-03] Al pulsar una línea se abre el modal de cambio", () => {
    test("lista_regalos_productos_03_seleccionar_activa_y_abre_el_modal", () => {
        const maquina = getMaquina();
        expect(maquina.ABIERTO.linea_seleccionada).toEqual([d.Lineas.activar, "CAMBIANDO_LINEA"]);
        expect(maquina.CAMBIANDO_LINEA.cambio_de_linea_cancelado).toBe("ABIERTO");
        expect(maquina.CAMBIANDO_LINEA.linea_cambiada).toEqual([d.onLineaCambiada, "ABIERTO"]);
    });

    test("lista_regalos_productos_03_tras_cambiar_se_recarga", async () => {
        getListaRegalos.mockResolvedValue(lista());
        const [r] = (await d.onLineaCambiada(abierto(), linea("2", 2))) as [ContextoDetalleListaRegalos];
        expect(getListaRegalos).toHaveBeenCalledWith("7");
        expect(r.lineas.activo?.id).toBe("2");
    });
});

describe("[lista_regalos-productos-04] Borrar una línea con confirmación", () => {
    test("lista_regalos_productos_04_la_maquina_pide_confirmacion", () => {
        const maquina = getMaquina();
        expect(maquina.ABIERTO.baja_linea_solicitada).toEqual([d.Lineas.activar, "BORRANDO_LINEA"]);
        expect(maquina.BORRANDO_LINEA.borrado_de_linea_cancelado).toBe("ABIERTO");
        expect(maquina.BORRANDO_LINEA.linea_borrada).toEqual([d.onLineaBorrada, "ABIERTO"]);
    });

    test("lista_regalos_productos_04_tras_borrar_se_recarga_sin_linea_activa", async () => {
        getListaRegalos.mockResolvedValue(lista({ lineas: [linea("1", 1)] }));
        const ctx = abierto();
        const [r] = (await d.onLineaBorrada({ ...ctx, lineas: { ...ctx.lineas, activo: ctx.lineas.lista[1] } })) as [ContextoDetalleListaRegalos];
        expect(r.lineas.lista.map((l) => l.id)).toEqual(["1"]);
        expect(r.lineas.activo).toBeNull();
    });
});

describe("[lista_regalos-productos-05] Subir y bajar con dos PATCH", () => {
    test("lista_regalos_productos_05_subir_intercambia_el_orden_y_recarga", async () => {
        getListaRegalos.mockResolvedValue(lista());
        await d.subirLinea(abierto(), "2");
        expect(patchLineaListaRegalos.mock.calls).toEqual([
            ["7", "2", { orden: 1 }],
            ["7", "1", { orden: 2 }],
        ]);
        expect(getListaRegalos).toHaveBeenCalledWith("7");
    });

    test("lista_regalos_productos_05_bajar_intercambia_con_la_siguiente", async () => {
        getListaRegalos.mockResolvedValue(lista());
        await d.bajarLinea(abierto(), "2");
        expect(patchLineaListaRegalos.mock.calls).toEqual([
            ["7", "2", { orden: 3 }],
            ["7", "3", { orden: 2 }],
        ]);
    });

    test("lista_regalos_productos_05_la_ultima_no_baja_y_no_llama_al_servidor", async () => {
        const ctx = abierto();
        expect(await d.bajarLinea(ctx, "3")).toBe(ctx);
        expect(patchLineaListaRegalos).not.toHaveBeenCalled();
        expect(getListaRegalos).not.toHaveBeenCalled();
    });

    test("lista_regalos_productos_05_la_maquina_enlaza_subir_y_bajar", () => {
        const maquina = getMaquina();
        expect(maquina.ABIERTO.subir_linea_solicitado).toEqual([d.subirLinea]);
        expect(maquina.ABIERTO.bajar_linea_solicitado).toEqual([d.bajarLinea]);
    });
});
