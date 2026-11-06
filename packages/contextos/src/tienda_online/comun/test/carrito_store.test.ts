import { beforeEach, describe, expect, test, vi } from "vitest";

const getCarrito = vi.fn();
const postCarrito = vi.fn();

vi.mock("#/tienda_online/comun/infraestructura.ts", () => ({
    getCarrito: (token: string) => getCarrito(token),
    postCarrito: () => postCarrito(),
}));

const SV = "sanhigia_es";
const CLAVE = `tienda_online.carrito.${SV}`;

const carritoApi = (estado = "ABIERTO", unidades = 3) => ({
    token: "tok-1",
    estado,
    divisa: "EUR",
    neto: 0,
    totalIva: 0,
    total: 0,
    unidades,
    datosCheckout: null,
    lineas: [],
    documento: null,
});

const cargarAlmacen = async () => {
    vi.resetModules();
    return await import("#/tienda_online/comun/carrito_store.ts");
};

beforeEach(() => {
    localStorage.clear();
    getCarrito.mockReset();
    postCarrito.mockReset();
});

describe("[tienda-carrito_store-01] El token se guarda con una clave por storeview", () => {
    test("tienda_carrito_store_01_guarda_el_token_bajo_la_clave_del_storeview", async () => {
        postCarrito.mockResolvedValue("tok-nuevo");
        getCarrito.mockResolvedValue(carritoApi());
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);

        await store.asegurarCarrito();

        expect(localStorage.getItem(CLAVE)).toBe("tok-nuevo");
    });

    test("tienda_carrito_store_01_otro_storeview_no_comparte_token", async () => {
        localStorage.setItem("tienda_online.carrito.otra", "tok-otra");
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);

        expect(store.obtenerToken()).toBeNull();
        expect(getCarrito).not.toHaveBeenCalled();
    });
});

describe("[tienda-carrito_store-02] Sin token guardado no se crea carrito hasta añadir el primer artículo", () => {
    test("tienda_carrito_store_02_arranque_sin_token_no_crea_carrito", async () => {
        const store = await cargarAlmacen();

        await store.iniciarCarrito(SV);

        expect(postCarrito).not.toHaveBeenCalled();
        expect(getCarrito).not.toHaveBeenCalled();
        expect(store.obtenerCarrito()).toBeNull();
        expect(store.obtenerToken()).toBeNull();
    });

    test("tienda_carrito_store_02_asegurarCarrito_crea_y_devuelve_el_token", async () => {
        postCarrito.mockResolvedValue("tok-nuevo");
        getCarrito.mockResolvedValue(carritoApi());
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);

        const token = await store.asegurarCarrito();

        expect(postCarrito).toHaveBeenCalledOnce();
        expect(token).toBe("tok-nuevo");
        expect(store.obtenerToken()).toBe("tok-nuevo");
    });

    test("tienda_carrito_store_02_asegurarCarrito_con_token_no_crea_otro", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoApi());
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);

        const token = await store.asegurarCarrito();

        expect(postCarrito).not.toHaveBeenCalled();
        expect(token).toBe("tok-1");
    });
});

describe("[tienda-carrito_store-03] Con token guardado se carga el carrito y se expone el número de unidades", () => {
    test("tienda_carrito_store_03_carga_con_getCarrito_y_expone_unidades", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoApi("ABIERTO", 5));
        const store = await cargarAlmacen();

        await store.iniciarCarrito(SV);

        expect(getCarrito).toHaveBeenCalledWith("tok-1");
        expect(store.obtenerCarrito()?.unidades).toBe(5);
        expect(store.obtenerToken()).toBe("tok-1");
    });
});

describe("[tienda-carrito_store-04] El token se descarta si el carrito no existe o no es modificable", () => {
    test("tienda_carrito_store_04_404_descarta_el_token", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockRejectedValue({ nombre: "Error", descripcion: "", estado: 404 });
        const store = await cargarAlmacen();

        await store.iniciarCarrito(SV);

        expect(localStorage.getItem(CLAVE)).toBeNull();
        expect(store.obtenerToken()).toBeNull();
        expect(store.obtenerCarrito()).toBeNull();
    });

    test.each(["PAGADO", "CONVERTIDO", "ERROR_CONVERSION"])(
        "tienda_carrito_store_04_estado_%s_descarta_el_token",
        async (estado) => {
            localStorage.setItem(CLAVE, "tok-1");
            getCarrito.mockResolvedValue(carritoApi(estado));
            const store = await cargarAlmacen();

            await store.iniciarCarrito(SV);

            expect(localStorage.getItem(CLAVE)).toBeNull();
            expect(store.obtenerToken()).toBeNull();
            expect(store.obtenerCarrito()).toBeNull();
        },
    );

    test("tienda_carrito_store_04_PAGO_PENDIENTE_se_conserva", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoApi("PAGO_PENDIENTE", 2));
        const store = await cargarAlmacen();

        await store.iniciarCarrito(SV);

        expect(localStorage.getItem(CLAVE)).toBe("tok-1");
        expect(store.obtenerCarrito()?.estado).toBe("PAGO_PENDIENTE");
    });
});

describe("[tienda-carrito_store-05] El almacén notifica a los suscriptores al recargar el carrito", () => {
    test("tienda_carrito_store_05_recargarCarrito_notifica_y_actualiza_unidades", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoApi("ABIERTO", 1));
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);
        const cb = vi.fn();
        store.suscribir(cb);
        getCarrito.mockResolvedValue(carritoApi("ABIERTO", 4));

        await store.recargarCarrito();

        expect(cb).toHaveBeenCalled();
        expect(store.obtenerCarrito()?.unidades).toBe(4);
    });

    test("tienda_carrito_store_05_suscribir_devuelve_funcion_para_darse_de_baja", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoApi());
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);
        const cb = vi.fn();
        const baja = store.suscribir(cb);
        baja();

        await store.recargarCarrito();

        expect(cb).not.toHaveBeenCalled();
    });
});

describe("[tienda-carrito_store-06] olvidarCarrito borra el token y deja el contador a 0", () => {
    test("tienda_carrito_store_06_borra_token_y_deja_null", async () => {
        localStorage.setItem(CLAVE, "tok-1");
        getCarrito.mockResolvedValue(carritoApi("ABIERTO", 2));
        const store = await cargarAlmacen();
        await store.iniciarCarrito(SV);

        store.olvidarCarrito();

        expect(localStorage.getItem(CLAVE)).toBeNull();
        expect(store.obtenerToken()).toBeNull();
        expect(store.obtenerCarrito()).toBeNull();
    });
});
