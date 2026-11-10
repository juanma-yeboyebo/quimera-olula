import { beforeEach, describe, expect, test, vi } from "vitest";

const get = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        get: (url: string, msg?: string, headers?: Record<string, string>) =>
            get(url, msg, headers),
    },
}));

const { getStoreView, getCarrito, cabecerasTienda } = await import(
    "#/tienda_online/comun/infraestructura.ts"
);

describe("[tienda-storeview-02] Se carga el storeview y se mapea a StoreView", () => {
    beforeEach(() => { get.mockReset(); });

    test("tienda_storeview_02_llama_a_la_ruta_del_storeview", async () => {
        get.mockResolvedValue({
            datos: {
                codigo: "sanhigia_es",
                nombre: "Sanhigía",
                idioma: "es",
                url_base: "https://tienda.example",
                website: { id: 1, codigo: "web", nombre: "Web", divisa: "EUR" },
            },
        });

        await getStoreView("sanhigia_es");

        expect(get.mock.calls[0][0]).toBe("/public/tienda_online/storeview/sanhigia_es");
    });

    test("tienda_storeview_02_mapea_url_base_a_urlBase", async () => {
        get.mockResolvedValue({
            datos: {
                codigo: "sanhigia_es",
                nombre: "Sanhigía",
                idioma: "es",
                url_base: "https://tienda.example",
                website: { id: 1, codigo: "web", nombre: "Web", divisa: "EUR" },
            },
        });

        const sv = await getStoreView("sanhigia_es");

        expect(sv).toEqual({
            codigo: "sanhigia_es",
            nombre: "Sanhigía",
            idioma: "es",
            urlBase: "https://tienda.example",
            website: { id: 1, codigo: "web", nombre: "Web", divisa: "EUR" },
            formasPago: [],
            formasEnvio: [],
        });
    });

    test("tienda_storeview_02_propaga_el_rechazo_404", async () => {
        get.mockRejectedValue({ nombre: "Error", descripcion: "no existe", estado: 404 });

        await expect(getStoreView("no_existe")).rejects.toMatchObject({ estado: 404 });
    });
});

describe("[tienda-storeview-04] Las llamadas añaden X-Store-View y, si hay token, X-Carrito-Token", () => {
    test("tienda_storeview_04_solo_storeview_sin_token", () => {
        expect(cabecerasTienda("sanhigia_es")).toEqual({ "X-Store-View": "sanhigia_es" });
    });

    test("tienda_storeview_04_anade_token_si_existe", () => {
        expect(cabecerasTienda("sanhigia_es", "tok-1")).toEqual({
            "X-Store-View": "sanhigia_es",
            "X-Carrito-Token": "tok-1",
        });
    });

    test("tienda_storeview_04_no_anade_token_si_es_undefined", () => {
        expect(cabecerasTienda("sanhigia_es", undefined)).not.toHaveProperty("X-Carrito-Token");
    });
});

describe("[tienda-carrito_store-03] getCarrito mapea CarritoPublico a camelCase", () => {
    beforeEach(() => { get.mockReset(); });

    const carritoApi = {
        token: "tok-1",
        estado: "ABIERTO",
        divisa: "EUR",
        neto: 100.5,
        total_iva: 21.1,
        total: 121.6,
        unidades: 3,
        datos_checkout: { email: "a@b.c" },
        lineas: [
            {
                id: 7,
                referencia: "REF1",
                slug: "camiseta-azul",
                descripcion: "Camiseta azul",
                imagen: { url: "/img/1.png", alt: "azul" },
                cantidad: 3,
                precio: 33.5,
                dto_porcentual: 10,
                tipo_iva: 21,
                iva_incluido: false,
                importe: 100.5,
            },
        ],
        documento: null,
    };

    test("tienda_carrito_store_03_llama_a_la_ruta_del_token", async () => {
        get.mockResolvedValue({ datos: carritoApi });

        await getCarrito("tok-1");

        expect(get.mock.calls[0][0]).toBe("/public/tienda_online/carrito/tok-1");
    });

    test("tienda_carrito_store_03_mapea_cabecera_a_camelCase", async () => {
        get.mockResolvedValue({ datos: carritoApi });

        const c = await getCarrito("tok-1");

        expect(c).toMatchObject({
            token: "tok-1",
            estado: "ABIERTO",
            divisa: "EUR",
            neto: 100.5,
            totalIva: 21.1,
            total: 121.6,
            unidades: 3,
            datosCheckout: { email: "a@b.c" },
            documento: null,
        });
    });

    test("tienda_carrito_store_03_mapea_lineas_a_camelCase", async () => {
        get.mockResolvedValue({ datos: carritoApi });

        const c = await getCarrito("tok-1");

        expect(c.lineas).toEqual([
            {
                id: 7,
                referencia: "REF1",
                slug: "camiseta-azul",
                descripcion: "Camiseta azul",
                imagen: { url: "/img/1.png", alt: "azul" },
                cantidad: 3,
                precio: 33.5,
                dtoPorcentual: 10,
                tipoIva: 21,
                ivaIncluido: false,
                importe: 100.5,
            },
        ]);
    });

    test("tienda_carrito_store_03_propaga_el_rechazo_404", async () => {
        get.mockRejectedValue({ nombre: "Error", descripcion: "no existe", estado: 404 });

        await expect(getCarrito("tok-x")).rejects.toMatchObject({ estado: 404 });
    });
});
