import { beforeEach, describe, expect, test, vi } from "vitest";
import { ArticuloWebDetalle } from "#/tienda_admin/articulo/diseño.ts";
import type { ContextoDetalleArticulo } from "#/tienda_admin/articulo/detalle/diseño.ts";

const getArticulo = vi.fn();
const getArbolCategorias = vi.fn();

vi.mock("#/tienda_admin/articulo/infraestructura.ts", () => ({
    getArticulo: (...a: unknown[]) => getArticulo(...a),
}));
vi.mock("#/tienda_admin/categoria/infraestructura.ts", () => ({
    getArbolCategorias: (...a: unknown[]) => getArbolCategorias(...a),
}));

const d = await import("#/tienda_admin/articulo/detalle/detalle.ts");

const articulo = (extra: Partial<ArticuloWebDetalle> = {}): ArticuloWebDetalle => ({
    ...d.articuloVacio,
    id: "A1",
    referencia: "A1",
    descripcion: "Camiseta",
    publicaciones: [
        { websiteId: 1, publicado: true, visible: true, destacado: false, slug: "camiseta", orden: 0, fechaPublicacion: null },
    ],
    ...extra,
});

const abierto = (extra: Partial<ContextoDetalleArticulo> = {}): ContextoDetalleArticulo => ({
    ...d.contextoDetalleArticuloInicial,
    estado: "ABIERTO",
    articulo: articulo(),
    websiteId: 1,
    ...extra,
});

describe("[tienda_admin-articulo-detalle-01] El detalle carga el artículo y el árbol del website", () => {
    beforeEach(() => {
        getArticulo.mockReset();
        getArbolCategorias.mockReset();
    });

    test("tienda_admin_articulo_detalle_01_cargar_pide_articulo_y_arbol_y_abre", async () => {
        getArticulo.mockResolvedValue(articulo());
        getArbolCategorias.mockResolvedValue([]);
        const r = (await d.cargarContexto(d.contextoDetalleArticuloInicial, { id: "A1", websiteId: 1 })) as ContextoDetalleArticulo;
        expect(getArticulo).toHaveBeenCalledWith("A1");
        expect(getArbolCategorias).toHaveBeenCalledWith(1);
        expect(r).toMatchObject({ estado: "ABIERTO", websiteId: 1 });
        expect(r.articulo.id).toBe("A1");
    });

    test("tienda_admin_articulo_detalle_01_sin_website_no_pide_el_arbol", async () => {
        getArticulo.mockResolvedValue(articulo());
        const r = (await d.cargarContexto(d.contextoDetalleArticuloInicial, { id: "A1", websiteId: null })) as ContextoDetalleArticulo;
        expect(getArbolCategorias).not.toHaveBeenCalled();
        expect(r.arbol).toEqual([]);
    });

    test("tienda_admin_articulo_detalle_01_sin_id_vacia_el_detalle_y_no_llama_al_servidor", async () => {
        const r = (await d.cargarContexto(abierto(), { websiteId: 1 })) as ContextoDetalleArticulo;
        expect(getArticulo).not.toHaveBeenCalled();
        expect(r).toMatchObject({ estado: "INICIAL", articulo: d.articuloVacio, websiteId: 1 });
    });

    test("tienda_admin_articulo_detalle_01_si_el_servidor_falla_el_error_se_propaga", async () => {
        getArticulo.mockRejectedValue({ estado: 404 });
        await expect(
            d.cargarContexto(d.contextoDetalleArticuloInicial, { id: "X", websiteId: 1 }),
        ).rejects.toMatchObject({ estado: 404 });
    });
});

describe("[tienda_admin-articulo-publicacion-01] Refrescar propaga el cambio al maestro", () => {
    beforeEach(() => {
        getArticulo.mockReset();
    });

    test("tienda_admin_articulo_publicacion_01_refrescar_recarga_y_emite_articulo_cambiado_con_el_resumen", async () => {
        getArticulo.mockResolvedValue(
            articulo({
                publicaciones: [
                    { websiteId: 1, publicado: true, visible: false, destacado: true, slug: "c", orden: 0, fechaPublicacion: null },
                ],
            }),
        );
        const [contexto, eventos] = (await d.refrescarArticulo(abierto())) as [ContextoDetalleArticulo, [string, unknown][]];
        expect(getArticulo).toHaveBeenCalledWith("A1");
        expect(contexto.articulo.publicaciones[0].visible).toBe(false);
        expect(eventos).toEqual([
            [
                "articulo_cambiado",
                {
                    id: "A1", referencia: "A1", descripcion: "Camiseta", imagen: null,
                    publicado: true, visible: false, destacado: true,
                },
            ],
        ]);
    });

    test("tienda_admin_articulo_publicacion_01_tras_quitar_la_publicacion_el_resumen_es_no_publicado", async () => {
        getArticulo.mockResolvedValue(articulo({ publicaciones: [] }));
        const [, eventos] = (await d.refrescarArticulo(abierto({ estado: "QUITANDO" }))) as [ContextoDetalleArticulo, [string, { publicado: boolean }][]];
        expect(eventos[0][1].publicado).toBe(false);
    });

    test("tienda_admin_articulo_detalle_01_vaciar_deja_el_detalle_sin_articulo", async () => {
        const r = await d.vaciarContexto(abierto());
        expect(r).toMatchObject({ estado: "INICIAL", articulo: d.articuloVacio, arbol: [] });
    });
});
