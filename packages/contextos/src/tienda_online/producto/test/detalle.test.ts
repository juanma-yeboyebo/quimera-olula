import { beforeEach, describe, expect, test, vi } from "vitest";
import { FichaProducto } from "#/tienda_online/producto/diseño.ts";
import { ContextoFicha } from "#/tienda_online/producto/detalle/diseño.ts";

const getProducto = vi.fn();
const postLineaCarrito = vi.fn();
const asegurarCarrito = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();

vi.mock("#/tienda_online/producto/infraestructura.ts", () => ({
    getProducto: (slug: string) => getProducto(slug),
    postLineaCarrito: (token: string, referencia: string, cantidad: number) =>
        postLineaCarrito(token, referencia, cantidad),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    asegurarCarrito: () => asegurarCarrito(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
}));

const { obtenerAvisos, reiniciarAvisos } = await import("#/tienda_online/comun/avisos_store.ts");
const { estaCajonCarritoAbierto, cerrarCajonCarrito } = await import(
    "#/tienda_online/comun/cajon_carrito_store.ts"
);

const { cargarContexto, anadirAlCarrito, contextoFichaInicial } = await import(
    "#/tienda_online/producto/detalle/detalle.ts"
);

const ficha: FichaProducto = {
    referencia: "REF1",
    slug: "producto-1",
    descripcion: "Producto 1",
    descripcionCorta: null,
    descripcionLarga: null,
    metaTitulo: null,
    metaDescripcion: null,
    imagenes: [],
    categorias: [],
    disponible: true,
    cantidadDisponible: 10,
    sinControlStock: false,
    precio: 10,
    precioConIva: 12.1,
    tipoIva: 21,
    divisa: "EUR",
    ivaIncluido: false,
};

type Resultado = ContextoFicha | [ContextoFicha, unknown[]];
const ctxDe = (r: Resultado): ContextoFicha => (Array.isArray(r) ? r[0] : r);

const contextoAnadiendo = (cantidad = 2): ContextoFicha => ({
    ...contextoFichaInicial,
    estado: "AÑADIENDO",
    ficha,
    cantidad,
});

beforeEach(() => {
    getProducto.mockReset();
    postLineaCarrito.mockReset();
    asegurarCarrito.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    recargarCarrito.mockResolvedValue(undefined);
    reiniciarAvisos();
    cerrarCajonCarrito();
});

describe("[producto-carga-02] [CARGANDO] ficha cargada → LISTO", () => {
    test("producto_carga_02_pasa_a_listo_con_la_ficha", async () => {
        getProducto.mockResolvedValue(ficha);

        const r = ctxDe(await cargarContexto({ ...contextoFichaInicial, estado: "CARGANDO" }, "producto-1"));

        expect(getProducto).toHaveBeenCalledWith("producto-1");
        expect(r.estado).toBe("LISTO");
        expect(r.ficha).toEqual(ficha);
    });

    test("producto_carga_02_la_cantidad_empieza_en_1", async () => {
        getProducto.mockResolvedValue(ficha);

        const r = ctxDe(await cargarContexto({ ...contextoFichaInicial, estado: "CARGANDO" }, "producto-1"));

        expect(r.cantidad).toBe(1);
    });
});

describe("[producto-carga-03] [CARGANDO] error 404 → NO_ENCONTRADO", () => {
    test("producto_carga_03_404_pasa_a_no_encontrado", async () => {
        getProducto.mockRejectedValue({ nombre: "Error", descripcion: "no existe", estado: 404 });

        const r = ctxDe(await cargarContexto({ ...contextoFichaInicial, estado: "CARGANDO" }, "x"));

        expect(r.estado).toBe("NO_ENCONTRADO");
    });
});

describe("[producto-carga-04] [CARGANDO] otro error → ERROR", () => {
    test("producto_carga_04_500_pasa_a_error", async () => {
        getProducto.mockRejectedValue({ nombre: "Error", descripcion: "fallo", estado: 500 });

        const r = ctxDe(await cargarContexto({ ...contextoFichaInicial, estado: "CARGANDO" }, "x"));

        expect(r.estado).toBe("ERROR");
    });

    test("producto_carga_04_error_sin_estado_pasa_a_error", async () => {
        getProducto.mockRejectedValue(new Error("red"));

        const r = ctxDe(await cargarContexto({ ...contextoFichaInicial, estado: "CARGANDO" }, "x"));

        expect(r.estado).toBe("ERROR");
    });
});

describe("[producto-anadir-03] [LISTO] añadir → AÑADIENDO → LISTO", () => {
    test("producto_anadir_03_asegura_envia_y_recarga", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockResolvedValue(9);

        await anadirAlCarrito(contextoAnadiendo(2));

        expect(asegurarCarrito).toHaveBeenCalledOnce();
        expect(postLineaCarrito).toHaveBeenCalledWith("tok-1", "REF1", 2);
        expect(recargarCarrito).toHaveBeenCalledOnce();
    });

    test("producto_anadir_03_vuelve_a_listo_con_aviso_y_sin_error", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockResolvedValue(9);

        const r = ctxDe(await anadirAlCarrito(contextoAnadiendo(2)));

        expect(r.estado).toBe("LISTO");
        expect(r.aviso).toBeTruthy();
        expect(r.error).toBeNull();
    });

    test("producto_anadir_03_no_abre_el_cajon_y_muestra_aviso_con_ver_carrito", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockResolvedValue(9);

        await anadirAlCarrito(contextoAnadiendo(2));

        expect(estaCajonCarritoAbierto()).toBe(false);
        const [aviso] = obtenerAvisos();
        expect(aviso.tipo).toBe("ok");
        expect(aviso.texto).toBe("Producto 1 añadido al carrito");
        expect(aviso.accion?.texto).toBe("Ver carrito");
    });
});

describe("[producto-anadir-04] [AÑADIENDO] error 400 → LISTO con el texto del backend", () => {
    test("producto_anadir_04_muestra_el_texto_del_backend", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockRejectedValue({
            nombre: "Error",
            descripcion: "Stock insuficiente: quedan 3",
            estado: 400,
        });

        const r = ctxDe(await anadirAlCarrito(contextoAnadiendo(5)));

        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe("Stock insuficiente: quedan 3");
        expect(r.aviso).toBeNull();
    });

    test("producto_anadir_04_la_cantidad_no_cambia", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "x", estado: 400 });

        const r = ctxDe(await anadirAlCarrito(contextoAnadiendo(5)));

        expect(r.cantidad).toBe(5);
    });

    test("producto_anadir_04_no_olvida_el_carrito_ni_reintenta", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "x", estado: 400 });

        await anadirAlCarrito(contextoAnadiendo(5));

        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(postLineaCarrito).toHaveBeenCalledTimes(1);
    });
});

describe("[producto-anadir-05] [AÑADIENDO] error 404 o 409 → carrito nuevo y un único reintento", () => {
    test.each([404, 409])("producto_anadir_05_%i_olvida_crea_nuevo_y_reintenta", async (estado) => {
        asegurarCarrito.mockResolvedValueOnce("tok-viejo").mockResolvedValueOnce("tok-nuevo");
        postLineaCarrito
            .mockRejectedValueOnce({ nombre: "Error", descripcion: "carrito", estado })
            .mockResolvedValueOnce(9);

        const r = ctxDe(await anadirAlCarrito(contextoAnadiendo(2)));

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(asegurarCarrito).toHaveBeenCalledTimes(2);
        expect(postLineaCarrito).toHaveBeenNthCalledWith(1, "tok-viejo", "REF1", 2);
        expect(postLineaCarrito).toHaveBeenNthCalledWith(2, "tok-nuevo", "REF1", 2);
        expect(r.estado).toBe("LISTO");
        expect(r.aviso).toBeTruthy();
        expect(r.error).toBeNull();
    });

    test("producto_anadir_05_reintento_correcto_recarga_el_carrito", async () => {
        asegurarCarrito.mockResolvedValueOnce("tok-viejo").mockResolvedValueOnce("tok-nuevo");
        postLineaCarrito
            .mockRejectedValueOnce({ nombre: "Error", descripcion: "carrito", estado: 404 })
            .mockResolvedValueOnce(9);

        await anadirAlCarrito(contextoAnadiendo(2));

        expect(recargarCarrito).toHaveBeenCalled();
    });

    test("producto_anadir_05_si_el_reintento_falla_muestra_el_error_sin_tercer_intento", async () => {
        asegurarCarrito.mockResolvedValueOnce("tok-viejo").mockResolvedValueOnce("tok-nuevo");
        postLineaCarrito
            .mockRejectedValueOnce({ nombre: "Error", descripcion: "carrito", estado: 404 })
            .mockRejectedValueOnce({ nombre: "Error", descripcion: "Stock insuficiente", estado: 400 });

        const r = ctxDe(await anadirAlCarrito(contextoAnadiendo(2)));

        expect(postLineaCarrito).toHaveBeenCalledTimes(2);
        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe("Stock insuficiente");
        expect(r.aviso).toBeNull();
    });

    test("producto_anadir_05_si_el_reintento_vuelve_a_dar_404_no_hay_tercer_intento", async () => {
        asegurarCarrito.mockResolvedValueOnce("tok-viejo").mockResolvedValueOnce("tok-nuevo");
        postLineaCarrito.mockRejectedValue({ nombre: "Error", descripcion: "carrito", estado: 404 });

        const r = ctxDe(await anadirAlCarrito(contextoAnadiendo(2)));

        expect(postLineaCarrito).toHaveBeenCalledTimes(2);
        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(r.estado).toBe("LISTO");
        expect(r.error).toBe("carrito");
    });
});
