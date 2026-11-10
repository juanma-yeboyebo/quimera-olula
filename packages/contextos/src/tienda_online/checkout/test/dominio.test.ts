import { describe, expect, test } from "vitest";
import {
    CarritoTienda,
    FormaEnvioTienda,
    FormaPagoTienda,
} from "#/tienda_online/comun/diseño.ts";
import { DatosCheckout, DireccionCheckout } from "#/tienda_online/checkout/diseño.ts";
import {
    clavePagoEnCurso,
    datosCheckoutIniciales,
    elegirFormaEnvio,
    erroresCheckout,
    resultadoPago,
} from "#/tienda_online/checkout/dominio.ts";

const direccionValida: DireccionCheckout = {
    nombreVia: "Mayor",
    tipoVia: "Calle",
    numero: "5",
    otros: null,
    codPostal: "28001",
    ciudad: "Madrid",
    provincia: "Madrid",
    paisId: "ES",
    telefono: null,
};

const direccionVacia: DireccionCheckout = {
    nombreVia: "",
    tipoVia: null,
    numero: null,
    otros: null,
    codPostal: "",
    ciudad: "",
    provincia: null,
    paisId: "",
    telefono: null,
};

const datosValidos: DatosCheckout = {
    email: "ana@example.com",
    nombre: "Ana",
    idFiscal: null,
    telefono: null,
    direccionFacturacion: direccionValida,
    envioDistinto: false,
    direccionEnvio: direccionVacia,
    idFormaEnvio: null,
    idFormaPago: null,
};

const carrito = (datosCheckout: Record<string, unknown> | null): CarritoTienda => ({
    token: "t",
    estado: "ABIERTO",
    divisa: "EUR",
    neto: 0,
    totalIva: 0,
    total: 0,
    unidades: 0,
    datosCheckout,
    lineas: [],
    documento: null,
});

const direccionApi = {
    nombre_via: "Mayor",
    tipo_via: "Calle",
    numero: "5",
    otros: null,
    cod_postal: "28001",
    ciudad: "Madrid",
    provincia: "Madrid",
    pais_id: "ES",
    telefono: null,
};

describe("[checkout-datos-01] El formulario empieza vacío con ES por defecto o con los datosCheckout del carrito", () => {
    test("checkout_datos_01_sin_carrito_empieza_vacio_con_pais_es", () => {
        const d = datosCheckoutIniciales(null);

        expect(d.email).toBe("");
        expect(d.nombre).toBe("");
        expect(d.direccionFacturacion.nombreVia).toBe("");
        expect(d.direccionFacturacion.codPostal).toBe("");
        expect(d.direccionFacturacion.ciudad).toBe("");
        expect(d.direccionFacturacion.paisId).toBe("ES");
        expect(d.envioDistinto).toBe(false);
    });

    test("checkout_datos_01_carrito_sin_datos_checkout_empieza_vacio_con_pais_es", () => {
        const d = datosCheckoutIniciales(carrito(null));

        expect(d.email).toBe("");
        expect(d.direccionFacturacion.paisId).toBe("ES");
        expect(d.envioDistinto).toBe(false);
    });

    test("checkout_datos_01_usa_los_datos_del_carrito", () => {
        const d = datosCheckoutIniciales(
            carrito({
                email: "ana@example.com",
                nombre: "Ana",
                id_fiscal: "12345678Z",
                telefono: "600",
                direccion_facturacion: { ...direccionApi, pais_id: "PT" },
                direccion_envio: null,
            }),
        );

        expect(d.email).toBe("ana@example.com");
        expect(d.nombre).toBe("Ana");
        expect(d.idFiscal).toBe("12345678Z");
        expect(d.telefono).toBe("600");
        expect(d.direccionFacturacion.nombreVia).toBe("Mayor");
        expect(d.direccionFacturacion.tipoVia).toBe("Calle");
        expect(d.direccionFacturacion.numero).toBe("5");
        expect(d.direccionFacturacion.codPostal).toBe("28001");
        expect(d.direccionFacturacion.ciudad).toBe("Madrid");
        expect(d.direccionFacturacion.provincia).toBe("Madrid");
        expect(d.direccionFacturacion.paisId).toBe("PT");
    });
});

describe("[checkout-datos-02] La casilla de envío distinto muestra una segunda dirección; desmarcada se envía null", () => {
    test("checkout_datos_02_sin_direccion_envio_la_casilla_esta_desmarcada", () => {
        const d = datosCheckoutIniciales(
            carrito({ email: "a@b.es", nombre: "A", direccion_facturacion: direccionApi, direccion_envio: null }),
        );

        expect(d.envioDistinto).toBe(false);
    });

    test("checkout_datos_02_con_direccion_envio_la_casilla_esta_marcada_y_se_rellena", () => {
        const d = datosCheckoutIniciales(
            carrito({
                email: "a@b.es",
                nombre: "A",
                direccion_facturacion: direccionApi,
                direccion_envio: { ...direccionApi, ciudad: "Sevilla" },
            }),
        );

        expect(d.envioDistinto).toBe(true);
        expect(d.direccionEnvio.ciudad).toBe("Sevilla");
        expect(d.direccionEnvio.codPostal).toBe("28001");
    });
});

describe("[checkout-datos-03] Validación en el cliente con erroresCheckout", () => {
    test("checkout_datos_03_datos_validos_sin_errores", () => {
        expect(erroresCheckout(datosValidos)).toEqual({});
    });

    test("checkout_datos_03_nif_y_telefono_son_opcionales", () => {
        const e = erroresCheckout({ ...datosValidos, idFiscal: null, telefono: "" });

        expect(e).toEqual({});
    });

    test.each(["", "ana", "ana@", "ana@example", "@example.com", "a na@example.com"])(
        "checkout_datos_03_email_%j_no_valido",
        (email) => {
            const e = erroresCheckout({ ...datosValidos, email });

            expect(e.email).toBeTruthy();
        },
    );

    test("checkout_datos_03_email_valido_no_da_error", () => {
        expect(erroresCheckout({ ...datosValidos, email: "ana.p@example.co.uk" }).email).toBeUndefined();
    });

    test("checkout_datos_03_nombre_obligatorio", () => {
        const e = erroresCheckout({ ...datosValidos, nombre: "   " });

        expect(e.nombre).toBeTruthy();
    });

    test.each(["nombreVia", "codPostal", "ciudad", "paisId"] as const)(
        "checkout_datos_03_facturacion_%s_obligatorio",
        (campo) => {
            const e = erroresCheckout({
                ...datosValidos,
                direccionFacturacion: { ...direccionValida, [campo]: "" },
            });

            expect(e[`direccionFacturacion.${campo}`]).toBeTruthy();
            expect(Object.keys(e)).toEqual([`direccionFacturacion.${campo}`]);
        },
    );

    test("checkout_datos_03_numero_otros_y_provincia_son_opcionales", () => {
        const e = erroresCheckout({
            ...datosValidos,
            direccionFacturacion: { ...direccionValida, numero: null, otros: null, provincia: null, tipoVia: null },
        });

        expect(e).toEqual({});
    });

    test("checkout_datos_03_sin_envio_distinto_no_se_valida_la_direccion_de_envio", () => {
        const e = erroresCheckout({ ...datosValidos, envioDistinto: false, direccionEnvio: direccionVacia });

        expect(e).toEqual({});
    });

    test("checkout_datos_03_con_envio_distinto_se_validan_los_mismos_campos_en_envio", () => {
        const e = erroresCheckout({ ...datosValidos, envioDistinto: true, direccionEnvio: direccionVacia });

        expect(e["direccionEnvio.nombreVia"]).toBeTruthy();
        expect(e["direccionEnvio.codPostal"]).toBeTruthy();
        expect(e["direccionEnvio.ciudad"]).toBeTruthy();
        expect(e["direccionEnvio.paisId"]).toBeTruthy();
        expect(Object.keys(e).some((k) => k.startsWith("direccionFacturacion."))).toBe(false);
    });

    test("checkout_datos_03_con_envio_distinto_valido_sin_errores", () => {
        const e = erroresCheckout({ ...datosValidos, envioDistinto: true, direccionEnvio: direccionValida });

        expect(e).toEqual({});
    });
});

describe("[checkout-ok-02] resultadoPago traduce el estado del carrito", () => {
    test.each([
        ["PAGADO", "CONFIRMADO"],
        ["CONFIRMADO", "CONFIRMADO"],
        ["CONVERTIDO", "CONFIRMADO"],
        ["ERROR_CONVERSION", "INCIDENCIA"],
        ["ABIERTO", "PENDIENTE"],
        ["PAGO_PENDIENTE", "PENDIENTE"],
    ] as const)("checkout_ok_02_%s_es_%s", (estado, esperado) => {
        expect(resultadoPago(estado)).toBe(esperado);
    });
});

describe("[checkout-maquina-04] [checkout-ok-01] Clave de sessionStorage del pago en curso", () => {
    test("checkout_maquina_04_clave_por_storeview", () => {
        expect(clavePagoEnCurso("sanhigia_es")).toBe("tienda_online.pago_en_curso.sanhigia_es");
    });

    test("checkout_ok_01_claves_distintas_por_storeview", () => {
        expect(clavePagoEnCurso("a")).not.toBe(clavePagoEnCurso("b"));
    });
});

const formasEnvio: FormaEnvioTienda[] = [
    { id: 1, codigo: "DOM", nombre: "A domicilio", descripcion: "24-48 h", tipo: "DOMICILIO" },
    { id: 2, codigo: "REC", nombre: "Recogida en tienda", descripcion: null, tipo: "RECOGIDA" },
];

const formasPago: FormaPagoTienda[] = [
    { id: 10, codigo: "TAR", nombre: "Tarjeta", descripcion: null, tipo: "PASARELA" },
    { id: 11, codigo: "TRF", nombre: "Transferencia", descripcion: "ES00 0000", tipo: "SIN_PASARELA" },
];

describe("[checkout-datos-05] [checkout-datos-07] Empieza marcada la forma del carrito o la primera", () => {
    test("checkout_datos_05_sin_forma_en_el_carrito_marca_la_primera", () => {
        const d = datosCheckoutIniciales(carrito(null), formasEnvio, formasPago);

        expect(d.idFormaEnvio).toBe(1);
        expect(d.idFormaPago).toBe(10);
    });

    test("checkout_datos_05_marca_la_forma_del_carrito", () => {
        const d = datosCheckoutIniciales(
            {
                ...carrito(null),
                formaEnvio: { id: 2, nombre: "Recogida en tienda", tipo: "RECOGIDA" },
                formaPago: { id: 11, nombre: "Transferencia", tipo: "SIN_PASARELA" },
            },
            formasEnvio,
            formasPago,
        );

        expect(d.idFormaEnvio).toBe(2);
        expect(d.idFormaPago).toBe(11);
    });

    test("checkout_datos_07_sin_formas_en_el_storeview_queda_a_null", () => {
        const d = datosCheckoutIniciales(null);

        expect(d.idFormaEnvio).toBeNull();
        expect(d.idFormaPago).toBeNull();
    });
});

describe("[checkout-datos-06] Con una forma de envío RECOGIDA no hay dirección de envío", () => {
    test("checkout_datos_06_elegir_recogida_desmarca_el_envio_distinto", () => {
        const d = elegirFormaEnvio({ ...datosValidos, envioDistinto: true }, formasEnvio[1]);

        expect(d.idFormaEnvio).toBe(2);
        expect(d.envioDistinto).toBe(false);
    });

    test("checkout_datos_06_elegir_domicilio_conserva_el_envio_distinto", () => {
        const d = elegirFormaEnvio({ ...datosValidos, envioDistinto: true }, formasEnvio[0]);

        expect(d.idFormaEnvio).toBe(1);
        expect(d.envioDistinto).toBe(true);
    });

    test("checkout_datos_06_carrito_con_recogida_y_direccion_de_envio_empieza_desmarcado", () => {
        const d = datosCheckoutIniciales(
            {
                ...carrito({
                    email: "a@b.es",
                    nombre: "A",
                    direccion_facturacion: direccionApi,
                    direccion_envio: direccionApi,
                }),
                formaEnvio: { id: 2, nombre: "Recogida en tienda", tipo: "RECOGIDA" },
            },
            formasEnvio,
            formasPago,
        );

        expect(d.envioDistinto).toBe(false);
    });
});
