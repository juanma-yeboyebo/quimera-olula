import { beforeEach, describe, expect, test, vi } from "vitest";

const get = vi.fn();
const post = vi.fn();
const codigoStoreViewActivo = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        get: (url: string, msg?: string, headers?: Record<string, string>) => get(url, msg, headers),
        post: (url: string, body: unknown, msg?: string, headers?: Record<string, string>) =>
            post(url, body, msg, headers),
    },
}));

vi.mock("#/tienda_online/comun/storeview.ts", () => ({
    codigoStoreViewActivo: () => codigoStoreViewActivo(),
}));

const { getListaRegalos, getLineaListaRegalos, postLigarCarrito } = await import(
    "#/tienda_lista_regalos/web/infraestructura.ts"
);

const lineaApi = {
    id: 7,
    referencia: "REF1",
    descripcion: "Cuna",
    imagen: { url: "/c.jpg", alt: null },
    precio: 121,
    divisa: "EUR",
    cantidad: 3,
    vendida: 1,
    pendiente: 2,
};

const fichaApi = {
    ...lineaApi,
    descripcion_corta: "Corta",
    descripcion_larga: "Larga",
    meta_titulo: "MT",
    meta_descripcion: "MD",
    imagenes: [{ url: "/c.jpg", alt: "a", principal: true }],
};

beforeEach(() => {
    get.mockReset();
    post.mockReset();
    codigoStoreViewActivo.mockReset();
    codigoStoreViewActivo.mockReturnValue("dulce_es");
});

describe("[lista_regalos-web-lista-01] /lista/:token carga la lista con X-Store-View", () => {
    test("lista_regalos_web_lista_01_llama_a_la_ruta_del_token_con_storeview", async () => {
        get.mockResolvedValue({ datos: { nombre: "Lista", descripcion: null, lineas: [] } });

        await getListaRegalos("tk");

        expect(get.mock.calls[0][0]).toBe("/public/tienda_lista_regalos/lista/tk");
        expect(get.mock.calls[0][2]).toEqual({ "X-Store-View": "dulce_es" });
    });

    test("lista_regalos_web_lista_01_mapea_la_lista_y_sus_lineas_en_orden", async () => {
        get.mockResolvedValue({
            datos: {
                nombre: "Lista de Ana",
                descripcion: "Gracias",
                lineas: [lineaApi, { ...lineaApi, id: 8, descripcion: null, imagen: null }],
            },
        });

        const lista = await getListaRegalos("tk");

        expect(lista.nombre).toBe("Lista de Ana");
        expect(lista.descripcion).toBe("Gracias");
        expect(lista.lineas.map((l) => l.id)).toEqual([7, 8]);
        expect(lista.lineas[0]).toEqual({
            id: 7,
            referencia: "REF1",
            descripcion: "Cuna",
            imagen: { url: "/c.jpg", alt: null },
            precio: 121,
            divisa: "EUR",
            cantidad: 3,
            vendida: 1,
            pendiente: 2,
        });
    });

    test("lista_regalos_web_lista_01_sin_descripcion_usa_la_referencia", async () => {
        get.mockResolvedValue({
            datos: { nombre: "L", descripcion: null, lineas: [{ ...lineaApi, descripcion: null }] },
        });

        const lista = await getListaRegalos("tk");

        expect(lista.lineas[0].descripcion).toBe("REF1");
    });
});

describe("[lista_regalos-web-ficha-01] /lista/:token/producto/:idlinea carga la ficha de la línea", () => {
    test("lista_regalos_web_ficha_01_llama_a_la_ruta_de_la_linea_con_storeview", async () => {
        get.mockResolvedValue({ datos: fichaApi });

        await getLineaListaRegalos("tk", "7");

        expect(get.mock.calls[0][0]).toBe("/public/tienda_lista_regalos/lista/tk/linea/7");
        expect(get.mock.calls[0][2]).toEqual({ "X-Store-View": "dulce_es" });
    });

    test("lista_regalos_web_ficha_01_mapea_textos_meta_e_imagenes", async () => {
        get.mockResolvedValue({ datos: fichaApi });

        const ficha = await getLineaListaRegalos("tk", "7");

        expect(ficha).toEqual(
            expect.objectContaining({
                id: 7,
                pendiente: 2,
                descripcionCorta: "Corta",
                descripcionLarga: "Larga",
                metaTitulo: "MT",
                metaDescripcion: "MD",
                imagenes: [{ url: "/c.jpg", alt: "a", principal: true }],
            }),
        );
    });
});

describe("[lista_regalos-web-anadir-01] Ligar el carrito a la lista", () => {
    test("lista_regalos_web_anadir_01_post_a_la_ruta_de_ligar_con_storeview", async () => {
        post.mockResolvedValue({});

        await postLigarCarrito("tk", "car-1");

        expect(post.mock.calls[0][0]).toBe("/public/tienda_lista_regalos/lista/tk/carrito/car-1");
        expect(post.mock.calls[0][1]).toEqual({});
        expect(post.mock.calls[0][3]).toEqual({ "X-Store-View": "dulce_es" });
    });
});
