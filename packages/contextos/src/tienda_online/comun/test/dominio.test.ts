import { describe, expect, test } from "vitest";
import {
    claveCarrito,
    codigoStoreViewDesdeEnv,
    debeDescartarToken,
    formatearPrecio,
    esRutaCheckout,
    hayMas,
    limitarCantidad,
    rutaBusqueda,
    textoAriaCarrito,
    textoContador,
} from "#/tienda_online/comun/dominio.ts";

describe("[tienda-storeview-01] El código del storeview activo sale de VITE_STORE_VIEW", () => {
    test("tienda_storeview_01_devuelve_el_codigo_si_esta_definido", () => {
        expect(codigoStoreViewDesdeEnv("sanhigia_es")).toBe("sanhigia_es");
    });

    test("tienda_storeview_01_devuelve_null_si_es_undefined", () => {
        expect(codigoStoreViewDesdeEnv(undefined)).toBeNull();
    });

    test("tienda_storeview_01_devuelve_null_si_es_cadena_vacia", () => {
        expect(codigoStoreViewDesdeEnv("")).toBeNull();
    });
});

describe("[tienda-carrito_store-01] El token del carrito se guarda con una clave por storeview", () => {
    test("tienda_carrito_store_01_clave_incluye_el_storeview", () => {
        expect(claveCarrito("sanhigia_es")).toBe("tienda_online.carrito.sanhigia_es");
    });

    test("tienda_carrito_store_01_claves_distintas_por_storeview", () => {
        expect(claveCarrito("a")).not.toBe(claveCarrito("b"));
    });
});

describe("[tienda-carrito_store-04] El token se descarta si el carrito ya no es modificable", () => {
    test.each(["PAGADO", "CONVERTIDO", "ERROR_CONVERSION"] as const)(
        "tienda_carrito_store_04_descarta_%s",
        (estado) => {
            expect(debeDescartarToken(estado)).toBe(true);
        },
    );

    test.each(["ABIERTO", "PAGO_PENDIENTE"] as const)(
        "tienda_carrito_store_04_conserva_%s",
        (estado) => {
            expect(debeDescartarToken(estado)).toBe(false);
        },
    );
});

describe("[tienda-icono_carrito-02] El icono tiene aria-label «Carrito, N artículos»", () => {
    test("tienda_icono_carrito_02_texto_con_unidades", () => {
        expect(textoAriaCarrito(3)).toBe("Carrito, 3 artículos");
    });

    test("tienda_icono_carrito_02_texto_con_cero", () => {
        expect(textoAriaCarrito(0)).toBe("Carrito, 0 artículos");
    });
});

describe("[catalogo-tarjeta-02] El precio se formatea con la divisa del producto y el idioma del storeview", () => {
    test("catalogo_tarjeta_02_formatea_con_intl_en_es_eur", () => {
        const esperado = new Intl.NumberFormat("es", { style: "currency", currency: "EUR" }).format(12.1);
        expect(formatearPrecio(12.1, "EUR", "es")).toBe(esperado);
    });

    test("catalogo_tarjeta_02_respeta_idioma_y_divisa", () => {
        const esperado = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(1234.5);
        expect(formatearPrecio(1234.5, "USD", "en-US")).toBe(esperado);
    });

    test("catalogo_tarjeta_02_incluye_el_simbolo_de_la_divisa", () => {
        expect(formatearPrecio(12.1, "EUR", "es")).toContain("€");
    });
});

describe("[catalogo-paginacion-01] Mientras los productos cargados sean menos que total se muestra «Ver más», que añade los productos de la página siguiente", () => {
    test("catalogo_paginacion_01_hay_mas_si_cargados_menor_que_total", () => {
        expect(hayMas(24, 50)).toBe(true);
    });

    test("catalogo_paginacion_01_no_hay_mas_si_cargados_igual_a_total", () => {
        expect(hayMas(50, 50)).toBe(false);
    });

    test("catalogo_paginacion_01_no_hay_mas_con_catalogo_vacio", () => {
        expect(hayMas(0, 0)).toBe(false);
    });
});

describe("[tienda-primitivos-02] El contador muestra null si es 0 o menos, el número hasta 99 y «99+» por encima", () => {
    test("tienda_primitivos_02_null_con_cero", () => {
        expect(textoContador(0)).toBeNull();
    });

    test("tienda_primitivos_02_null_con_negativo", () => {
        expect(textoContador(-1)).toBeNull();
    });

    test("tienda_primitivos_02_numero_con_uno", () => {
        expect(textoContador(1)).toBe("1");
    });

    test("tienda_primitivos_02_numero_con_99", () => {
        expect(textoContador(99)).toBe("99");
    });

    test("tienda_primitivos_02_99_mas_con_100", () => {
        expect(textoContador(100)).toBe("99+");
    });
});

describe("[tienda-primitivos-07] La cantidad se acota a [minimo, maximo]; sin máximo solo se aplica el mínimo", () => {
    test("tienda_primitivos_07_dentro_del_rango_no_cambia", () => {
        expect(limitarCantidad(5, 1, 10)).toBe(5);
    });

    test("tienda_primitivos_07_por_debajo_del_minimo_devuelve_minimo", () => {
        expect(limitarCantidad(0, 1, 10)).toBe(1);
    });

    test("tienda_primitivos_07_por_encima_del_maximo_devuelve_maximo", () => {
        expect(limitarCantidad(11, 1, 10)).toBe(10);
    });

    test("tienda_primitivos_07_sin_maximo_conserva_valor_grande", () => {
        expect(limitarCantidad(1000, 1)).toBe(1000);
    });

    test("tienda_primitivos_07_sin_maximo_aplica_minimo", () => {
        expect(limitarCantidad(-3, 1)).toBe(1);
    });
});

describe("[tienda-layout-03] Es ruta de checkout /checkout y sus subrutas, no otras que solo compartan prefijo de texto", () => {
    test.each(["/checkout", "/checkout/ok", "/checkout/cancelado"])(
        "tienda_layout_03_es_checkout_%s",
        (ruta) => {
            expect(esRutaCheckout(ruta)).toBe(true);
        },
    );

    test.each(["/", "/carrito", "/checkouts"])(
        "tienda_layout_03_no_es_checkout_%s",
        (ruta) => {
            expect(esRutaCheckout(ruta)).toBe(false);
        },
    );
});

describe("[tienda-cabecera-04] La búsqueda navega a /catalogo, con texto recortado y codificado si no está vacío", () => {
    test("tienda_cabecera_04_vacio_va_al_catalogo", () => {
        expect(rutaBusqueda("")).toBe("/catalogo");
    });

    test("tienda_cabecera_04_solo_espacios_va_al_catalogo", () => {
        expect(rutaBusqueda("   ")).toBe("/catalogo");
    });

    test("tienda_cabecera_04_recorta_espacios_de_los_extremos", () => {
        expect(rutaBusqueda(" bolso ")).toBe("/catalogo?texto=bolso");
    });

    test("tienda_cabecera_04_codifica_espacios_internos", () => {
        expect(rutaBusqueda("bolso piel")).toBe("/catalogo?texto=bolso%20piel");
    });

    test("tienda_cabecera_04_codifica_caracteres_reservados", () => {
        expect(rutaBusqueda("a&b")).toBe("/catalogo?texto=a%26b");
    });
});
