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

const {
    getCarritoUsuario,
    getCuenta,
    getPedido,
    getPedidos,
    postAsociarCarrito,
    postRegistro,
} = await import("#/tienda_online/cuenta/infraestructura.ts");

const CABECERAS = { "X-Store-View": "sanhigia_es" };

beforeEach(() => {
    get.mockReset();
    post.mockReset();
    codigoStoreViewActivo.mockReset();
    codigoStoreViewActivo.mockReturnValue("sanhigia_es");
});

describe("[cuenta-registro-04] POST del registro", () => {
    test("cuenta_registro_04_post_a_la_ruta_publica_con_cabecera", async () => {
        post.mockResolvedValue({ id: "1" });
        const body = {
            email: "a@b.es",
            password: "12345678",
            nombre: "A",
            id_fiscal: "X",
            telefono: null,
            direccion: {
                nombre_via: "v",
                numero: null,
                cod_postal: "1",
                ciudad: "c",
                provincia: null,
                pais_id: "ES",
            },
        };

        await postRegistro(body);

        expect(post.mock.calls[0][0]).toBe("/public/tienda_online/cuenta/registro");
        expect(post.mock.calls[0][1]).toEqual(body);
        expect(post.mock.calls[0][3]).toEqual(CABECERAS);
    });

    test("cuenta_registro_04_propaga_el_rechazo", async () => {
        const error = { nombre: "Error", descripcion: "duplicado", estado: 409 };
        post.mockRejectedValue(error);

        await expect(postRegistro({} as never)).rejects.toEqual(error);
    });
});

describe("[cuenta-login-03] POST asociar carrito", () => {
    test("cuenta_login_03_post_a_la_ruta_del_token_con_cabecera", async () => {
        post.mockResolvedValue({});

        await postAsociarCarrito("tok-1");

        expect(post.mock.calls[0][0]).toBe("/tienda_online/carrito/tok-1/asociar");
        expect(post.mock.calls[0][3]).toEqual(CABECERAS);
    });
});

describe("[cuenta-login-05] GET del carrito del usuario", () => {
    const carritoApi = {
        token: "tok-u",
        estado: "ABIERTO",
        divisa: "EUR",
        neto: 1,
        total_iva: 0.21,
        total: 1.21,
        unidades: 1,
        datos_checkout: null,
        lineas: [],
        documento: null,
    };

    test("cuenta_login_05_devuelve_el_carrito_mapeado", async () => {
        get.mockResolvedValue({ datos: carritoApi });

        const carrito = await getCarritoUsuario();

        expect(get.mock.calls[0][0]).toBe("/tienda_online/carrito");
        expect(get.mock.calls[0][2]).toEqual(CABECERAS);
        expect(carrito?.token).toBe("tok-u");
        expect(carrito?.totalIva).toBe(0.21);
    });

    test("cuenta_login_05_con_404_devuelve_null", async () => {
        get.mockRejectedValue({ nombre: "Error", descripcion: "", estado: 404 });

        expect(await getCarritoUsuario()).toBeNull();
    });

    test("cuenta_login_05_otro_error_se_propaga", async () => {
        const error = { nombre: "Error", descripcion: "", estado: 500 };
        get.mockRejectedValue(error);

        await expect(getCarritoUsuario()).rejects.toEqual(error);
    });
});

describe("[cuenta-mi_cuenta-01] GET de mi cuenta", () => {
    test("cuenta_mi_cuenta_01_mapea_la_cuenta_y_sus_direcciones", async () => {
        get.mockResolvedValue({
            datos: {
                email: "a@b.es",
                nombre: "Ana",
                id_fiscal: "X1",
                telefono: null,
                cliente_id: "C1",
                direcciones: [
                    {
                        id: "5",
                        nombre_via: "Mayor",
                        numero: "3",
                        cod_postal: "28001",
                        ciudad: "Madrid",
                        provincia: null,
                        pais_id: "ES",
                        envio: true,
                        facturacion: false,
                    },
                ],
            },
        });

        const cuenta = await getCuenta();

        expect(get.mock.calls[0][0]).toBe("/tienda_online/cuenta/yo");
        expect(get.mock.calls[0][2]).toEqual(CABECERAS);
        expect(cuenta.idFiscal).toBe("X1");
        expect(cuenta.clienteId).toBe("C1");
        expect(cuenta.direcciones[0]).toEqual({
            id: "5",
            nombreVia: "Mayor",
            numero: "3",
            codPostal: "28001",
            ciudad: "Madrid",
            provincia: null,
            paisId: "ES",
            envio: true,
            facturacion: false,
        });
    });
});

describe("[cuenta-pedidos-01] GET de pedidos", () => {
    test("cuenta_pedidos_01_pide_la_pagina_con_criteria_y_devuelve_total", async () => {
        get.mockResolvedValue({
            datos: [{ id: "1", codigo: "P1", fecha: "2026-01-01", total: 10, divisa: "EUR", servido: "No" }],
            total: 41,
        });

        const r = await getPedidos(2);

        const url = get.mock.calls[0][0] as string;
        expect(url.startsWith("/tienda_online/cuenta/pedido?q=")).toBe(true);
        expect(decodeURIComponent(url)).toContain('"fecha"');
        expect(decodeURIComponent(url)).toContain("DESC");
        expect(get.mock.calls[0][2]).toEqual(CABECERAS);
        expect(r.total).toBe(41);
        expect(r.pedidos[0].codigo).toBe("P1");
    });
});

describe("[cuenta-pedido-01] GET del detalle de pedido", () => {
    test("cuenta_pedido_01_mapea_totales_y_lineas", async () => {
        get.mockResolvedValue({
            datos: {
                id: "7",
                codigo: "P7",
                fecha: "2026-02-02",
                total: 121,
                divisa: "EUR",
                servido: "Sí",
                neto: 100,
                total_iva: 21,
                lineas: [{ referencia: "R1", descripcion: "Guantes", cantidad: 2, precio: 50, importe: 100 }],
            },
        });

        const p = await getPedido("7");

        expect(get.mock.calls[0][0]).toBe("/tienda_online/cuenta/pedido/7");
        expect(get.mock.calls[0][2]).toEqual(CABECERAS);
        expect(p.totalIva).toBe(21);
        expect(p.lineas).toEqual([
            { referencia: "R1", descripcion: "Guantes", cantidad: 2, precio: 50, importe: 100 },
        ]);
    });
});
