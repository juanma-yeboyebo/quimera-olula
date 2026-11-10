import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("#/tienda_online/comun/infraestructura.ts", () => ({
    getStoreView: vi.fn(),
}));

const { getStoreView } = await import("#/tienda_online/comun/infraestructura.ts");
const { cargarStoreView, reiniciarStoreViews } = await import("#/tienda_online/comun/usar_storeview.ts");

const storeView = {
    codigo: "es",
    nombre: "España",
    idioma: "es-ES",
    urlBase: "https://tienda.test",
    website: { id: 1, codigo: "web", nombre: "Tienda", divisa: "EUR" },
    formasPago: [],
    formasEnvio: [],
};

const mockGet = vi.mocked(getStoreView);

describe("[tienda-storeview-05] El storeview se pide una sola vez por código", () => {
    beforeEach(() => {
        reiniciarStoreViews();
        mockGet.mockReset();
    });

    test("tienda_storeview_05_peticiones_simultaneas_comparten_la_llamada", async () => {
        mockGet.mockResolvedValue(storeView);
        const [a, b] = await Promise.all([cargarStoreView("es"), cargarStoreView("es")]);
        expect(a).toEqual(storeView);
        expect(b).toEqual(storeView);
        expect(mockGet).toHaveBeenCalledTimes(1);
    });

    test("tienda_storeview_05_una_vez_cargado_no_vuelve_a_pedirlo", async () => {
        mockGet.mockResolvedValue(storeView);
        await cargarStoreView("es");
        await cargarStoreView("es");
        expect(mockGet).toHaveBeenCalledTimes(1);
    });

    test("tienda_storeview_05_si_falla_la_siguiente_vuelve_a_intentarlo", async () => {
        mockGet.mockRejectedValueOnce({ estado: 404 });
        mockGet.mockResolvedValueOnce(storeView);
        await expect(cargarStoreView("es")).rejects.toEqual({ estado: 404 });
        await expect(cargarStoreView("es")).resolves.toEqual(storeView);
        expect(mockGet).toHaveBeenCalledTimes(2);
    });

    test("tienda_storeview_05_codigos_distintos_se_piden_por_separado", async () => {
        mockGet.mockResolvedValue(storeView);
        await cargarStoreView("es");
        await cargarStoreView("en");
        expect(mockGet).toHaveBeenCalledTimes(2);
    });
});
