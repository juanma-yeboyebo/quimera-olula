import { beforeEach, describe, expect, test, vi } from "vitest";

const getLista = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        getLista: (...args: unknown[]) => getLista(...args),
    },
}));

const { getWebsites, websiteDesdeApi } = await import("#/tienda_admin/comun/infraestructura.ts");

describe("[tienda_admin-website-01] getWebsites consulta /tienda_admin/website", () => {
    beforeEach(() => {
        getLista.mockReset();
    });

    test("tienda_admin_website_01_llama_a_la_ruta_de_websites", async () => {
        getLista.mockResolvedValue([]);
        await getWebsites();
        expect(getLista.mock.calls[0][0]).toBe("/tienda_admin/website");
        expect(getLista.mock.calls[0][1]).toBe(websiteDesdeApi);
    });

    test("tienda_admin_website_01_el_conversor_conserva_los_campos", () => {
        expect(websiteDesdeApi({ id: 1, codigo: "es", nombre: "España", activo: true })).toEqual({
            id: 1,
            codigo: "es",
            nombre: "España",
            activo: true,
        });
    });
});
