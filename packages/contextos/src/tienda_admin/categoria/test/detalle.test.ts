import { beforeEach, describe, expect, test, vi } from "vitest";
import { NodoCategoria } from "#/tienda_admin/categoria/diseño.ts";

const patchCategoria = vi.fn();

vi.mock("#/tienda_admin/categoria/infraestructura.ts", () => ({
    patchCategoria: (...a: unknown[]) => patchCategoria(...a),
}));

const d = await import("#/tienda_admin/categoria/detalle/detalle.ts");

const nodo: NodoCategoria = {
    id: "4", padreId: null, codigo: "C4", nombre: "Higiene", slug: "higiene", orden: 1,
    visible: true, enMenu: true, articulos: 2, hijas: [],
};

const abierto = { estado: "ABIERTO" as const, categoria: nodo };
const edicion = { id: "4", nombre: "Higiene", slug: "higiene", visible: true, enMenu: true };

describe("[tienda_admin-categoria-detalle-01] El detalle edita la categoría seleccionada", () => {
    beforeEach(() => {
        patchCategoria.mockReset();
    });

    test("tienda_admin_categoria_detalle_01_cargar_abre_el_detalle", async () => {
        const r = await d.cargarCategoria(d.contextoDetalleCategoriaInicial, nodo);
        expect(r).toMatchObject({ estado: "ABIERTO", categoria: nodo });
    });

    test("tienda_admin_categoria_detalle_01_sin_categoria_vuelve_al_estado_inicial", async () => {
        const r = await d.cargarCategoria(abierto, null);
        expect(r).toMatchObject({ estado: "INICIAL", categoria: d.categoriaVacia });
    });

    test("tienda_admin_categoria_detalle_01_guardar_sin_cambios_no_llama_al_servidor", async () => {
        const guardado = await d.guardarCategoria(abierto, edicion);
        expect(guardado).toBe(false);
        expect(patchCategoria).not.toHaveBeenCalled();
    });

    test("tienda_admin_categoria_detalle_01_guardar_con_cambios_llama_a_patch", async () => {
        const guardado = await d.guardarCategoria(abierto, { ...edicion, nombre: "Aseo", enMenu: false });
        expect(guardado).toBe(true);
        expect(patchCategoria).toHaveBeenCalledWith("4", {
            nombre: "Aseo",
            slug: "higiene",
            visible: true,
            enMenu: false,
        });
    });

    test("tienda_admin_categoria_borrar_01_vaciar_deja_el_detalle_sin_categoria", async () => {
        const r = await d.vaciarCategoria({ ...abierto, estado: "BORRANDO" });
        expect(r).toMatchObject({ estado: "INICIAL", categoria: d.categoriaVacia });
    });

    test("tienda_admin_categoria_detalle_01_si_el_servidor_falla_guardar_propaga_el_error", async () => {
        patchCategoria.mockRejectedValue({ estado: 409, descripcion: "slug repetido" });
        await expect(d.guardarCategoria(abierto, { ...edicion, slug: "otro" })).rejects.toMatchObject({
            estado: 409,
        });
    });
});
