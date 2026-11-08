import { describe, expect, test, vi } from "vitest";
import { ejecutarConConflicto } from "#/tienda_admin/comun/errores.ts";

const intentar = vi.fn(async <T>(f: () => T) => f());

describe("[tienda_admin-articulo-publicacion-02] ejecutarConConflicto separa el 409 del resto de errores", () => {
    test("tienda_admin_articulo_publicacion_02_si_todo_va_bien_devuelve_true", async () => {
        const alConflicto = vi.fn();
        const ok = await ejecutarConConflicto(async () => undefined, intentar, alConflicto);
        expect(ok).toBe(true);
        expect(alConflicto).not.toHaveBeenCalled();
    });

    test("tienda_admin_articulo_publicacion_02_el_409_llega_al_manejador_y_no_al_dialogo", async () => {
        intentar.mockClear();
        const alConflicto = vi.fn();
        const ok = await ejecutarConConflicto(
            async () => Promise.reject({ estado: 409, descripcion: "slug repetido" }),
            intentar,
            alConflicto,
        );
        expect(ok).toBe(false);
        expect(alConflicto).toHaveBeenCalledWith({ campo: "slug", mensaje: "slug repetido" });
        expect(intentar).not.toHaveBeenCalled();
    });

    test("tienda_admin_articulo_publicacion_02_otros_errores_van_al_dialogo_de_errores", async () => {
        intentar.mockClear();
        const alConflicto = vi.fn();
        const ok = await ejecutarConConflicto(
            async () => Promise.reject({ estado: 400, descripcion: "mal" }),
            intentar,
            alConflicto,
        );
        expect(ok).toBe(false);
        expect(intentar).toHaveBeenCalledTimes(1);
        expect(alConflicto).not.toHaveBeenCalled();
    });
});
