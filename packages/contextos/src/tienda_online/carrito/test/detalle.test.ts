import { beforeEach, describe, expect, test, vi } from "vitest";
import { ContextoCarrito } from "#/tienda_online/carrito/detalle/diseño.ts";

const patchLineaCarrito = vi.fn();
const deleteLineaCarrito = vi.fn();
const obtenerToken = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();

vi.mock("#/tienda_online/carrito/infraestructura.ts", () => ({
    patchLineaCarrito: (token: string, lineaId: number, cantidad: number) =>
        patchLineaCarrito(token, lineaId, cantidad),
    deleteLineaCarrito: (token: string, lineaId: number) => deleteLineaCarrito(token, lineaId),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => obtenerToken(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
}));

const { cambiarCantidad, borrarLinea } = await import(
    "#/tienda_online/carrito/detalle/detalle.ts"
);

const NO_DISPONIBLE = "Este carrito ya no está disponible";

type Resultado = ContextoCarrito | [ContextoCarrito, unknown[]];
const ctxDe = (r: Resultado): ContextoCarrito => (Array.isArray(r) ? r[0] : r);

const ctxActualizando: ContextoCarrito = { estado: "ACTUALIZANDO", error: null };

beforeEach(() => {
    patchLineaCarrito.mockReset();
    deleteLineaCarrito.mockReset();
    obtenerToken.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    obtenerToken.mockReturnValue("tok-1");
    patchLineaCarrito.mockResolvedValue(undefined);
    deleteLineaCarrito.mockResolvedValue(undefined);
    recargarCarrito.mockResolvedValue(undefined);
});

describe("[carrito-lineas-03] [LISTO] cantidad_cambiada → ACTUALIZANDO → LISTO", () => {
    test("carrito_lineas_03_envia_el_patch_con_el_token_la_linea_y_la_cantidad", async () => {
        await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 3 });

        expect(patchLineaCarrito).toHaveBeenCalledOnce();
        expect(patchLineaCarrito).toHaveBeenCalledWith("tok-1", 7, 3);
    });

    test("carrito_lineas_03_recarga_el_carrito", async () => {
        await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 3 });

        expect(recargarCarrito).toHaveBeenCalledOnce();
    });

    test("carrito_lineas_03_vuelve_a_listo_sin_error", async () => {
        const r = ctxDe(await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 3 }));

        expect(r.estado).toBe("LISTO");
        expect(r.error).toBeNull();
    });

    test("carrito_lineas_03_limpia_un_error_anterior", async () => {
        const r = ctxDe(
            await cambiarCantidad(
                { estado: "ACTUALIZANDO", error: "error previo" },
                { lineaId: 7, cantidad: 3 },
            ),
        );

        expect(r.error).toBeNull();
    });

    test("carrito_lineas_03_no_olvida_el_carrito", async () => {
        await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 3 });

        expect(olvidarCarrito).not.toHaveBeenCalled();
    });
});

describe("[carrito-lineas-04] [LISTO] linea_borrada → ACTUALIZANDO → LISTO", () => {
    test("carrito_lineas_04_envia_el_delete_con_el_token_y_la_linea", async () => {
        await borrarLinea(ctxActualizando, { lineaId: 7 });

        expect(deleteLineaCarrito).toHaveBeenCalledOnce();
        expect(deleteLineaCarrito).toHaveBeenCalledWith("tok-1", 7);
    });

    test("carrito_lineas_04_recarga_el_carrito", async () => {
        await borrarLinea(ctxActualizando, { lineaId: 7 });

        expect(recargarCarrito).toHaveBeenCalledOnce();
    });

    test("carrito_lineas_04_vuelve_a_listo_sin_error", async () => {
        const r = ctxDe(await borrarLinea(ctxActualizando, { lineaId: 7 }));

        expect(r.estado).toBe("LISTO");
        expect(r.error).toBeNull();
    });

    test("carrito_lineas_04_no_llama_al_patch", async () => {
        await borrarLinea(ctxActualizando, { lineaId: 7 });

        expect(patchLineaCarrito).not.toHaveBeenCalled();
    });
});

describe("[carrito-lineas-05] [ACTUALIZANDO] error 400 → LISTO", () => {
    test("carrito_lineas_05_cambiar_muestra_el_texto_del_backend", async () => {
        patchLineaCarrito.mockRejectedValue({
            nombre: "Error",
            descripcion: "Stock insuficiente: quedan 3",
            estado: 400,
        });

        const r = ctxDe(await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 9 }));

        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe("Stock insuficiente: quedan 3");
    });

    test("carrito_lineas_05_cambiar_recarga_el_carrito_y_no_lo_olvida", async () => {
        patchLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "x", estado: 400 });

        await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 9 });

        expect(recargarCarrito).toHaveBeenCalledOnce();
        expect(olvidarCarrito).not.toHaveBeenCalled();
    });

    test("carrito_lineas_05_borrar_muestra_el_texto_del_backend_y_recarga", async () => {
        deleteLineaCarrito.mockRejectedValue({
            nombre: "Error",
            descripcion: "Cantidad no válida",
            estado: 400,
        });

        const r = ctxDe(await borrarLinea(ctxActualizando, { lineaId: 7 }));

        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe("Cantidad no válida");
        expect(recargarCarrito).toHaveBeenCalledOnce();
        expect(olvidarCarrito).not.toHaveBeenCalled();
    });
});

describe("[carrito-lineas-06] [ACTUALIZANDO] error 404 o 409 → LISTO", () => {
    test.each([404, 409])("carrito_lineas_06_cambiar_%i_olvida_el_carrito_y_avisa", async (estado) => {
        patchLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "carrito", estado });

        const r = ctxDe(await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 2 }));

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe(NO_DISPONIBLE);
    });

    test.each([404, 409])("carrito_lineas_06_borrar_%i_olvida_el_carrito_y_avisa", async (estado) => {
        deleteLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "carrito", estado });

        const r = ctxDe(await borrarLinea(ctxActualizando, { lineaId: 7 }));

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe(NO_DISPONIBLE);
    });

    test("carrito_lineas_06_no_muestra_el_texto_del_backend", async () => {
        patchLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "texto interno", estado: 404 });

        const r = ctxDe(await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 2 }));

        expect(r.error).not.toBe("texto interno");
    });
});

describe("[carrito-lineas-06] sin token → LISTO con aviso, sin llamadas a la API", () => {
    test("carrito_lineas_06_cambiar_sin_token_avisa_y_no_llama_a_la_api", async () => {
        obtenerToken.mockReturnValue(null);

        const r = ctxDe(await cambiarCantidad(ctxActualizando, { lineaId: 7, cantidad: 2 }));

        expect(patchLineaCarrito).not.toHaveBeenCalled();
        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe(NO_DISPONIBLE);
    });

    test("carrito_lineas_06_borrar_sin_token_avisa_y_no_llama_a_la_api", async () => {
        obtenerToken.mockReturnValue(null);

        const r = ctxDe(await borrarLinea(ctxActualizando, { lineaId: 7 }));

        expect(deleteLineaCarrito).not.toHaveBeenCalled();
        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe(NO_DISPONIBLE);
    });
});
