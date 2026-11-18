import { describe, expect, test } from "vitest";
import { modeloEsValido } from "@olula/lib/dominio.ts";
import { NodoCategoria } from "#/tienda_admin/categoria/diseño.ts";
import { ArticuloWeb, ArticuloWebDetalle, FiltrosArticulo } from "#/tienda_admin/articulo/diseño.ts";
import {
    cambiosDePublicacion,
    criteriaArticulos,
    distintivosArticulo,
    enlaceArticuloErp,
    errorFotosNoSubidas,
    estadoPublicacion,
    filasPublicacion,
    filtroArticulos,
    filtrosArticuloIniciales,
    fotosEnOrden,
    idsTrasMoverFoto,
    idsTrasSoltarFoto,
    ladoDeSoltado,
    idsCategoriasEnOrden,
    motivoError,
    metaPublicacion,
    metaTextos,
    mismasCategorias,
    opcionesFiltroCategoria,
    opcionesIdioma,
    publicacionDeWebsite,
    resumenDeArticulo,
    sugerenciasTextos,
    textoBotonPublicacion,
    textoQuitarPublicacion,
    textosDeArticulo,
} from "#/tienda_admin/articulo/dominio.ts";

const articulo = (extra: Partial<ArticuloWeb> = {}): ArticuloWeb => ({
    id: "A1",
    referencia: "A1",
    descripcion: "Camiseta",
    imagen: null,
    publicado: true,
    visible: true,
    destacado: false,
    ...extra,
});

const detalle = (extra: Partial<ArticuloWebDetalle> = {}): ArticuloWebDetalle => ({
    id: "A1",
    referencia: "A1",
    descripcion: "Camiseta",
    precio: 10,
    textos: {
        "*": { nombre: "", descripcionCorta: "corta", descripcionLarga: "larga", metaTitulo: "titulo", metaDescripcion: "desc" },
    },
    idiomas: ["es", "en"],
    publicaciones: [
        {
            websiteId: 1, publicado: true, visible: false, destacado: true,
            slug: "camiseta", orden: 3, fechaPublicacion: "2026-01-15",
        },
    ],
    imagenes: [
        { id: 1, url: "/a.jpg", alt: "", orden: 2, principal: false },
        { id: 2, url: "/b.jpg", alt: "", orden: 1, principal: true },
    ],
    categorias: [],
    ...extra,
});

const nodo = (id: string, hijas: NodoCategoria[] = []): NodoCategoria => ({
    id, padreId: null, codigo: id, nombre: `N${id}`, slug: id, orden: 0,
    visible: true, enMenu: true, articulos: 0, hijas,
});

describe("[tienda_admin-articulo-maestro-01] Distintivos del listado", () => {
    test("tienda_admin_articulo_maestro_01_publicado_visible", () => {
        expect(distintivosArticulo(articulo())).toEqual(["Publicado"]);
    });

    test("tienda_admin_articulo_maestro_01_no_publicado", () => {
        expect(distintivosArticulo(articulo({ publicado: false, visible: false }))).toEqual(["No publicado"]);
    });

    test("tienda_admin_articulo_maestro_01_oculto_si_esta_publicado_y_no_visible", () => {
        expect(distintivosArticulo(articulo({ visible: false }))).toEqual(["Publicado", "Oculto"]);
    });

    test("tienda_admin_articulo_maestro_01_destacado", () => {
        expect(distintivosArticulo(articulo({ destacado: true }))).toEqual(["Publicado", "Destacado"]);
    });
});

describe("[tienda_admin-articulo-maestro-02] Los filtros se traducen a cláusulas", () => {
    const f = (extra: Partial<FiltrosArticulo>): FiltrosArticulo => ({ ...filtrosArticuloIniciales, ...extra });

    test("tienda_admin_articulo_maestro_02_por_defecto_estado_es_todos_y_no_hay_clausulas", () => {
        expect(filtrosArticuloIniciales.estado).toBe("todos");
        expect(filtroArticulos(filtrosArticuloIniciales)).toEqual([]);
    });

    test("tienda_admin_articulo_maestro_02_el_website_siempre_va_si_existe", () => {
        expect(filtroArticulos(f({ websiteId: 2 }))).toEqual([["website_id", "=", "2"]]);
    });

    test("tienda_admin_articulo_maestro_02_texto_recortado", () => {
        expect(filtroArticulos(f({ texto: " cam " }))).toEqual([["texto", "~", "cam"]]);
    });

    test("tienda_admin_articulo_maestro_02_texto_de_solo_espacios_se_ignora", () => {
        expect(filtroArticulos(f({ texto: "   " }))).toEqual([]);
    });

    test("tienda_admin_articulo_maestro_02_estado_y_categoria", () => {
        expect(filtroArticulos(f({ websiteId: 1, estado: "no_publicado", categoriaId: "5" }))).toEqual([
            ["website_id", "=", "1"],
            ["estado", "=", "no_publicado"],
            ["categoria_id", "=", "5"],
        ]);
    });

    test("tienda_admin_articulo_maestro_02_criteria_conserva_orden_y_paginacion_y_sustituye_el_filtro", () => {
        const criteria = {
            filtro: [["x", "=", "1"]] as [string, string, string][],
            orden: ["-referencia"],
            paginacion: { limite: 20, pagina: 3 },
        };
        const r = criteriaArticulos(f({ websiteId: 1 }), criteria);
        expect(r.orden).toEqual(["-referencia"]);
        expect(r.paginacion).toEqual({ limite: 20, pagina: 3 });
        expect(r.filtro).toEqual([["website_id", "=", "1"]]);
    });

    test("tienda_admin_articulo_maestro_02_opciones_de_categoria_con_sangria_y_todas", () => {
        const opciones = opcionesFiltroCategoria([nodo("1", [nodo("2")])]);
        expect(opciones[0]).toEqual({ valor: "", descripcion: "Todas las categorías" });
        expect(opciones.map((o) => o.valor)).toEqual(["", "1", "2"]);
        expect(opciones[2].descripcion.endsWith("N2")).toBe(true);
        expect(opciones[2].descripcion.startsWith("N")).toBe(false);
    });
});

describe("[tienda_admin-articulo-publicacion-01] Publicación del website activo", () => {
    test("tienda_admin_articulo_publicacion_01_busca_la_publicacion_del_website", () => {
        expect(publicacionDeWebsite(detalle(), 1)?.slug).toBe("camiseta");
        expect(publicacionDeWebsite(detalle(), 2)).toBeUndefined();
        expect(publicacionDeWebsite(detalle(), null)).toBeUndefined();
    });

    test("tienda_admin_articulo_publicacion_01_sin_publicacion_propone_publicar_visible_y_sin_slug", () => {
        expect(cambiosDePublicacion(undefined)).toEqual({
            publicado: true, visible: true, destacado: false, slug: "", orden: 0,
        });
    });

    test("tienda_admin_articulo_publicacion_01_con_publicacion_copia_sus_valores", () => {
        expect(cambiosDePublicacion(publicacionDeWebsite(detalle(), 1))).toEqual({
            publicado: true, visible: false, destacado: true, slug: "camiseta", orden: 3,
        });
    });

    test("tienda_admin_articulo_publicacion_01_el_boton_dice_publicar_en_si_no_hay_publicacion", () => {
        expect(textoBotonPublicacion(undefined, "España")).toBe("Publicar en España");
        expect(textoBotonPublicacion(publicacionDeWebsite(detalle(), 1), "España")).toBe("Guardar");
    });

    test("tienda_admin_articulo_publicacion_01_quitar_menciona_el_website", () => {
        expect(textoQuitarPublicacion("España")).toBe("Quitar de España");
    });

    test("tienda_admin_articulo_publicacion_01_el_resumen_usa_la_publicacion_y_la_imagen_principal", () => {
        expect(resumenDeArticulo(detalle(), 1)).toEqual({
            id: "A1", referencia: "A1", descripcion: "Camiseta", imagen: "/b.jpg",
            publicado: true, visible: false, destacado: true,
        });
    });

    test("tienda_admin_articulo_publicacion_01_el_resumen_sin_publicacion_es_no_publicado", () => {
        const r = resumenDeArticulo(detalle({ imagenes: [] }), 9);
        expect(r).toMatchObject({ imagen: null, publicado: false, visible: false, destacado: false });
    });

    test("tienda_admin_articulo_detalle_01_enlace_al_articulo_del_erp", () => {
        expect(enlaceArticuloErp("A 1")).toBe("/ventas/articulo?id=A%201");
    });
});

describe("[tienda_admin-articulo-publicacion-01] Estado de la publicación por website", () => {
    const pub = (publicado: boolean, visible: boolean) => ({
        websiteId: 1, publicado, visible, destacado: false, slug: "", orden: 0, fechaPublicacion: null,
    });

    test("tienda_admin_articulo_publicacion_01_los_cuatro_estados", () => {
        expect(estadoPublicacion(undefined)).toBe("Sin publicar");
        expect(estadoPublicacion(pub(false, true))).toBe("En pausa");
        expect(estadoPublicacion(pub(false, false))).toBe("En pausa");
        expect(estadoPublicacion(pub(true, false))).toBe("Oculto en catálogo");
        expect(estadoPublicacion(pub(true, true))).toBe("Publicado");
    });

    test("tienda_admin_articulo_publicacion_01_una_fila_por_website_activo", () => {
        const websites = [
            { id: 1, codigo: "es", nombre: "España", activo: true },
            { id: 2, codigo: "pt", nombre: "Portugal", activo: true },
            { id: 3, codigo: "fr", nombre: "Francia", activo: false },
        ];
        const filas = filasPublicacion(detalle(), websites);
        expect(filas.map((f) => [f.website.id, f.estado, f.publicacion?.slug])).toEqual([
            [1, "Oculto en catálogo", "camiseta"],
            [2, "Sin publicar", undefined],
        ]);
    });
});

describe("[tienda_admin-articulo-publicacion-02] El slug de la publicación se valida", () => {
    const valida = modeloEsValido(metaPublicacion);
    const base = cambiosDePublicacion(undefined);

    test("tienda_admin_articulo_publicacion_02_slug_vacio_es_valido", () => {
        expect(valida(base)).toBe(true);
    });

    test("tienda_admin_articulo_publicacion_02_slug_correcto_es_valido", () => {
        expect(valida({ ...base, slug: "camiseta-roja" })).toBe(true);
    });

    test("tienda_admin_articulo_publicacion_02_slug_con_mayusculas_no_es_valido", () => {
        expect(valida({ ...base, slug: "Camiseta" })).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_slug_con_guion_final_no_es_valido", () => {
        expect(valida({ ...base, slug: "camiseta-" })).toBe(false);
    });

    test("tienda_admin_articulo_publicacion_02_slug_de_151_caracteres_no_es_valido", () => {
        expect(valida({ ...base, slug: "a".repeat(151) })).toBe(false);
    });
});

describe("[tienda_admin-articulo-textos-01] Longitudes máximas de los textos", () => {
    const valida = modeloEsValido(metaTextos);
    const base = textosDeArticulo(detalle(), "*");

    test("tienda_admin_articulo_textos_01_los_textos_actuales_son_validos", () => {
        expect(valida(base)).toBe(true);
    });

    test("tienda_admin_articulo_textos_01_nombre_100_si_101_no", () => {
        expect(valida({ ...base, nombre: "a".repeat(100) })).toBe(true);
        expect(valida({ ...base, nombre: "a".repeat(101) })).toBe(false);
    });

    test("tienda_admin_articulo_textos_01_descripcion_corta_255_si_256_no", () => {
        expect(valida({ ...base, descripcionCorta: "a".repeat(255) })).toBe(true);
        expect(valida({ ...base, descripcionCorta: "a".repeat(256) })).toBe(false);
    });

    test("tienda_admin_articulo_textos_01_titulo_seo_255_si_256_no", () => {
        expect(valida({ ...base, metaTitulo: "a".repeat(255) })).toBe(true);
        expect(valida({ ...base, metaTitulo: "a".repeat(256) })).toBe(false);
    });

    test("tienda_admin_articulo_textos_01_descripcion_seo_500_si_501_no", () => {
        expect(valida({ ...base, metaDescripcion: "a".repeat(500) })).toBe(true);
        expect(valida({ ...base, metaDescripcion: "a".repeat(501) })).toBe(false);
    });

    test("tienda_admin_articulo_textos_01_la_descripcion_larga_no_tiene_limite", () => {
        expect(valida({ ...base, descripcionLarga: "a".repeat(5000) })).toBe(true);
    });
});

describe("[tienda_admin-articulo-textos-01] Textos por idioma", () => {
    test("tienda_admin_articulo_textos_01_el_selector_tiene_por_defecto_y_los_idiomas", () => {
        expect(opcionesIdioma(["es", "en"]).map((o) => o.valor)).toEqual(["*", "es", "en"]);
        expect(opcionesIdioma([])[0].descripcion).toBe("Por defecto");
    });

    test("tienda_admin_articulo_textos_01_idioma_sin_fila_da_textos_vacios", () => {
        expect(textosDeArticulo(detalle(), "*").descripcionCorta).toBe("corta");
        expect(textosDeArticulo(detalle(), "en")).toEqual({
            nombre: "", descripcionCorta: "", descripcionLarga: "", metaTitulo: "", metaDescripcion: "",
        });
    });
});

describe("[tienda_admin-articulo-textos-02] Sugerencias de los campos vacíos", () => {
    test("tienda_admin_articulo_textos_02_por_defecto_sugiere_la_descripcion_del_erp_como_nombre", () => {
        expect(sugerenciasTextos(detalle(), "*")).toEqual({
            nombre: "Camiseta", descripcionCorta: "", descripcionLarga: "", metaTitulo: "", metaDescripcion: "",
        });
    });

    test("tienda_admin_articulo_textos_02_otro_idioma_sugiere_el_texto_por_defecto", () => {
        const a = detalle();
        a.textos["*"].nombre = "Camiseta de algodón";
        expect(sugerenciasTextos(a, "en")).toEqual({
            nombre: "Camiseta de algodón", descripcionCorta: "corta", descripcionLarga: "larga",
            metaTitulo: "titulo", metaDescripcion: "desc",
        });
    });

    test("tienda_admin_articulo_textos_02_sin_nombre_por_defecto_sugiere_la_descripcion_del_erp", () => {
        expect(sugerenciasTextos(detalle(), "en").nombre).toBe("Camiseta");
    });
});

describe("[tienda_admin-articulo-categorias-01] Las categorías se guardan en el orden del árbol", () => {
    const arbol = [nodo("1", [nodo("2"), nodo("3")]), nodo("4")];

    test("tienda_admin_articulo_categorias_01_ordena_las_marcadas_segun_el_arbol", () => {
        expect(idsCategoriasEnOrden(arbol, ["4", "3", "1"])).toEqual(["1", "3", "4"]);
    });

    test("tienda_admin_articulo_categorias_01_ignora_ids_que_no_estan_en_el_arbol", () => {
        expect(idsCategoriasEnOrden(arbol, ["9", "2"])).toEqual(["2"]);
    });

    test("tienda_admin_articulo_categorias_01_sin_marcadas_devuelve_lista_vacia", () => {
        expect(idsCategoriasEnOrden(arbol, [])).toEqual([]);
    });

    test("tienda_admin_articulo_categorias_01_compara_conjuntos_sin_importar_el_orden", () => {
        expect(mismasCategorias(["1", "2"], ["2", "1"])).toBe(true);
        expect(mismasCategorias(["1"], ["1", "2"])).toBe(false);
        expect(mismasCategorias(["1", "3"], ["1", "2"])).toBe(false);
    });
});

describe("[tienda_admin-articulo-fotos-02] Errores de subida", () => {
    test("tienda_admin_articulo_fotos_02_lista_cada_fichero_con_su_motivo", () => {
        expect(errorFotosNoSubidas([
            { nombre: "a.gif", motivo: "no es una imagen JPEG, PNG o WebP" },
            { nombre: "b.jpg", motivo: "supera los 10 MB" },
        ])).toEqual({
            nombre: "No se han podido subir 2 fotos",
            descripcion: "a.gif: no es una imagen JPEG, PNG o WebP\nb.jpg: supera los 10 MB",
        });
        expect(errorFotosNoSubidas([{ nombre: "a.gif", motivo: "x" }]).nombre).toBe("No se ha podido subir 1 foto");
    });

    test("tienda_admin_articulo_fotos_02_motivo_desde_error_de_api_o_js", () => {
        expect(motivoError({ nombre: "Error al subir la foto", descripcion: "supera los 10 MB" })).toBe("supera los 10 MB");
        expect(motivoError(new Error("sin red"))).toBe("sin red");
    });
});

describe("[tienda_admin-articulo-fotos-04] Nuevo orden de las fotos", () => {
    const foto = (id: number, orden: number) => ({ id, url: "u", alt: "", orden, principal: false });
    const fotos = [foto(6, 2), foto(5, 1), foto(7, 3)];

    test("tienda_admin_articulo_fotos_04_las_fotos_salen_por_orden", () => {
        expect(fotosEnOrden(fotos).map((f) => f.id)).toEqual([5, 6, 7]);
    });

    test("tienda_admin_articulo_fotos_04_mover_con_las_flechas", () => {
        expect(idsTrasMoverFoto(fotos, 6, -1)).toEqual([6, 5, 7]);
        expect(idsTrasMoverFoto(fotos, 6, 1)).toEqual([5, 7, 6]);
        expect(idsTrasMoverFoto(fotos, 5, -1)).toBeNull();
        expect(idsTrasMoverFoto(fotos, 7, 1)).toBeNull();
    });

    test("tienda_admin_articulo_fotos_04_soltar_delante_o_detras", () => {
        expect(idsTrasSoltarFoto(fotos, 7, 5, "antes")).toEqual([7, 5, 6]);
        expect(idsTrasSoltarFoto(fotos, 5, 7, "despues")).toEqual([6, 7, 5]);
        expect(idsTrasSoltarFoto(fotos, 5, 6, "antes")).toBeNull();
        expect(idsTrasSoltarFoto(fotos, 5, 5, "despues")).toBeNull();
    });

    test("tienda_admin_articulo_fotos_04_el_lado_depende_de_la_mitad", () => {
        expect(ladoDeSoltado(10, 100)).toBe("antes");
        expect(ladoDeSoltado(60, 100)).toBe("despues");
    });
});
