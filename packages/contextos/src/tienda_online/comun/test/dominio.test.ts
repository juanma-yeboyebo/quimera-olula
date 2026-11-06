import { describe, expect, test } from "vitest";
import {
    claveCarrito,
    codigoStoreViewDesdeEnv,
    debeDescartarToken,
    textoAriaCarrito,
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
