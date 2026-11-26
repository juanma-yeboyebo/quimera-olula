import { beforeEach, describe, expect, test, vi } from "vitest";

const getItem = vi.fn();
const patch = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        getItem: (...a: unknown[]) => getItem(...a),
        patch: (...a: unknown[]) => patch(...a),
    },
}));

const { cambiosDeEdicion, edicionDeWebsite, seccionesProximamente, TEXTO_CONFIGURACION_PROXIMAMENTE } =
    await import("#/tienda_admin/configuracion/dominio.ts");
const infra = await import("#/tienda_admin/configuracion/infraestructura.ts");

const api = {
    id: 1, codigo: "dulce_bebe", nombre: "Dulce Bebé",
    tpv_punto_venta_id: "PV1", tpv_agente_id: null, usuario_notificaciones_id: "ana",
};

describe("[tienda_admin-configuracion-01] Configuración del website activo", () => {
    beforeEach(() => {
        getItem.mockReset();
    });

    test("tienda_admin_configuracion_01_pide_el_website_activo", async () => {
        getItem.mockResolvedValue({});
        await infra.getWebsiteConfiguracion(1);
        expect(getItem.mock.calls[0][0]).toBe("/tienda_admin/website/1");
    });

    test("tienda_admin_configuracion_01_convierte_el_website", () => {
        expect(infra.websiteConfiguracionDesdeApi(api)).toEqual({
            id: 1, codigo: "dulce_bebe", nombre: "Dulce Bebé",
            tpvPuntoVentaId: "PV1", tpvAgenteId: null, usuarioNotificacionesId: "ana",
        });
    });

    test("tienda_admin_configuracion_01_las_secciones_pendientes_siguen_proximamente", () => {
        expect(seccionesProximamente.map((s) => s.titulo)).toEqual(["Envío gratis", "Aviso superior", "Menú"]);
        expect(TEXTO_CONFIGURACION_PROXIMAMENTE).toBe("Disponible próximamente");
    });
});

describe("[tienda_admin-configuracion-02] Guardar la configuración", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("tienda_admin_configuracion_02_envia_los_tres_campos_y_vacio_como_null", async () => {
        const website = infra.websiteConfiguracionDesdeApi(api);
        const edicion = { ...edicionDeWebsite(website), tpvAgenteId: "AG1", usuarioNotificacionesId: "" };

        await infra.patchWebsiteConfiguracion(1, cambiosDeEdicion(edicion));

        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/website/1");
        expect(patch.mock.calls[0][1]).toEqual({
            tpv_punto_venta_id: "PV1", tpv_agente_id: "AG1", usuario_notificaciones_id: null,
        });
    });

    test("tienda_admin_configuracion_02_sin_cambios_la_edicion_es_igual_a_la_inicial", () => {
        const website = infra.websiteConfiguracionDesdeApi(api);
        expect(cambiosDeEdicion(edicionDeWebsite(website))).toEqual({
            tpvPuntoVentaId: "PV1", tpvAgenteId: null, usuarioNotificacionesId: "ana",
        });
    });
});
