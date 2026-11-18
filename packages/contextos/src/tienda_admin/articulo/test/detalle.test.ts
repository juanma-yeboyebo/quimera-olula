import { beforeEach, describe, expect, test, vi } from "vitest";
import { ArticuloWebDetalle } from "#/tienda_admin/articulo/diseño.ts";
import type { ContextoDetalleArticulo } from "#/tienda_admin/articulo/detalle/diseño.ts";

const getArticulo = vi.fn();
const getArbolCategorias = vi.fn();
const postImagenArticulo = vi.fn();
const patchOrdenImagenes = vi.fn();
const patchImagenPrincipal = vi.fn();

vi.mock("#/tienda_admin/articulo/infraestructura.ts", () => ({
    getArticulo: (...a: unknown[]) => getArticulo(...a),
    postImagenArticulo: (...a: unknown[]) => postImagenArticulo(...a),
    patchOrdenImagenes: (...a: unknown[]) => patchOrdenImagenes(...a),
    patchImagenPrincipal: (...a: unknown[]) => patchImagenPrincipal(...a),
}));
vi.mock("#/tienda_admin/categoria/infraestructura.ts", () => ({
    getArbolCategorias: (...a: unknown[]) => getArbolCategorias(...a),
}));

const d = await import("#/tienda_admin/articulo/detalle/detalle.ts");
const { getMaquina } = await import("#/tienda_admin/articulo/detalle/maquina.ts");

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

describe("[tienda_admin-articulo-publicacion-03] Modal de publicación de un website", () => {
    test("tienda_admin_articulo_publicacion_03_publicar_o_editar_abre_el_modal_del_website", async () => {
        expect(getMaquina().ABIERTO.publicacion_solicitada).toEqual([d.activarPublicacion]);
        const r = (await d.activarPublicacion(abierto(), 2)) as ContextoDetalleArticulo;
        expect(r).toMatchObject({ estado: "PUBLICANDO", websitePublicacion: 2 });
    });

    test("tienda_admin_articulo_publicacion_03_aceptar_cierra_y_refresca_detalle_y_maestro", async () => {
        const maquina = getMaquina();
        expect(maquina.PUBLICANDO.publicacion_guardada).toEqual([d.desactivarPublicacion, d.refrescarArticulo]);
        expect(maquina.PUBLICANDO.publicacion_cancelada).toEqual([d.desactivarPublicacion]);
        const r = (await d.desactivarPublicacion(abierto({ estado: "PUBLICANDO", websitePublicacion: 2 }))) as ContextoDetalleArticulo;
        expect(r).toMatchObject({ estado: "ABIERTO", websitePublicacion: null });
    });

    test("tienda_admin_articulo_publicacion_03_quitar_pide_confirmacion_y_al_cancelar_vuelve_al_modal", () => {
        const maquina = getMaquina();
        expect(maquina.PUBLICANDO.quitar_publicacion_solicitada).toBe("QUITANDO");
        expect(maquina.QUITANDO.quitar_cancelado).toBe("PUBLICANDO");
        expect(maquina.QUITANDO.publicacion_quitada).toEqual([d.desactivarPublicacion, d.refrescarArticulo]);
    });
});

describe("[tienda_admin-articulo-fotos-02] Subir fotos de una en una", () => {
    beforeEach(() => {
        postImagenArticulo.mockReset();
    });

    const fichero = (nombre: string) => new File(["x"], nombre, { type: "image/jpeg" });

    test("tienda_admin_articulo_fotos_02_sube_en_orden_e_informa_del_progreso", async () => {
        const progreso: number[] = [];
        const fallidas = await d.subirFotos("A1", [fichero("a.jpg"), fichero("b.jpg")], (n) => progreso.push(n));
        expect(postImagenArticulo.mock.calls.map(([ref, f]) => [ref, (f as File).name])).toEqual([
            ["A1", "a.jpg"],
            ["A1", "b.jpg"],
        ]);
        expect(progreso).toEqual([1, 2]);
        expect(fallidas).toEqual([]);
    });

    test("tienda_admin_articulo_fotos_02_si_una_falla_sigue_con_las_demas", async () => {
        postImagenArticulo
            .mockRejectedValueOnce({ nombre: "Error al subir la foto", descripcion: "La imagen no es válida: supera los 10 MB" })
            .mockResolvedValueOnce(undefined);
        const fallidas = await d.subirFotos("A1", [fichero("grande.jpg"), fichero("b.jpg")], () => {});
        expect(postImagenArticulo).toHaveBeenCalledTimes(2);
        expect(fallidas).toEqual([{ nombre: "grande.jpg", motivo: "La imagen no es válida: supera los 10 MB" }]);
    });

    test("tienda_admin_articulo_fotos_02_al_terminar_se_refresca", () => {
        expect(getMaquina().ABIERTO.fotos_subidas).toEqual([d.refrescarArticulo]);
    });
});

describe("[tienda_admin-articulo-fotos-03] Borrar una foto con confirmación", () => {
    const foto = { id: 5, url: "u", alt: "", orden: 1, principal: false };

    test("tienda_admin_articulo_fotos_03_pide_confirmacion_con_la_foto_activa", async () => {
        expect(getMaquina().ABIERTO.borrar_foto_solicitado).toEqual([d.activarFoto]);
        const r = (await d.activarFoto(abierto(), foto)) as ContextoDetalleArticulo;
        expect(r.estado).toBe("BORRANDO_FOTO");
        expect(r.fotoActiva).toEqual(foto);
    });

    test("tienda_admin_articulo_fotos_03_tras_borrar_vuelve_y_refresca", async () => {
        const maquina = getMaquina();
        expect(maquina.BORRANDO_FOTO.foto_borrada).toEqual([d.desactivarFoto, d.refrescarArticulo]);
        expect(maquina.BORRANDO_FOTO.borrado_foto_cancelado).toEqual([d.desactivarFoto]);
        const r = (await d.desactivarFoto(abierto({ estado: "BORRANDO_FOTO", fotoActiva: foto }))) as ContextoDetalleArticulo;
        expect(r.estado).toBe("ABIERTO");
        expect(r.fotoActiva).toBeNull();
    });
});

describe("[tienda_admin-articulo-fotos-04] Ordenar fotos", () => {
    beforeEach(() => {
        patchOrdenImagenes.mockReset();
    });

    test("tienda_admin_articulo_fotos_04_envia_los_ids_y_refresca", async () => {
        expect(getMaquina().ABIERTO.fotos_ordenadas).toEqual([d.ordenarFotos, d.refrescarArticulo]);
        patchOrdenImagenes.mockResolvedValue(undefined);
        await d.ordenarFotos(abierto(), [7, 5, 6]);
        expect(patchOrdenImagenes).toHaveBeenCalledWith("A1", [7, 5, 6]);
    });
});

describe("[tienda_admin-articulo-fotos-05] Marcar como principal", () => {
    const foto = { id: 6, url: "u", alt: "", orden: 2, principal: false };

    beforeEach(() => {
        patchImagenPrincipal.mockReset();
    });

    test("tienda_admin_articulo_fotos_05_marca_y_refresca_detalle_y_maestro", async () => {
        expect(getMaquina().ABIERTO.foto_principal_solicitada).toEqual([d.marcarFotoPrincipal, d.refrescarArticulo]);
        patchImagenPrincipal.mockResolvedValue(undefined);
        await d.marcarFotoPrincipal(abierto(), foto);
        expect(patchImagenPrincipal).toHaveBeenCalledWith("A1", 6);
    });
});
