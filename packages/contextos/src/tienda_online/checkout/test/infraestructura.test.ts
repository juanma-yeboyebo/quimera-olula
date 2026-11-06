import { beforeEach, describe, expect, test, vi } from "vitest";

const patch = vi.fn();
const post = vi.fn();
const codigoStoreViewActivo = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        patch: (url: string, body: unknown, msg?: string, headers?: Record<string, string>) =>
            patch(url, body, msg, headers),
        post: (url: string, body: unknown, msg?: string, headers?: Record<string, string>) =>
            post(url, body, msg, headers),
    },
}));

vi.mock("#/tienda_online/comun/storeview.ts", () => ({
    codigoStoreViewActivo: () => codigoStoreViewActivo(),
}));

const { patchDatosCheckout, postIniciarPago, postCancelarPago } = await import(
    "#/tienda_online/checkout/infraestructura.ts"
);

beforeEach(() => {
    patch.mockReset();
    post.mockReset();
    codigoStoreViewActivo.mockReset();
    codigoStoreViewActivo.mockReturnValue("sanhigia_es");
});

describe("[checkout-maquina-01] PATCH del checkout con X-Store-View", () => {
    test("checkout_maquina_01_patch_a_la_ruta_del_token_con_el_body", async () => {
        patch.mockResolvedValue(undefined);
        const body = { email: "a@b.es", nombre: "A" };

        await patchDatosCheckout("tok-1", body);

        expect(patch).toHaveBeenCalledOnce();
        expect(patch.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1/checkout");
        expect(patch.mock.calls[0][1]).toEqual(body);
        expect(patch.mock.calls[0][3]).toEqual({ "X-Store-View": "sanhigia_es" });
    });

    test("checkout_maquina_01_propaga_el_rechazo", async () => {
        const error = { nombre: "Error", descripcion: "email no válido", estado: 400 };
        patch.mockRejectedValue(error);

        await expect(patchDatosCheckout("tok-1", {})).rejects.toEqual(error);
    });
});

describe("[checkout-maquina-04] POST del pago devuelve la url", () => {
    test("checkout_maquina_04_post_a_la_ruta_de_pago_con_cabecera", async () => {
        post.mockResolvedValue({ url: "https://pasarela/x" });

        await postIniciarPago("tok-1");

        expect(post).toHaveBeenCalledOnce();
        expect(post.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1/pago");
        expect(post.mock.calls[0][3]).toEqual({ "X-Store-View": "sanhigia_es" });
    });

    test("checkout_maquina_04_devuelve_la_url", async () => {
        post.mockResolvedValue({ url: "https://pasarela/x" });

        await expect(postIniciarPago("tok-1")).resolves.toBe("https://pasarela/x");
    });

    test("checkout_maquina_04_propaga_el_rechazo", async () => {
        const error = { nombre: "Error", descripcion: "x", estado: 500 };
        post.mockRejectedValue(error);

        await expect(postIniciarPago("tok-1")).rejects.toEqual(error);
    });
});

describe("[checkout-cancelado-01] POST de cancelación con X-Store-View", () => {
    test("checkout_cancelado_01_post_a_la_ruta_de_cancelar", async () => {
        post.mockResolvedValue({});

        await postCancelarPago("tok-1");

        expect(post).toHaveBeenCalledOnce();
        expect(post.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1/pago/cancelar");
        expect(post.mock.calls[0][3]).toEqual({ "X-Store-View": "sanhigia_es" });
    });
});
