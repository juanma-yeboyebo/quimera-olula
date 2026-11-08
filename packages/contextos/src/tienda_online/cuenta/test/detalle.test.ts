import { beforeEach, describe, expect, test, vi } from "vitest";
import { ContextoCuenta } from "#/tienda_online/cuenta/detalle/diseño.ts";
import { CuentaTienda, PedidoResumen } from "#/tienda_online/cuenta/diseño.ts";

const getCuenta = vi.fn();
const getPedidos = vi.fn();
const patchCuenta = vi.fn();
const postDireccion = vi.fn();
const patchDireccion = vi.fn();
const deleteDireccion = vi.fn();
const patchDireccionEnvio = vi.fn();
const patchDireccionFacturacion = vi.fn();

vi.mock("#/tienda_online/cuenta/infraestructura.ts", () => ({
    getCuenta: () => getCuenta(),
    getPedidos: (pagina: number) => getPedidos(pagina),
    patchCuenta: (d: unknown) => patchCuenta(d),
    postDireccion: (d: unknown) => postDireccion(d),
    patchDireccion: (id: string, d: unknown) => patchDireccion(id, d),
    deleteDireccion: (id: string) => deleteDireccion(id),
    patchDireccionEnvio: (id: string) => patchDireccionEnvio(id),
    patchDireccionFacturacion: (id: string) => patchDireccionFacturacion(id),
}));

const {
    borrarDireccion,
    cargarCuenta,
    cerrarFormulario,
    contextoCuentaInicial,
    guardarDatos,
    guardarDireccion,
    marcarEnvio,
    marcarFacturacion,
    verMasPedidos,
} = await import(
    "#/tienda_online/cuenta/detalle/detalle.ts"
);

const cuenta: CuentaTienda = {
    email: "ana@example.com",
    nombre: "Ana",
    idFiscal: "B1",
    telefono: null,
    clienteId: "C1",
    direcciones: [],
};

const pedido = (id: string): PedidoResumen => ({
    id,
    codigo: `P-${id}`,
    fecha: "2026-01-01",
    total: 10,
    divisa: "EUR",
    servido: "No",
});

type Resultado = ContextoCuenta | [ContextoCuenta, unknown[]];
const ctxDe = (r: Resultado): ContextoCuenta => (Array.isArray(r) ? r[0] : r);

const errorApi = (estado: number) => ({ nombre: "Error", descripcion: "x", estado });

beforeEach(() => {
    getCuenta.mockReset();
    getPedidos.mockReset();
    patchCuenta.mockReset();
    postDireccion.mockReset();
    patchDireccion.mockReset();
    deleteDireccion.mockReset();
    patchDireccionEnvio.mockReset();
    patchDireccionFacturacion.mockReset();
});

describe("[cuenta-mi_cuenta-01] Carga de mi cuenta", () => {
    test("cuenta_mi_cuenta_01_carga_la_cuenta_y_la_primera_pagina_de_pedidos", async () => {
        getCuenta.mockResolvedValue(cuenta);
        getPedidos.mockResolvedValue({ pedidos: [pedido("1")], total: 1 });

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("LISTA");
        expect(r.cuenta).toEqual(cuenta);
        expect(r.pedidos.map((p) => p.id)).toEqual(["1"]);
        expect(r.total).toBe(1);
        expect(r.pagina).toBe(1);
        expect(getPedidos).toHaveBeenCalledWith(1);
    });

    test("cuenta_mi_cuenta_01_error_distinto_de_404_pasa_a_error", async () => {
        getCuenta.mockRejectedValue(errorApi(500));

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("ERROR");
        expect(getPedidos).not.toHaveBeenCalled();
    });
});

describe("[cuenta-mi_cuenta-02] 404 sin cuenta en la tienda", () => {
    test("cuenta_mi_cuenta_02_404_pasa_a_sin_cuenta_y_no_pide_pedidos", async () => {
        getCuenta.mockRejectedValue(errorApi(404));

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("SIN_CUENTA");
        expect(r.cuenta).toBeNull();
        expect(getPedidos).not.toHaveBeenCalled();
    });
});

describe("[cuenta-pedidos-01] Fallo al cargar pedidos", () => {
    test("cuenta_pedidos_01_la_cuenta_se_muestra_y_se_marca_error_de_pedidos", async () => {
        getCuenta.mockResolvedValue(cuenta);
        getPedidos.mockRejectedValue(errorApi(500));

        const r = ctxDe(await cargarCuenta(contextoCuentaInicial));

        expect(r.estado).toBe("LISTA");
        expect(r.errorPedidos).toBe(true);
        expect(r.pedidos).toEqual([]);
    });
});

describe("[cuenta-pedidos-02] Ver más añade la página siguiente", () => {
    const base: ContextoCuenta = {
        estado: "LISTA",
        cuenta,
        pedidos: [pedido("1"), pedido("2")],
        total: 3,
        pagina: 1,
        errorPedidos: false,
        errorEdicion: null,
        erroresEdicion: {},
    };

    test("cuenta_pedidos_02_pide_la_pagina_siguiente_y_añade_los_pedidos", async () => {
        getPedidos.mockResolvedValue({ pedidos: [pedido("3")], total: 3 });

        const r = ctxDe(await verMasPedidos(base));

        expect(getPedidos).toHaveBeenCalledWith(2);
        expect(r.pedidos.map((p) => p.id)).toEqual(["1", "2", "3"]);
        expect(r.pagina).toBe(2);
        expect(r.estado).toBe("LISTA");
    });

    test("cuenta_pedidos_02_si_falla_conserva_la_lista_y_la_pagina", async () => {
        getPedidos.mockRejectedValue(errorApi(500));

        const r = ctxDe(await verMasPedidos(base));

        expect(r.pedidos).toHaveLength(2);
        expect(r.pagina).toBe(1);
        expect(r.errorPedidos).toBe(true);
    });
});

const enLista: ContextoCuenta = {
    ...contextoCuentaInicial,
    estado: "GUARDANDO",
    cuenta,
    pedidos: [pedido("1")],
    total: 1,
};

const cuentaNueva: CuentaTienda = { ...cuenta, nombre: "Ana María" };

const direccion = {
    nombreVia: "Mayor",
    numero: null,
    codPostal: "28001",
    ciudad: "Madrid",
    provincia: null,
    paisId: "ES",
};

describe("[cuenta-editar_datos-03] Guardar datos", () => {
    test("cuenta_editar_datos_03_envia_los_datos_recarga_la_cuenta_y_vuelve_a_lista", async () => {
        const datos = { nombre: "Ana María", idFiscal: "B1", telefono: null };
        patchCuenta.mockResolvedValue(undefined);
        getCuenta.mockResolvedValue(cuentaNueva);

        const r = ctxDe(await guardarDatos(enLista, datos));

        expect(patchCuenta).toHaveBeenCalledWith(datos);
        expect(r.estado).toBe("LISTA");
        expect(r.cuenta).toEqual(cuentaNueva);
        expect(r.errorEdicion).toBeNull();
        expect(r.pedidos).toEqual(enLista.pedidos);
    });
});

describe("[cuenta-editar_datos-02] Validación de datos", () => {
    test("cuenta_editar_datos_02_con_errores_no_se_envia", async () => {
        const r = ctxDe(await guardarDatos(enLista, { nombre: "", idFiscal: "", telefono: null }));

        expect(patchCuenta).not.toHaveBeenCalled();
        expect(r.estado).toBe("LISTA");
        expect(r.erroresEdicion.nombre).toBeTruthy();
        expect(r.erroresEdicion.idFiscal).toBeTruthy();
    });
});

describe("[cuenta-editar_datos-04] Error al guardar datos", () => {
    test("cuenta_editar_datos_04_vuelve_a_lista_con_el_texto_del_backend", async () => {
        patchCuenta.mockRejectedValue({ nombre: "Error", descripcion: "NIF no válido", estado: 400 });

        const r = ctxDe(await guardarDatos(enLista, { nombre: "Ana", idFiscal: "x", telefono: null }));

        expect(r.estado).toBe("LISTA");
        expect(r.errorEdicion).toBe("NIF no válido");
        expect(getCuenta).not.toHaveBeenCalled();
    });
});

describe("[cuenta-direcciones-04] Guardar dirección", () => {
    test("cuenta_direcciones_04_sin_id_crea_la_direccion", async () => {
        postDireccion.mockResolvedValue(undefined);
        getCuenta.mockResolvedValue(cuentaNueva);

        const r = ctxDe(await guardarDireccion(enLista, { id: null, direccion }));

        expect(postDireccion).toHaveBeenCalledWith(direccion);
        expect(patchDireccion).not.toHaveBeenCalled();
        expect(r.estado).toBe("LISTA");
        expect(r.cuenta).toEqual(cuentaNueva);
    });

    test("cuenta_direcciones_04_con_id_actualiza_la_direccion", async () => {
        patchDireccion.mockResolvedValue(undefined);
        getCuenta.mockResolvedValue(cuentaNueva);

        await guardarDireccion(enLista, { id: "D1", direccion });

        expect(patchDireccion).toHaveBeenCalledWith("D1", direccion);
        expect(postDireccion).not.toHaveBeenCalled();
    });

    test("cuenta_direcciones_04_con_error_muestra_el_texto_del_backend", async () => {
        postDireccion.mockRejectedValue({ nombre: "Error", descripcion: "Código postal no válido", estado: 400 });

        const r = ctxDe(await guardarDireccion(enLista, { id: null, direccion }));

        expect(r.estado).toBe("LISTA");
        expect(r.errorEdicion).toBe("Código postal no válido");
    });

    test("cuenta_direcciones_03_con_errores_de_validacion_no_se_envia", async () => {
        const r = ctxDe(
            await guardarDireccion(enLista, { id: null, direccion: { ...direccion, ciudad: "" } }),
        );

        expect(postDireccion).not.toHaveBeenCalled();
        expect(r.erroresEdicion["direccion.ciudad"]).toBeTruthy();
    });
});

describe("[cuenta-direcciones-05] Borrar dirección", () => {
    test("cuenta_direcciones_05_borra_y_recarga_la_cuenta", async () => {
        deleteDireccion.mockResolvedValue(undefined);
        getCuenta.mockResolvedValue(cuentaNueva);

        const r = ctxDe(await borrarDireccion(enLista, "D1"));

        expect(deleteDireccion).toHaveBeenCalledWith("D1");
        expect(r.estado).toBe("LISTA");
        expect(r.cuenta).toEqual(cuentaNueva);
    });

    test("cuenta_direcciones_05_con_error_muestra_su_texto", async () => {
        deleteDireccion.mockRejectedValue({ nombre: "Error", descripcion: "Es la de facturación", estado: 409 });

        const r = ctxDe(await borrarDireccion(enLista, "D1"));

        expect(r.estado).toBe("LISTA");
        expect(r.errorEdicion).toBe("Es la de facturación");
    });
});

describe("[cuenta-direcciones-06] Marcar envío y facturación", () => {
    test("cuenta_direcciones_06_marcar_envio_envia_y_recarga", async () => {
        patchDireccionEnvio.mockResolvedValue(undefined);
        getCuenta.mockResolvedValue(cuentaNueva);

        const r = ctxDe(await marcarEnvio(enLista, "D2"));

        expect(patchDireccionEnvio).toHaveBeenCalledWith("D2");
        expect(r.cuenta).toEqual(cuentaNueva);
        expect(r.estado).toBe("LISTA");
    });

    test("cuenta_direcciones_06_marcar_facturacion_con_error_muestra_su_texto", async () => {
        patchDireccionFacturacion.mockRejectedValue({ nombre: "Error", descripcion: "No existe", estado: 404 });

        const r = ctxDe(await marcarFacturacion(enLista, "D2"));

        expect(patchDireccionFacturacion).toHaveBeenCalledWith("D2");
        expect(r.estado).toBe("LISTA");
        expect(r.errorEdicion).toBe("No existe");
    });

    test("cuenta_direcciones_06_cerrar_formulario_limpia_los_errores", async () => {
        const r = ctxDe(
            await cerrarFormulario({ ...enLista, estado: "LISTA", errorEdicion: "x", erroresEdicion: { a: "b" } }),
        );

        expect(r.errorEdicion).toBeNull();
        expect(r.erroresEdicion).toEqual({});
    });
});
