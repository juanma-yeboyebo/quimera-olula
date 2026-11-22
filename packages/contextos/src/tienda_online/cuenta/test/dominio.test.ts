import { describe, expect, test } from "vitest";
import { DatosRegistro } from "#/tienda_online/cuenta/diseño.ts";
import {
    campoRegistroValido,
    añadirPedidos,
    criteriaPedidos,
    datosRegistroIniciales,
    erroresCambioPassword,
    erroresDatosCuenta,
    erroresDireccion,
    erroresRegistro,
    idFiscalValido,
    opcionesPais,
    paisFacturacion,
    PEDIDOS_POR_PAGINA,
    telefonoValido,
} from "#/tienda_online/cuenta/dominio.ts";

const validos: DatosRegistro = {
    email: "ana@example.com",
    password: "12345678",
    repetirPassword: "12345678",
    nombre: "Ana",
    idFiscal: "B12345674",
    telefono: null,
    direccion: {
        nombreVia: "Mayor",
        numero: null,
        codPostal: "28001",
        ciudad: "Madrid",
        provincia: null,
        paisId: "ES",
    },
};

describe("[cuenta-registro-01] Valores iniciales del formulario de registro", () => {
    test("cuenta_registro_01_el_pais_por_defecto_es_es", () => {
        expect(datosRegistroIniciales().direccion.paisId).toBe("ES");
    });
});

describe("[cuenta-registro-02] Validación del registro", () => {
    test("cuenta_registro_02_datos_validos_no_dan_errores", () => {
        expect(erroresRegistro(validos)).toEqual({});
    });

    test("cuenta_registro_02_email_con_formato_invalido", () => {
        expect(erroresRegistro({ ...validos, email: "ana@" }).email).toBeTruthy();
    });

    test("cuenta_registro_02_contraseña_de_menos_de_8_caracteres", () => {
        const e = erroresRegistro({ ...validos, password: "1234567", repetirPassword: "1234567" });

        expect(e.password).toBeTruthy();
    });

    test("cuenta_registro_02_contraseñas_distintas", () => {
        const e = erroresRegistro({ ...validos, repetirPassword: "87654321" });

        expect(e.repetirPassword).toBe("Las contraseñas no coinciden");
    });

    test("cuenta_registro_02_obligatorios_vacios", () => {
        const e = erroresRegistro({
            ...validos,
            nombre: " ",
            idFiscal: "",
            direccion: { ...validos.direccion, nombreVia: "", codPostal: "", ciudad: "", paisId: "" },
        });

        expect(Object.keys(e).sort()).toEqual(
            [
                "nombre",
                "idFiscal",
                "direccion.nombreVia",
                "direccion.codPostal",
                "direccion.ciudad",
                "direccion.paisId",
            ].sort(),
        );
    });

    test("cuenta_registro_02_telefono_numero_y_provincia_son_opcionales", () => {
        expect(erroresRegistro({ ...validos, telefono: "" })).toEqual({});
    });
});

describe("[cuenta-pedidos-01] Criteria de pedidos", () => {
    test("cuenta_pedidos_01_orden_por_fecha_descendente_de_20_en_20", () => {
        const c = criteriaPedidos(3);

        expect(PEDIDOS_POR_PAGINA).toBe(20);
        expect(c.orden).toEqual(["fecha", "DESC"]);
        expect(c.paginacion).toEqual({ limite: 20, pagina: 3 });
    });
});

describe("[cuenta-pedidos-02] añadirPedidos", () => {
    const pedido = (id: string) => ({
        id,
        codigo: `P-${id}`,
        fecha: "2026-01-01",
        total: 1,
        divisa: "EUR",
        servido: "No",
    });

    test("cuenta_pedidos_02_añade_los_nuevos_sin_duplicar", () => {
        const r = añadirPedidos([pedido("1"), pedido("2")], [pedido("2"), pedido("3")]);

        expect(r.map((p) => p.id)).toEqual(["1", "2", "3"]);
    });
});

describe("[cuenta-editar_datos-02] Validación de datos de cuenta", () => {
    test("cuenta_editar_datos_02_datos_validos_no_dan_errores", () => {
        expect(erroresDatosCuenta({ nombre: "Ana", idFiscal: "B1", telefono: null }, null)).toEqual({});
    });

    test("cuenta_editar_datos_02_nombre_e_id_fiscal_son_obligatorios", () => {
        const e = erroresDatosCuenta({ nombre: " ", idFiscal: "", telefono: null }, null);
        expect(e.nombre).toBe("El nombre es obligatorio");
        expect(e.idFiscal).toBe("El NIF/CIF es obligatorio");
    });
});

describe("[cuenta-editar_datos-02] NIF y teléfono al editar datos", () => {
    test("cuenta_editar_datos_02_el_nif_se_valida_con_el_pais_dado", () => {
        const datos = { nombre: "Ana", idFiscal: "12345678A", telefono: null };

        expect(erroresDatosCuenta(datos, "ES").idFiscal).toBe("El NIF/CIF no es válido");
        expect(erroresDatosCuenta(datos, "FR")).toEqual({});
    });

    test("cuenta_editar_datos_02_telefono_no_valido", () => {
        const e = erroresDatosCuenta({ nombre: "Ana", idFiscal: "B1", telefono: "60012345" }, null);

        expect(e.telefono).toBe("El teléfono no es válido");
    });

    test("cuenta_editar_datos_02_pais_de_la_direccion_de_facturacion", () => {
        const direccion = { id: "1", nombreVia: "Mayor", numero: null, codPostal: "1", ciudad: "M", provincia: null };
        const cuenta = {
            email: "a@b.es", nombre: "Ana", idFiscal: "B1", telefono: null, clienteId: "C1",
            direcciones: [
                { ...direccion, paisId: "FR", envio: true, facturacion: false },
                { ...direccion, id: "2", paisId: "ES", envio: false, facturacion: true },
            ],
        };

        expect(paisFacturacion(cuenta)).toBe("ES");
        expect(paisFacturacion(null)).toBeNull();
    });
});

describe("[cuenta-password-01] Validación del cambio de contraseña", () => {
    test("cuenta_password_01_datos_validos_no_dan_errores", () => {
        expect(erroresCambioPassword({ actual: "vieja", nueva: "12345678", repetir: "12345678" })).toEqual({});
    });

    test("cuenta_password_01_actual_obligatoria", () => {
        const e = erroresCambioPassword({ actual: "", nueva: "12345678", repetir: "12345678" });
        expect(e.actual).toBe("La contraseña actual es obligatoria");
        expect(e.nueva).toBeUndefined();
    });

    test("cuenta_password_01_nueva_minimo_8_caracteres", () => {
        const e = erroresCambioPassword({ actual: "vieja", nueva: "1234567", repetir: "1234567" });
        expect(e.nueva).toBe("La contraseña debe tener al menos 8 caracteres");
    });

    test("cuenta_password_01_repetir_debe_coincidir", () => {
        const e = erroresCambioPassword({ actual: "vieja", nueva: "12345678", repetir: "12345679" });
        expect(e.repetir).toBe("Las contraseñas no coinciden");
    });
});

describe("[cuenta-direcciones-03] Validación de dirección", () => {
    test("cuenta_direcciones_03_direccion_valida_no_da_errores", () => {
        expect(erroresDireccion(validos.direccion)).toEqual({});
    });

    test("cuenta_direcciones_03_campos_obligatorios_con_los_textos_del_registro", () => {
        const e = erroresDireccion({ ...validos.direccion, nombreVia: "", codPostal: "", ciudad: "", paisId: "" });
        expect(e["direccion.nombreVia"]).toBe("La vía es obligatoria");
        expect(e["direccion.codPostal"]).toBe("El código postal es obligatorio");
        expect(e["direccion.ciudad"]).toBe("La ciudad es obligatoria");
        expect(e["direccion.paisId"]).toBe("El país es obligatorio");
    });

    test("cuenta_direcciones_03_el_registro_reutiliza_los_errores_de_direccion", () => {
        const direccion = { ...validos.direccion, ciudad: "" };
        expect(erroresRegistro({ ...validos, direccion })).toEqual(erroresDireccion(direccion));
    });
});

describe("[cuenta-registro-09] Campos correctos", () => {
    test("cuenta_registro_09_solo_es_valido_un_obligatorio_tocado_y_sin_error", () => {
        const errores = { nombre: "El nombre es obligatorio" };

        expect(campoRegistroValido("email", ["email"], errores)).toBe(true);
        expect(campoRegistroValido("email", [], errores)).toBe(false);
        expect(campoRegistroValido("nombre", ["nombre"], errores)).toBe(false);
        expect(campoRegistroValido("telefono", ["telefono"], {})).toBe(false);
    });
});

describe("[cuenta-registro-02] Formato de NIF/CIF y teléfono", () => {
    test("cuenta_registro_02_nif_valido_en_espana", () => {
        for (const valor of ["12345678Z", "12345678-z", "X1234567L", "y1234567x", "Z1234567R", "B12345674", "P1234567D", "A58818501"])
            expect(idFiscalValido(valor, "ES"), valor).toBe(true);
    });

    test("cuenta_registro_02_nif_no_valido_en_espana", () => {
        for (const valor of ["12345678A", "1234567Z", "X1234567A", "B12345675", "I12345674", "HOLA", "", "   "])
            expect(idFiscalValido(valor, "ES"), valor).toBe(false);
    });

    test("cuenta_registro_02_fuera_de_espana_basta_con_que_no_este_vacio", () => {
        expect(idFiscalValido("FR12345678901", "FR")).toBe(true);
        expect(idFiscalValido("12345678A", null)).toBe(true);
        expect(idFiscalValido("  ", "FR")).toBe(false);
    });

    test("cuenta_registro_02_telefono", () => {
        for (const valor of [null, "", "600123456", "+34 600 123 456", "91-123-45-67", "+442071234567"])
            expect(telefonoValido(valor), String(valor)).toBe(true);
        for (const valor of ["60012345", "1234567890123456", "600 12a 456", "34+600123456", "(91) 1234567"])
            expect(telefonoValido(valor), valor).toBe(false);
    });

    test("cuenta_registro_02_errores_con_los_textos_del_servidor", () => {
        const e = erroresRegistro({ ...validos, idFiscal: "12345678A", telefono: "123" });

        expect(e.idFiscal).toBe("El NIF/CIF no es válido");
        expect(e.telefono).toBe("El teléfono no es válido");
        expect(erroresRegistro({ ...validos, idFiscal: "12345678A", direccion: { ...validos.direccion, paisId: "FR" } })).toEqual({});
    });
});

describe("[cuenta-registro-01] Opciones del selector de país", () => {
    const paises = [{ id: "DE", nombre: "Alemania" }, { id: "ES", nombre: "España" }];

    test("cuenta_registro_01_usa_los_paises_cargados", () => {
        expect(opcionesPais(paises, "ES")).toEqual(paises);
    });

    test("cuenta_registro_01_sin_paises_solo_muestra_es", () => {
        expect(opcionesPais([], "ES")).toEqual([{ id: "ES", nombre: "ES" }]);
    });

    test("cuenta_registro_01_conserva_un_pais_actual_que_no_esta_en_la_lista", () => {
        expect(opcionesPais(paises, "PT")).toEqual([...paises, { id: "PT", nombre: "PT" }]);
    });
});
