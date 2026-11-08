import { beforeEach, describe, expect, test, vi } from "vitest";
import {
    fijarWebsiteActivo,
    fijarWebsites,
    nombreDeWebsite,
    obtenerNombreWebsiteActivo,
    obtenerWebsiteActivo,
    reiniciarWebsiteActivo,
    suscribirWebsiteActivo,
} from "#/tienda_admin/comun/website_store.ts";

describe("[tienda_admin-website-01] El website elegido se recuerda entre pantallas", () => {
    beforeEach(() => {
        reiniciarWebsiteActivo();
    });

    test("tienda_admin_website_01_empieza_sin_website", () => {
        expect(obtenerWebsiteActivo()).toBeNull();
    });

    test("tienda_admin_website_01_recuerda_el_elegido", () => {
        fijarWebsiteActivo(3);
        expect(obtenerWebsiteActivo()).toBe(3);
    });

    test("tienda_admin_website_01_avisa_a_los_suscriptores_al_cambiar", () => {
        const cb = vi.fn();
        suscribirWebsiteActivo(cb);
        fijarWebsiteActivo(2);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    test("tienda_admin_website_01_no_avisa_si_no_cambia", () => {
        fijarWebsiteActivo(2);
        const cb = vi.fn();
        suscribirWebsiteActivo(cb);
        fijarWebsiteActivo(2);
        expect(cb).not.toHaveBeenCalled();
    });

    test("tienda_admin_website_01_dejar_de_suscribirse_corta_los_avisos", () => {
        const cb = vi.fn();
        const baja = suscribirWebsiteActivo(cb);
        baja();
        fijarWebsiteActivo(5);
        expect(cb).not.toHaveBeenCalled();
    });

    test("tienda_admin_website_01_el_nombre_del_activo_sale_de_la_lista_de_websites", () => {
        fijarWebsites([
            { id: 1, codigo: "es", nombre: "España", activo: true },
            { id: 2, codigo: "pt", nombre: "Portugal", activo: true },
        ]);
        fijarWebsiteActivo(2);
        expect(obtenerNombreWebsiteActivo()).toBe("Portugal");
    });

    test("tienda_admin_website_01_sin_activo_no_hay_nombre", () => {
        expect(obtenerNombreWebsiteActivo()).toBeNull();
        expect(nombreDeWebsite([], 3)).toBeNull();
    });
});
