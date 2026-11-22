import { beforeEach, describe, expect, test, vi } from "vitest";

const getQuery = vi.fn();
const getItem = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        getQuery: (...a: unknown[]) => getQuery(...a),
        getItem: (...a: unknown[]) => getItem(...a),
        patch: (...a: unknown[]) => patch(...a),
        delete: (...a: unknown[]) => del(...a),
    },
}));

const infra = await import("#/tienda_admin/articulo/infraestructura.ts");

describe("[tienda_admin-articulo-maestro-01] Lectura del listado", () => {
    beforeEach(() => {
        getQuery.mockReset();
    });

    test("tienda_admin_articulo_maestro_01_el_listado_pide_la_ruta_con_los_filtros_en_el_criteria", async () => {
        getQuery.mockResolvedValue({ datos: [], total: 0 });
        await infra.getArticulos(
            { websiteId: 1, texto: "cam", estado: "publicado", categoriaId: "3" },
            { filtro: [], orden: [], paginacion: { limite: 10, pagina: 1 } },
        );
        expect(getQuery.mock.calls[0][0]).toBe("/tienda_admin/articulo");
        expect(getQuery.mock.calls[0][1].filtro).toEqual([
            ["website_id", "=", "1"],
            ["texto", "~", "cam"],
            ["estado", "=", "publicado"],
            ["categoria_id", "=", "3"],
        ]);
    });

    test("tienda_admin_articulo_maestro_01_el_conversor_usa_la_referencia_como_id", () => {
        expect(
            infra.articuloDesdeApi({
                referencia: "A1", descripcion: "X", imagen: null,
                publicado: true, visible: false, destacado: true,
            }),
        ).toEqual({
            id: "A1", referencia: "A1", descripcion: "X", imagen: null,
            publicado: true, visible: false, destacado: true,
            sinControlStock: false, stock: 0,
        });
    });
});

describe("[tienda_admin-articulo-detalle-01] Lectura del detalle", () => {
    beforeEach(() => {
        getItem.mockReset();
    });

    test("tienda_admin_articulo_detalle_01_pide_el_articulo_por_referencia_codificada", async () => {
        getItem.mockResolvedValue({});
        await infra.getArticulo("A/1");
        expect(getItem.mock.calls[0][0]).toBe("/tienda_admin/articulo/A%2F1");
    });

    test("tienda_admin_articulo_detalle_01_convierte_el_detalle", () => {
        const d = infra.articuloDetalleDesdeApi({
            referencia: "A1",
            descripcion: "Camiseta",
            precio: 12.5,
            textos: {
                "*": { nombre: "Camiseta web", descripcion_corta: null, descripcion_larga: "larga", meta_titulo: "t", meta_descripcion: null },
                en: { nombre: null, descripcion_corta: "short", descripcion_larga: null, meta_titulo: null, meta_descripcion: null },
            },
            idiomas: ["es", "en"],
            publicaciones: [
                { website_id: 1, publicado: true, visible: true, destacado: false, slug: "camiseta", orden: 0, fecha_publicacion: "2026-01-01" },
            ],
            imagenes: [{ id: 5, url: "/a.jpg", alt: null, orden: 1, principal: true }],
            categorias: [{ id: 3, nombre: "Ropa", ruta: ["Moda", "Ropa"] }],
        });
        expect(d).toMatchObject({ id: "A1", idiomas: ["es", "en"] });
        expect(d.textos).toEqual({
            "*": { nombre: "Camiseta web", descripcionCorta: "", descripcionLarga: "larga", metaTitulo: "t", metaDescripcion: "" },
            en: { nombre: "", descripcionCorta: "short", descripcionLarga: "", metaTitulo: "", metaDescripcion: "" },
        });
        expect(d.publicaciones[0]).toEqual({
            websiteId: 1, publicado: true, visible: true, destacado: false,
            slug: "camiseta", orden: 0, fechaPublicacion: "2026-01-01",
        });
        expect(d.imagenes[0]).toEqual({ id: 5, url: "/a.jpg", alt: "", orden: 1, principal: true });
        expect(d.categorias[0]).toEqual({ id: "3", nombre: "Ropa", ruta: "Moda › Ropa" });
        expect(d).toMatchObject({ sinControlStock: false, stocks: [] });
    });

    test("tienda_admin_articulo_publicacion_04_convierte_el_stock_por_website", () => {
        const d = infra.articuloDetalleDesdeApi({
            referencia: "A1", descripcion: "", precio: 0, textos: {}, idiomas: [],
            publicaciones: [], imagenes: [], categorias: [],
            sin_control_stock: true, stocks: [{ website_id: 2, stock: 7 }],
        });
        expect(d).toMatchObject({ sinControlStock: true, stocks: [{ websiteId: 2, stock: 7 }] });
    });

    test("tienda_admin_articulo_maestro_03_convierte_el_stock_del_item", () => {
        const a = infra.articuloDesdeApi({
            referencia: "A1", descripcion: "", imagen: null, publicado: true, visible: true, destacado: false,
            sin_control_stock: false, stock: 3,
        });
        expect(a).toMatchObject({ sinControlStock: false, stock: 3 });
    });

    test("tienda_admin_articulo_detalle_01_la_ruta_de_categoria_en_texto_se_respeta", () => {
        const d = infra.articuloDetalleDesdeApi({
            referencia: "A1", descripcion: "", precio: 0,
            textos: {}, idiomas: [],
            publicaciones: [], imagenes: [],
            categorias: [{ id: "7", nombre: "X", ruta: "A > X" }],
        });
        expect(d.categorias[0].ruta).toBe("A > X");
    });
});

describe("[tienda_admin-articulo-publicacion-01] Cuerpos y rutas de publicación", () => {
    beforeEach(() => {
        patch.mockReset();
        del.mockReset();
    });

    test("tienda_admin_articulo_publicacion_01_el_cuerpo_lleva_los_cinco_campos", () => {
        expect(
            infra.publicacionAApi({ publicado: true, visible: false, destacado: true, slug: "x", orden: 4 }),
        ).toEqual({ publicado: true, visible: false, destacado: true, slug: "x", orden: 4 });
    });

    test("tienda_admin_articulo_publicacion_01_el_orden_en_texto_se_envia_como_numero", () => {
        const cuerpo = infra.publicacionAApi({
            publicado: true, visible: true, destacado: false, slug: "", orden: "7" as unknown as number,
        });
        expect(cuerpo.orden).toBe(7);
        expect(infra.publicacionAApi({
            publicado: true, visible: true, destacado: false, slug: "", orden: "" as unknown as number,
        }).orden).toBe(0);
    });

    test("tienda_admin_articulo_publicacion_01_patch_a_la_ruta_de_publicacion_del_website", async () => {
        await infra.patchPublicacion("A1", 2, {
            publicado: true, visible: true, destacado: false, slug: "x", orden: 0,
        });
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/articulo/A1/publicacion/2");
    });

    test("tienda_admin_articulo_publicacion_01_delete_a_la_ruta_de_publicacion_del_website", async () => {
        await infra.deletePublicacion("A1", 2);
        expect(del.mock.calls[0][0]).toBe("/tienda_admin/articulo/A1/publicacion/2");
    });

    test("tienda_admin_articulo_publicacion_02_un_409_se_propaga_para_mostrarlo_en_el_slug", async () => {
        patch.mockRejectedValue({ estado: 409, descripcion: "slug repetido" });
        await expect(
            infra.patchPublicacion("A1", 2, { publicado: true, visible: true, destacado: false, slug: "x", orden: 0 }),
        ).rejects.toMatchObject({ estado: 409 });
    });
});

describe("[tienda_admin-articulo-textos-01] Cuerpo de textos", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("tienda_admin_articulo_textos_01_el_cuerpo_va_en_snake_case_con_idioma", () => {
        expect(
            infra.textosAApi("en", { nombre: "n", descripcionCorta: "a", descripcionLarga: "b", metaTitulo: "c", metaDescripcion: "d" }),
        ).toEqual({ idioma: "en", nombre: "n", descripcion_corta: "a", descripcion_larga: "b", meta_titulo: "c", meta_descripcion: "d" });
    });

    test("tienda_admin_articulo_textos_01_patch_a_la_ruta_de_textos_con_el_idioma", async () => {
        await infra.patchTextos("A1", "*", { nombre: "", descripcionCorta: "", descripcionLarga: "", metaTitulo: "", metaDescripcion: "" });
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/articulo/A1/textos");
        expect(patch.mock.calls[0][1]).toMatchObject({ idioma: "*" });
    });
});

describe("[tienda_admin-articulo-categorias-01] Cuerpo de categorías", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("tienda_admin_articulo_categorias_01_el_cuerpo_envia_ids_numericos_en_orden", () => {
        expect(infra.categoriasAApi(["3", "1", "2"])).toEqual({ categorias: [3, 1, 2] });
    });

    test("tienda_admin_articulo_categorias_01_patch_a_la_ruta_de_categorias", async () => {
        await infra.patchCategoriasArticulo("A1", ["1"]);
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/articulo/A1/categorias");
        expect(patch.mock.calls[0][1]).toEqual({ categorias: [1] });
    });
});

describe("[tienda_admin-articulo-fotos-04] Rutas de ordenar y principal", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("tienda_admin_articulo_fotos_04_ordenar_envia_los_ids", async () => {
        await infra.patchOrdenImagenes("A 1", [3, 1, 2]);
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/articulo/A%201/imagen/ordenar");
        expect(patch.mock.calls[0][1]).toEqual({ ids: [3, 1, 2] });
    });

    test("tienda_admin_articulo_fotos_05_principal_usa_la_ruta_de_la_foto", async () => {
        await infra.patchImagenPrincipal("A1", 7);
        expect(patch.mock.calls[0][0]).toBe("/tienda_admin/articulo/A1/imagen/7/principal");
    });
});
