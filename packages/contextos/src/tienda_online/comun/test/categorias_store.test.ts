import { beforeEach, describe, expect, test, vi } from "vitest";

const getCategorias = vi.fn();

vi.mock("#/tienda_online/catalogo/infraestructura.ts", () => ({
    getCategorias: () => getCategorias(),
}));

const arbol = [
    { id: 1, nombre: "Ropa", slug: "ropa", enMenu: true, hijas: [] },
    { id: 2, nombre: "Calzado", slug: "calzado", enMenu: true, hijas: [] },
];

const cargarAlmacen = async () => await import("#/tienda_online/comun/categorias_store.ts");

beforeEach(async () => {
    getCategorias.mockReset();
    const store = await cargarAlmacen();
    store.reiniciarCategorias();
});

describe("[tienda-menu-01] El árbol de categorías se pide una sola vez y, si falla, es una lista vacía", () => {
    test("tienda_menu_01_devuelve_el_arbol_del_servidor", async () => {
        getCategorias.mockResolvedValue(arbol);
        const store = await cargarAlmacen();

        expect(await store.cargarCategorias()).toEqual(arbol);
    });

    test("tienda_menu_01_dos_llamadas_hacen_una_sola_peticion", async () => {
        getCategorias.mockResolvedValue(arbol);
        const store = await cargarAlmacen();

        const [a, b] = await Promise.all([store.cargarCategorias(), store.cargarCategorias()]);

        expect(a).toEqual(arbol);
        expect(b).toEqual(arbol);
        expect(getCategorias).toHaveBeenCalledTimes(1);
    });

    test("tienda_menu_01_una_llamada_posterior_reutiliza_la_cache", async () => {
        getCategorias.mockResolvedValue(arbol);
        const store = await cargarAlmacen();

        await store.cargarCategorias();
        await store.cargarCategorias();

        expect(getCategorias).toHaveBeenCalledTimes(1);
    });

    test("tienda_menu_01_si_falla_devuelve_lista_vacia", async () => {
        getCategorias.mockRejectedValue(new Error("fallo"));
        const store = await cargarAlmacen();

        expect(await store.cargarCategorias()).toEqual([]);
    });

    test("tienda_menu_01_reiniciar_permite_volver_a_pedir", async () => {
        getCategorias.mockResolvedValue(arbol);
        const store = await cargarAlmacen();
        await store.cargarCategorias();

        store.reiniciarCategorias();
        await store.cargarCategorias();

        expect(getCategorias).toHaveBeenCalledTimes(2);
    });
});
