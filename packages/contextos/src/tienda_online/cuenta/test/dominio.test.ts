import { describe, expect, test } from "vitest";
import { DatosRegistro } from "#/tienda_online/cuenta/diseño.ts";
import {
    añadirPedidos,
    criteriaPedidos,
    datosRegistroIniciales,
    erroresRegistro,
    PEDIDOS_POR_PAGINA,
} from "#/tienda_online/cuenta/dominio.ts";

const validos: DatosRegistro = {
    email: "ana@example.com",
    password: "12345678",
    repetirPassword: "12345678",
    nombre: "Ana",
    idFiscal: "B12345678",
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
