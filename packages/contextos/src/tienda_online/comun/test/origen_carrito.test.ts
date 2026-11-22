import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { claveOrigenCarrito } from "#/tienda_online/comun/dominio.ts";
import { origenCarrito, recordarOrigenCarrito } from "#/tienda_online/comun/origen_carrito.ts";
import { fijarStoreViewActivo } from "#/tienda_online/comun/storeview.ts";

describe("[tienda-seguir_comprando-02] Origen del carrito", () => {
    beforeEach(() => {
        localStorage.clear();
        fijarStoreViewActivo("es");
    });

    afterEach(() => fijarStoreViewActivo(null));

    test("tienda_seguir_comprando_02_la_clave_va_por_storeview", () => {
        expect(claveOrigenCarrito("es")).toBe("tienda_online.origen_carrito.es");
    });

    test("tienda_seguir_comprando_02_devuelve_el_origen_del_mismo_carrito", () => {
        recordarOrigenCarrito("car-1", { ruta: "/lista/tk", texto: "Volver a la lista" });
        expect(origenCarrito("car-1")).toEqual({ ruta: "/lista/tk", texto: "Volver a la lista" });
    });

    test("tienda_seguir_comprando_02_otro_carrito_o_sin_token_no_tiene_origen", () => {
        recordarOrigenCarrito("car-1", { ruta: "/lista/tk", texto: "Volver a la lista" });
        expect(origenCarrito("car-2")).toBeNull();
        expect(origenCarrito(null)).toBeNull();
    });

    test("tienda_seguir_comprando_02_sin_storeview_no_guarda_nada", () => {
        fijarStoreViewActivo(null);
        recordarOrigenCarrito("car-1", { ruta: "/lista/tk", texto: "Volver a la lista" });
        fijarStoreViewActivo("es");
        expect(origenCarrito("car-1")).toBeNull();
    });
});
