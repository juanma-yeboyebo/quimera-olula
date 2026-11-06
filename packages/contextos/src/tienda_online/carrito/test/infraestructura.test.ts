import { beforeEach, describe, expect, test, vi } from "vitest";

const patch = vi.fn();
const del = vi.fn();
const codigoStoreViewActivo = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        patch: (url: string, body: unknown, msg?: string, headers?: Record<string, string>) =>
            patch(url, body, msg, headers),
        delete: (url: string, msg?: string, headers?: Record<string, string>) =>
            del(url, msg, headers),
    },
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => null,
}));

vi.mock("#/tienda_online/comun/storeview.ts", () => ({
    codigoStoreViewActivo: () => codigoStoreViewActivo(),
}));

const { patchLineaCarrito, deleteLineaCarrito } = await import(
    "#/tienda_online/carrito/infraestructura.ts"
);

beforeEach(() => {
    patch.mockReset();
    del.mockReset();
    codigoStoreViewActivo.mockReset();
    codigoStoreViewActivo.mockReturnValue("sanhigia_es");
    patch.mockResolvedValue(undefined);
    del.mockResolvedValue(undefined);
});

describe("[carrito-lineas-03] cantidad_cambiada envía PATCH …/linea/<id> con {cantidad}", () => {
    test("carrito_lineas_03_patch_a_la_ruta_de_la_linea", async () => {
        await patchLineaCarrito("tok-1", 7, 3);

        expect(patch).toHaveBeenCalledOnce();
        expect(patch.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1/linea/7");
    });

    test("carrito_lineas_03_envia_la_cantidad_en_el_body", async () => {
        await patchLineaCarrito("tok-1", 7, 3);

        expect(patch.mock.calls[0][1]).toEqual({ cantidad: 3 });
    });

    test("carrito_lineas_03_envia_la_cabecera_x_store_view", async () => {
        await patchLineaCarrito("tok-1", 7, 3);

        expect(patch.mock.calls[0][3]).toMatchObject({ "X-Store-View": "sanhigia_es" });
    });

    test("carrito_lineas_03_propaga_el_error_del_backend", async () => {
        const error = { nombre: "Error", descripcion: "Stock insuficiente", estado: 400 };
        patch.mockRejectedValue(error);

        await expect(patchLineaCarrito("tok-1", 7, 99)).rejects.toEqual(error);
    });
});

describe("[carrito-lineas-04] linea_borrada envía DELETE …/linea/<id>", () => {
    test("carrito_lineas_04_delete_a_la_ruta_de_la_linea", async () => {
        await deleteLineaCarrito("tok-1", 7);

        expect(del).toHaveBeenCalledOnce();
        expect(del.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1/linea/7");
    });

    test("carrito_lineas_04_envia_la_cabecera_x_store_view", async () => {
        await deleteLineaCarrito("tok-1", 7);

        expect(del.mock.calls[0][2]).toMatchObject({ "X-Store-View": "sanhigia_es" });
    });

    test("carrito_lineas_04_propaga_el_error_del_backend", async () => {
        const error = { nombre: "Error", descripcion: "no modificable", estado: 409 };
        del.mockRejectedValue(error);

        await expect(deleteLineaCarrito("tok-1", 7)).rejects.toEqual(error);
    });
});
