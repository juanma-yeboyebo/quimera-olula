import { beforeEach, describe, expect, test, vi } from "vitest";
import { DatosCheckout, DireccionCheckout } from "#/tienda_online/checkout/diseño.ts";
import { ContextoCheckout } from "#/tienda_online/checkout/detalle/diseño.ts";

const patchDatosCheckout = vi.fn();
const postIniciarPago = vi.fn();
const obtenerToken = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();
const codigoStoreViewActivo = vi.fn();
const redirigirA = vi.fn();

vi.mock("#/tienda_online/checkout/infraestructura.ts", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    patchDatosCheckout: (token: string, body: unknown) => patchDatosCheckout(token, body),
    postIniciarPago: (token: string) => postIniciarPago(token),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    obtenerToken: () => obtenerToken(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
}));

vi.mock("#/tienda_online/comun/storeview.ts", () => ({
    codigoStoreViewActivo: () => codigoStoreViewActivo(),
}));

vi.mock("#/tienda_online/checkout/navegacion.ts", () => ({
    redirigirA: (url: string) => redirigirA(url),
}));

const { guardarDatos, iniciarPago } = await import("#/tienda_online/checkout/detalle/detalle.ts");

const direccion: DireccionCheckout = {
    nombreVia: "Mayor",
    tipoVia: null,
    numero: null,
    otros: null,
    codPostal: "28001",
    ciudad: "Madrid",
    provincia: null,
    paisId: "ES",
    telefono: null,
};

const datos: DatosCheckout = {
    email: "ana@example.com",
    nombre: "Ana",
    idFiscal: null,
    telefono: null,
    direccionFacturacion: direccion,
    envioDistinto: false,
    direccionEnvio: { ...direccion, nombreVia: "", codPostal: "", ciudad: "", paisId: "" },
};

const contexto = (estado: ContextoCheckout["estado"], d: DatosCheckout = datos): ContextoCheckout => ({
    estado,
    datos: d,
    errores: {},
    error: null,
});

type Resultado = ContextoCheckout | [ContextoCheckout, unknown[]];
const ctxDe = (r: Resultado): ContextoCheckout => (Array.isArray(r) ? r[0] : r);

const errorApi = (estado: number, descripcion = "texto del backend") => ({
    nombre: "Error",
    descripcion,
    estado,
});

beforeEach(() => {
    patchDatosCheckout.mockReset();
    postIniciarPago.mockReset();
    obtenerToken.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    codigoStoreViewActivo.mockReset();
    redirigirA.mockReset();
    sessionStorage.clear();
    obtenerToken.mockReturnValue("tok-1");
    recargarCarrito.mockResolvedValue(undefined);
    codigoStoreViewActivo.mockReturnValue("sanhigia_es");
});

describe("[checkout-datos-03] Con errores de validación no se avanza", () => {
    test("checkout_datos_03_con_errores_vuelve_a_datos_con_errores_y_sin_llamar_a_la_api", async () => {
        const r = ctxDe(await guardarDatos(contexto("GUARDANDO", { ...datos, email: "", nombre: "" })));

        expect(r.estado).toBe("DATOS");
        expect(r.errores.email).toBeTruthy();
        expect(r.errores.nombre).toBeTruthy();
        expect(patchDatosCheckout).not.toHaveBeenCalled();
    });
});

describe("[checkout-maquina-01] [DATOS] continuar → GUARDANDO → REVISION", () => {
    test("checkout_maquina_01_envia_el_patch_con_snake_case_y_recarga", async () => {
        patchDatosCheckout.mockResolvedValue(undefined);

        await guardarDatos(contexto("GUARDANDO"));

        expect(patchDatosCheckout).toHaveBeenCalledOnce();
        const [token, body] = patchDatosCheckout.mock.calls[0];
        expect(token).toBe("tok-1");
        expect(body.email).toBe("ana@example.com");
        expect(body.direccion_facturacion.nombre_via).toBe("Mayor");
        expect(body.direccion_envio).toBeNull();
        expect(recargarCarrito).toHaveBeenCalledOnce();
    });

    test("checkout_maquina_01_pasa_a_revision_sin_errores", async () => {
        patchDatosCheckout.mockResolvedValue(undefined);

        const r = ctxDe(await guardarDatos(contexto("GUARDANDO")));

        expect(r.estado).toBe("REVISION");
        expect(r.errores).toEqual({});
        expect(r.error).toBeNull();
        expect(r.datos).toEqual(datos);
    });
});

describe("[checkout-maquina-02] [GUARDANDO] error → DATOS", () => {
    test("checkout_maquina_02_400_muestra_el_texto_del_backend", async () => {
        patchDatosCheckout.mockRejectedValue(errorApi(400, "El email no es válido"));

        const r = ctxDe(await guardarDatos(contexto("GUARDANDO")));

        expect(r.estado).toBe("DATOS");
        expect(r.error).toBe("El email no es válido");
        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(recargarCarrito).not.toHaveBeenCalled();
    });

    test.each([404, 409])("checkout_maquina_02_%i_olvida_el_carrito_y_avisa", async (estado) => {
        patchDatosCheckout.mockRejectedValue(errorApi(estado));

        const r = ctxDe(await guardarDatos(contexto("GUARDANDO")));

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(r.estado).toBe("DATOS");
        expect(r.error).toBe("Este carrito ya no está disponible");
    });
});

describe("[checkout-maquina-04] [REVISION] pagar → PAGANDO → REDIRIGIENDO", () => {
    test("checkout_maquina_04_envia_el_post_de_pago_con_el_token_del_almacen", async () => {
        postIniciarPago.mockResolvedValue("https://pasarela/x");

        await iniciarPago(contexto("PAGANDO"));

        expect(postIniciarPago).toHaveBeenCalledWith("tok-1");
    });

    test("checkout_maquina_04_guarda_el_token_en_session_storage_bajo_la_clave_del_storeview", async () => {
        postIniciarPago.mockResolvedValue("https://pasarela/x");

        await iniciarPago(contexto("PAGANDO"));

        expect(sessionStorage.getItem("tienda_online.pago_en_curso.sanhigia_es")).toBe("tok-1");
    });

    test("checkout_maquina_04_redirige_a_la_url_recibida_y_pasa_a_redirigiendo", async () => {
        postIniciarPago.mockResolvedValue("https://pasarela/x");

        const r = ctxDe(await iniciarPago(contexto("PAGANDO")));

        expect(redirigirA).toHaveBeenCalledExactlyOnceWith("https://pasarela/x");
        expect(r.estado).toBe("REDIRIGIENDO");
    });

    test("checkout_maquina_04_guarda_el_token_antes_de_redirigir", async () => {
        postIniciarPago.mockResolvedValue("https://pasarela/x");
        let guardadoAlRedirigir: string | null = null;
        redirigirA.mockImplementation(() => {
            guardadoAlRedirigir = sessionStorage.getItem("tienda_online.pago_en_curso.sanhigia_es");
        });

        await iniciarPago(contexto("PAGANDO"));

        expect(guardadoAlRedirigir).toBe("tok-1");
    });
});

describe("[checkout-maquina-05] [PAGANDO] error 400 → DATOS", () => {
    test("checkout_maquina_05_muestra_el_texto_del_backend_y_recarga", async () => {
        postIniciarPago.mockRejectedValue(errorApi(400, "Stock insuficiente: REF1"));

        const r = ctxDe(await iniciarPago(contexto("PAGANDO")));

        expect(r.estado).toBe("DATOS");
        expect(r.error).toBe("Stock insuficiente: REF1");
        expect(recargarCarrito).toHaveBeenCalledOnce();
    });

    test("checkout_maquina_05_no_redirige_ni_guarda_token", async () => {
        postIniciarPago.mockRejectedValue(errorApi(400));

        await iniciarPago(contexto("PAGANDO"));

        expect(redirigirA).not.toHaveBeenCalled();
        expect(sessionStorage.getItem("tienda_online.pago_en_curso.sanhigia_es")).toBeNull();
    });
});

describe("[checkout-maquina-06] [PAGANDO] otro error → REVISION", () => {
    const MENSAJE = "No se ha podido iniciar el pago. Inténtalo de nuevo.";

    test("checkout_maquina_06_500_vuelve_a_revision_con_mensaje_generico", async () => {
        postIniciarPago.mockRejectedValue(errorApi(500, "fallo pasarela"));

        const r = ctxDe(await iniciarPago(contexto("PAGANDO")));

        expect(r.estado).toBe("REVISION");
        expect(r.error).toBe(MENSAJE);
        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(redirigirA).not.toHaveBeenCalled();
    });

    test("checkout_maquina_06_error_sin_estado_vuelve_a_revision", async () => {
        postIniciarPago.mockRejectedValue(new Error("red"));

        const r = ctxDe(await iniciarPago(contexto("PAGANDO")));

        expect(r.estado).toBe("REVISION");
        expect(r.error).toBe(MENSAJE);
    });

    test.each([404, 409])("checkout_maquina_06_%i_ademas_olvida_el_carrito", async (estado) => {
        postIniciarPago.mockRejectedValue(errorApi(estado));

        const r = ctxDe(await iniciarPago(contexto("PAGANDO")));

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(r.estado).toBe("REVISION");
        expect(r.error).toBe(MENSAJE);
    });
});
