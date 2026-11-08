import { describe, expect, test } from "vitest";
import {
    conflictoDeError,
    elegirWebsite,
    errorLongitud,
    errorSlug,
    slugValido,
    textoContador,
} from "#/tienda_admin/comun/dominio.ts";

const web = (id: number, activo = true) => ({ id, codigo: `w${id}`, nombre: `Web ${id}`, activo });

describe("[tienda_admin-articulo-publicacion-02] El slug se valida con las reglas del servidor", () => {
    test("tienda_admin_articulo_publicacion_02_acepta_minusculas_numeros_y_guiones", () => {
        expect(slugValido("camiseta-roja-2")).toBe(true);
    });

    test("tienda_admin_articulo_publicacion_02_vacio_es_valido_porque_lo_genera_el_servidor", () => {
        expect(errorSlug("")).toBeNull();
    });

    test("tienda_admin_articulo_publicacion_02_rechaza_mayusculas", () => {
        expect(slugValido("Camiseta")).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_rechaza_acentos_y_enie", () => {
        expect(slugValido("camiseta-ñandú")).toBe(false);
        expect(slugValido("camión")).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_rechaza_espacios_y_simbolos", () => {
        expect(slugValido("camiseta roja")).toBe(false);
        expect(slugValido("camiseta_roja")).toBe(false);
        expect(slugValido("a/b")).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_rechaza_guiones_en_los_extremos", () => {
        expect(slugValido("-camiseta")).toBe(false);
        expect(slugValido("camiseta-")).toBe(false);
        expect(slugValido("-")).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_admite_150_y_rechaza_151", () => {
        expect(slugValido("a".repeat(150))).toBe(true);
        expect(slugValido("a".repeat(151))).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_el_motivo_es_un_texto", () => {
        expect(errorSlug("Hola")).toEqual(expect.any(String));
    });
});

describe("[tienda_admin-articulo-textos-01] Los textos tienen longitud máxima y contador", () => {
    test("tienda_admin_articulo_textos_01_dentro_del_maximo_no_hay_error", () => {
        expect(errorLongitud("a".repeat(255), 255)).toBeNull();
    });

    test("tienda_admin_articulo_textos_01_pasado_el_maximo_hay_error", () => {
        expect(errorLongitud("a".repeat(256), 255)).toBe("Máximo 255 caracteres");
    });

    test("tienda_admin_articulo_textos_01_contador_con_maximo", () => {
        expect(textoContador("hola", 255)).toBe("4/255");
    });

    test("tienda_admin_articulo_textos_01_contador_sin_maximo", () => {
        expect(textoContador("hola")).toBe("4");
    });
});

describe("[tienda_admin-website-01] elegirWebsite escoge el primero activo y respeta el actual", () => {
    test("tienda_admin_website_01_sin_actual_elige_el_primero_activo", () => {
        expect(elegirWebsite([web(1, false), web(2), web(3)], null)).toBe(2);
    });

    test("tienda_admin_website_01_conserva_el_actual_si_sigue_activo", () => {
        expect(elegirWebsite([web(1), web(2)], 2)).toBe(2);
    });

    test("tienda_admin_website_01_si_el_actual_no_existe_elige_el_primero_activo", () => {
        expect(elegirWebsite([web(1), web(2)], 9)).toBe(1);
    });

    test("tienda_admin_website_01_si_el_actual_esta_inactivo_elige_el_primero_activo", () => {
        expect(elegirWebsite([web(1), web(2, false)], 2)).toBe(1);
    });

    test("tienda_admin_website_01_sin_activos_devuelve_null", () => {
        expect(elegirWebsite([web(1, false)], null)).toBeNull();
        expect(elegirWebsite([], 1)).toBeNull();
    });
});

describe("[tienda_admin-categoria-crear-01] El 409 se asigna al campo que corresponde", () => {
    test("tienda_admin_categoria_crear_01_conflicto_de_slug", () => {
        const c = conflictoDeError({ estado: 409, descripcion: "El slug ya existe en el website" });
        expect(c).toEqual({ campo: "slug", mensaje: "El slug ya existe en el website" });
    });

    test("tienda_admin_categoria_crear_01_conflicto_de_codigo", () => {
        expect(conflictoDeError({ estado: 409, descripcion: "El código ya existe" })?.campo).toBe("codigo");
    });

    test("tienda_admin_categoria_crear_01_lee_el_detalle_de_un_cuerpo_json", () => {
        const c = conflictoDeError({ estado: 409, descripcion: JSON.stringify({ detail: "slug repetido" }) });
        expect(c).toEqual({ campo: "slug", mensaje: "slug repetido" });
    });

    test("tienda_admin_categoria_crear_01_conflicto_sin_campo_reconocible", () => {
        expect(conflictoDeError({ estado: 409, descripcion: "Conflicto" })?.campo).toBeNull();
    });

    test("tienda_admin_categoria_crear_01_otros_estados_no_son_conflicto", () => {
        expect(conflictoDeError({ estado: 400, descripcion: "slug" })).toBeNull();
        expect(conflictoDeError(new Error("x"))).toBeNull();
        expect(conflictoDeError(null)).toBeNull();
    });
});
