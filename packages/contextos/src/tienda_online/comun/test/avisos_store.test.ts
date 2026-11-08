import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
    cerrarAviso,
    mostrarAviso,
    obtenerAvisos,
    pausarAviso,
    reanudarAviso,
    reiniciarAvisos,
    suscribirAvisos,
} from "#/tienda_online/comun/avisos_store.ts";

beforeEach(() => {
    vi.useFakeTimers();
    reiniciarAvisos();
});

afterEach(() => {
    reiniciarAvisos();
    vi.useRealTimers();
});

describe("[tienda-avisos-01] mostrarAviso añade un aviso con id y cerrarAviso lo quita", () => {
    test("tienda_avisos_01_mostrar_añade_con_id_y_notifica", () => {
        const cb = vi.fn();
        const baja = suscribirAvisos(cb);

        const id = mostrarAviso({ texto: "Hola", tipo: "ok" });

        expect(obtenerAvisos()).toEqual([{ id, texto: "Hola", tipo: "ok" }]);
        expect(cb).toHaveBeenCalled();
        baja();
    });

    test("tienda_avisos_01_los_ids_son_distintos", () => {
        const a = mostrarAviso({ texto: "A", tipo: "ok" });
        const b = mostrarAviso({ texto: "B", tipo: "error" });

        expect(a).not.toBe(b);
    });

    test("tienda_avisos_01_cerrar_quita_el_aviso", () => {
        const a = mostrarAviso({ texto: "A", tipo: "ok" });
        const b = mostrarAviso({ texto: "B", tipo: "ok" });

        cerrarAviso(a);

        expect(obtenerAvisos().map((x) => x.id)).toEqual([b]);
    });

    test("tienda_avisos_01_cerrar_un_id_inexistente_no_notifica", () => {
        const cb = vi.fn();
        const baja = suscribirAvisos(cb);

        cerrarAviso(999);

        expect(cb).not.toHaveBeenCalled();
        baja();
    });
});

describe("[tienda-avisos-02] el aviso se cierra solo a los 3000 ms y se puede pausar", () => {
    test("tienda_avisos_02_se_cierra_a_los_3000_ms", () => {
        mostrarAviso({ texto: "A", tipo: "ok" });

        vi.advanceTimersByTime(2999);
        expect(obtenerAvisos()).toHaveLength(1);

        vi.advanceTimersByTime(1);
        expect(obtenerAvisos()).toHaveLength(0);
    });

    test("tienda_avisos_02_pausado_no_se_cierra", () => {
        const id = mostrarAviso({ texto: "A", tipo: "ok" });

        pausarAviso(id);
        vi.advanceTimersByTime(10000);

        expect(obtenerAvisos()).toHaveLength(1);
    });

    test("tienda_avisos_02_al_reanudar_cuenta_otros_3000_ms", () => {
        const id = mostrarAviso({ texto: "A", tipo: "ok" });

        vi.advanceTimersByTime(2000);
        pausarAviso(id);
        reanudarAviso(id);
        vi.advanceTimersByTime(2999);
        expect(obtenerAvisos()).toHaveLength(1);

        vi.advanceTimersByTime(1);
        expect(obtenerAvisos()).toHaveLength(0);
    });
});

describe("[tienda-avisos-03] como mucho 3 avisos visibles: salen los más antiguos", () => {
    test("tienda_avisos_03_el_cuarto_expulsa_al_primero", () => {
        mostrarAviso({ texto: "1", tipo: "ok" });
        mostrarAviso({ texto: "2", tipo: "ok" });
        mostrarAviso({ texto: "3", tipo: "ok" });
        mostrarAviso({ texto: "4", tipo: "ok" });

        expect(obtenerAvisos().map((a) => a.texto)).toEqual(["2", "3", "4"]);
    });
});
