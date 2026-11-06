import { beforeEach, describe, expect, test, vi } from "vitest";

const get = vi.fn();
const post = vi.fn();
const obtenerToken = vi.fn();
const codigoStoreViewActivo = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        get: (url: string, msg?: string, headers?: Record<string, string>) =>
            get(url, msg, headers),
        post: (url: string, body: unknown, msg?: string, headers?: Record<string, string>) =>
            post(url, body, msg, headers),
    },
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => obtenerToken(),
}));

vi.mock("#/tienda_online/comun/storeview.ts", () => ({
    codigoStoreViewActivo: () => codigoStoreViewActivo(),
}));

const { getProducto, postLineaCarrito } = await import(
    "#/tienda_online/producto/infraestructura.ts"
);

const productoApi = {
    referencia: "REF1",
    slug: "producto-1",
    descripcion: "Producto 1",
    descripcion_corta: "Corta",
    descripcion_larga: "Larga\nlinea 2",
    meta_titulo: "Meta T",
    meta_descripcion: "Meta D",
    imagenes: [{ url: "/i.jpg", alt: "alt", principal: true }],
    categorias: [{ id: 3, nombre: "Cat", slug: "cat" }],
    disponible: true,
    cantidad_disponible: 7,
    sin_control_stock: false,
    precio: 10,
    precio_con_iva: 12.1,
    tipo_iva: 21,
    divisa: "EUR",
    iva_incluido: false,
};

beforeEach(() => {
    get.mockReset();
    post.mockReset();
    obtenerToken.mockReset();
    codigoStoreViewActivo.mockReset();
    codigoStoreViewActivo.mockReturnValue("sanhigia_es");
    obtenerToken.mockReturnValue(null);
});

describe("[producto-carga-01] La ruta carga la ficha con X-Carrito-Token y la mapea a FichaProducto", () => {
    test("producto_carga_01_llama_a_la_ruta_del_slug", async () => {
        get.mockResolvedValue({ datos: productoApi });

        await getProducto("producto-1");

        expect(get.mock.calls[0][0]).toBe("/public/tienda_online/producto/producto-1");
    });

    test("producto_carga_01_envia_storeview_y_token_si_hay_carrito", async () => {
        obtenerToken.mockReturnValue("tok-1");
        get.mockResolvedValue({ datos: productoApi });

        await getProducto("producto-1");

        expect(get.mock.calls[0][2]).toEqual({
            "X-Store-View": "sanhigia_es",
            "X-Carrito-Token": "tok-1",
        });
    });

    test("producto_carga_01_sin_carrito_no_envia_token", async () => {
        get.mockResolvedValue({ datos: productoApi });

        await getProducto("producto-1");

        expect(get.mock.calls[0][2]).toEqual({ "X-Store-View": "sanhigia_es" });
    });

    test("producto_carga_01_mapea_snake_a_camel", async () => {
        get.mockResolvedValue({ datos: productoApi });

        const f = await getProducto("producto-1");

        expect(f).toEqual({
            referencia: "REF1",
            slug: "producto-1",
            descripcion: "Producto 1",
            descripcionCorta: "Corta",
            descripcionLarga: "Larga\nlinea 2",
            metaTitulo: "Meta T",
            metaDescripcion: "Meta D",
            imagenes: [{ url: "/i.jpg", alt: "alt", principal: true }],
            categorias: [{ id: 3, nombre: "Cat", slug: "cat" }],
            disponible: true,
            cantidadDisponible: 7,
            sinControlStock: false,
            precio: 10,
            precioConIva: 12.1,
            tipoIva: 21,
            divisa: "EUR",
            ivaIncluido: false,
        });
    });

    test("producto_carga_01_propaga_el_rechazo_404", async () => {
        get.mockRejectedValue({ nombre: "Error", descripcion: "no existe", estado: 404 });

        await expect(getProducto("x")).rejects.toMatchObject({ estado: 404 });
    });
});

describe("[producto-anadir-03] La línea se envía a la ruta del carrito con articulo_id y cantidad", () => {
    test("producto_anadir_03_post_a_la_ruta_de_lineas_con_el_body", async () => {
        post.mockResolvedValue({ id: 55 });

        await postLineaCarrito("tok-1", "REF1", 2);

        expect(post.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1/linea");
        expect(post.mock.calls[0][1]).toEqual({ articulo_id: "REF1", cantidad: 2 });
    });

    test("producto_anadir_03_envia_la_cabecera_storeview", async () => {
        post.mockResolvedValue({ id: 55 });

        await postLineaCarrito("tok-1", "REF1", 2);

        expect(post.mock.calls[0][3]).toMatchObject({ "X-Store-View": "sanhigia_es" });
    });

    test("producto_anadir_03_devuelve_el_id_de_la_linea", async () => {
        post.mockResolvedValue({ id: 55 });

        expect(await postLineaCarrito("tok-1", "REF1", 2)).toBe(55);
    });

    test("producto_anadir_03_propaga_el_rechazo", async () => {
        post.mockRejectedValue({ nombre: "Error", descripcion: "sin stock", estado: 400 });

        await expect(postLineaCarrito("tok-1", "REF1", 2)).rejects.toMatchObject({ estado: 400 });
    });
});
