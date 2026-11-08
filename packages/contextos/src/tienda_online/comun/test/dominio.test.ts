import { describe, expect, test } from "vitest";
import type { CategoriaTienda } from "#/tienda_online/catalogo/diseño.ts";
import {
    cantidadValida,
    categoriasEnMenu,
    claveCarrito,
    contenidoMega,
    codigoStoreViewDesdeEnv,
    debeDescartarToken,
    formatearPrecio,
    esRutaCheckout,
    hayMas,
    limitarCantidad,
    nodoDeRuta,
    repartirMenu,
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

const cat = (slug: string, hijas: CategoriaTienda[] = []): CategoriaTienda => ({
    id: slug.length,
    nombre: slug.toUpperCase(),
    slug,
    enMenu: true,
    hijas,
});

const nCats = (n: number): CategoriaTienda[] =>
    Array.from({ length: n }, (_, i) => cat(`c${i + 1}`));

describe("[tienda-menu-02] repartirMenu devuelve conTodas y enBarra según el máximo de la barra", () => {
    test("tienda_menu_02_con_menos_del_maximo_van_todas_a_la_barra", () => {
        const cats = nCats(3);
        expect(repartirMenu(cats, 8, 6)).toEqual({ conTodas: false, enBarra: cats });
    });

    test("tienda_menu_02_con_exactamente_8_van_todas_a_la_barra", () => {
        const cats = nCats(8);
        expect(repartirMenu(cats, 8, 6)).toEqual({ conTodas: false, enBarra: cats });
    });

    test("tienda_menu_02_con_9_conTodas_y_las_6_primeras_en_la_barra", () => {
        const cats = nCats(9);
        expect(repartirMenu(cats, 8, 6)).toEqual({ conTodas: true, enBarra: cats.slice(0, 6) });
    });

    test("tienda_menu_02_sin_categorias_no_hay_conTodas", () => {
        expect(repartirMenu([], 8, 6)).toEqual({ conTodas: false, enBarra: [] });
    });

    test("tienda_menu_02_respeta_los_parametros", () => {
        const cats = nCats(5);
        expect(repartirMenu(cats, 4, 2)).toEqual({ conTodas: true, enBarra: cats.slice(0, 2) });
    });
});

describe("[tienda-menu-03] contenidoMega separa columnas y sueltas y limita a 6 nietas por columna", () => {
    test("tienda_menu_03_hijas_con_hijas_son_columnas_y_el_resto_sueltas", () => {
        const nieta = cat("n1");
        const conHijas = cat("h1", [nieta]);
        const suelta = cat("h2");
        const resultado = contenidoMega(cat("raiz", [conHijas, suelta]));
        expect(resultado.columnas).toEqual([{ categoria: conHijas, nietas: [nieta], verMas: false }]);
        expect(resultado.sueltas).toEqual([suelta]);
    });

    test("tienda_menu_03_columna_con_6_nietas_no_tiene_ver_mas", () => {
        const nietas = nCats(6);
        const resultado = contenidoMega(cat("raiz", [cat("h1", nietas)]));
        expect(resultado.columnas[0].nietas).toEqual(nietas);
        expect(resultado.columnas[0].verMas).toBe(false);
    });

    test("tienda_menu_03_columna_con_7_nietas_recorta_a_6_y_tiene_ver_mas", () => {
        const nietas = nCats(7);
        const resultado = contenidoMega(cat("raiz", [cat("h1", nietas)]));
        expect(resultado.columnas[0].nietas).toEqual(nietas.slice(0, 6));
        expect(resultado.columnas[0].verMas).toBe(true);
    });

    test("tienda_menu_03_las_nietas_no_llevan_cuarto_nivel", () => {
        const nieta = cat("n1", [cat("bisnieta")]);
        const resultado = contenidoMega(cat("raiz", [cat("h1", [nieta])]));
        expect(resultado.columnas[0].nietas).toHaveLength(1);
        expect(resultado.columnas[0].nietas[0].slug).toBe("n1");
        expect(resultado.sueltas).toEqual([]);
    });

    test("tienda_menu_03_sin_hijas_devuelve_todo_vacio", () => {
        expect(contenidoMega(cat("raiz"))).toEqual({ columnas: [], sueltas: [] });
    });

    test("tienda_menu_03_solo_sueltas_no_genera_columnas", () => {
        const hijas = nCats(3);
        expect(contenidoMega(cat("raiz", hijas))).toEqual({ columnas: [], sueltas: hijas });
    });
});

describe("[tienda-menu-06] nodoDeRuta devuelve la categoría a la que lleva la ruta de slugs, o null", () => {
    const profunda = cat("c", []);
    const arbol = [
        cat("a", [cat("a1", [profunda]), cat("a2")]),
        cat("b"),
    ];

    test("tienda_menu_06_ruta_de_un_nivel", () => {
        expect(nodoDeRuta(arbol, ["b"])).toBe(arbol[1]);
    });

    test("tienda_menu_06_ruta_de_dos_niveles", () => {
        expect(nodoDeRuta(arbol, ["a", "a2"])).toBe(arbol[0].hijas[1]);
    });

    test("tienda_menu_06_ruta_de_tres_niveles", () => {
        expect(nodoDeRuta(arbol, ["a", "a1", "c"])).toBe(profunda);
    });

    test("tienda_menu_06_ruta_vacia_devuelve_null", () => {
        expect(nodoDeRuta(arbol, [])).toBeNull();
    });

    test("tienda_menu_06_slug_inexistente_en_primer_nivel_devuelve_null", () => {
        expect(nodoDeRuta(arbol, ["zzz"])).toBeNull();
    });

    test("tienda_menu_06_slug_inexistente_en_nivel_inferior_devuelve_null", () => {
        expect(nodoDeRuta(arbol, ["a", "zzz"])).toBeNull();
    });

    test("tienda_menu_06_slug_de_otra_rama_devuelve_null", () => {
        expect(nodoDeRuta(arbol, ["b", "a1"])).toBeNull();
    });
});

describe("[tienda-primitivos-07] cantidadValida acepta solo números mayores que 0", () => {
    test.each([1, 2, 10, 0.5, "3", "1.5", " 4 "])("tienda_primitivos_07_%s_es_valida", (v) => {
        expect(cantidadValida(v)).toBe(true);
    });

    test.each([0, -1, -0.5, "0", "-2"])("tienda_primitivos_07_%s_no_es_valida", (v) => {
        expect(cantidadValida(v)).toBe(false);
    });

    test.each([NaN, Infinity, -Infinity, "", "   ", "abc", "1a", null, undefined, {}, [], true])(
        "tienda_primitivos_07_no_numerico_%s_no_es_valida",
        (v) => {
            expect(cantidadValida(v)).toBe(false);
        },
    );
});

describe("[tienda-menu-10] categoriasEnMenu descarta las categorías fuera del menú", () => {
    const fuera = (slug: string, hijas: CategoriaTienda[] = []): CategoriaTienda => ({
        ...cat(slug, hijas),
        enMenu: false,
    });

    test("tienda_menu_10_quita_las_de_primer_nivel_sin_en_menu", () => {
        const res = categoriasEnMenu([cat("a"), fuera("b"), cat("c")]);
        expect(res.map((c) => c.slug)).toEqual(["a", "c"]);
    });

    test("tienda_menu_10_quita_las_hijas_sin_en_menu_dentro_de_su_madre", () => {
        const res = categoriasEnMenu([cat("a", [cat("a1"), fuera("a2"), cat("a3", [fuera("a31")])])]);
        expect(res[0].hijas.map((c) => c.slug)).toEqual(["a1", "a3"]);
        expect(res[0].hijas[1].hijas).toEqual([]);
    });

    test("tienda_menu_10_una_madre_fuera_se_lleva_a_sus_hijas", () => {
        expect(categoriasEnMenu([fuera("a", [cat("a1")])])).toEqual([]);
    });

    test("tienda_menu_10_no_modifica_el_arbol_original", () => {
        const arbol = [cat("a", [fuera("a1")])];
        categoriasEnMenu(arbol);
        expect(arbol[0].hijas).toHaveLength(1);
    });
});
