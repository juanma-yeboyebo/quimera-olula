import { describe, expect, test } from "vitest";
import {
    estaDisponible,
    imagenInicial,
    limitarCantidad,
    metadatosFicha,
    textoDisponibilidad,
} from "#/tienda_online/producto/dominio.ts";
import { FichaProducto, ImagenProducto } from "#/tienda_online/producto/diseño.ts";

const ficha = (parcial: Partial<FichaProducto> = {}): FichaProducto => ({
    referencia: "REF1",
    slug: "producto-1",
    descripcion: "Producto 1",
    descripcionCorta: null,
    descripcionLarga: null,
    metaTitulo: null,
    metaDescripcion: null,
    imagenes: [],
    categorias: [],
    disponible: true,
    cantidadDisponible: 10,
    sinControlStock: false,
    precio: 10,
    precioConIva: 12.1,
    tipoIva: 21,
    divisa: "EUR",
    ivaIncluido: false,
    ...parcial,
});

const img = (url: string, principal = false): ImagenProducto => ({ url, alt: url, principal });

describe("[producto-contenido-01] La galería muestra primero la imagen principal o la primera", () => {
    test("producto_contenido_01_devuelve_la_principal", () => {
        const imagenes = [img("a"), img("b", true), img("c")];
        expect(imagenInicial(imagenes)).toEqual(img("b", true));
    });

    test("producto_contenido_01_sin_principal_devuelve_la_primera", () => {
        expect(imagenInicial([img("a"), img("b")])).toEqual(img("a"));
    });

    test("producto_contenido_01_sin_imagenes_devuelve_null", () => {
        expect(imagenInicial([])).toBeNull();
    });
});

describe("[producto-contenido-05] El texto de disponibilidad lo da textoDisponibilidad(ficha): Agotado, Quedan N unidades o En stock", () => {
    test("producto_contenido_05_disponible", () => {
        expect(estaDisponible(ficha({ disponible: true }))).toBe(true);
    });

    test("producto_contenido_05_sin_stock", () => {
        expect(estaDisponible(ficha({ disponible: false }))).toBe(false);
    });

    test("producto_contenido_05_sin_control_de_stock_siempre_disponible", () => {
        expect(estaDisponible(ficha({ disponible: false, sinControlStock: true }))).toBe(true);
    });

    test("producto_contenido_05_texto_no_disponible_es_agotado", () => {
        expect(textoDisponibilidad(ficha({ disponible: false, cantidadDisponible: 0 }))).toBe("Agotado");
    });

    test("producto_contenido_05_texto_quedan_pocas_unidades", () => {
        expect(textoDisponibilidad(ficha({ cantidadDisponible: 1 }))).toBe("Quedan 1 unidades");
        expect(textoDisponibilidad(ficha({ cantidadDisponible: 5 }))).toBe("Quedan 5 unidades");
    });

    test("producto_contenido_05_texto_en_stock_con_mas_de_cinco", () => {
        expect(textoDisponibilidad(ficha({ cantidadDisponible: 6 }))).toBe("En stock");
    });

    test("producto_contenido_05_texto_sin_control_de_stock_en_stock", () => {
        expect(textoDisponibilidad(ficha({ sinControlStock: true, cantidadDisponible: 0 }))).toBe("En stock");
        expect(textoDisponibilidad(ficha({ sinControlStock: true, cantidadDisponible: 2 }))).toBe("En stock");
    });
});

describe("[producto-anadir-02] Si el producto no está disponible el botón está deshabilitado", () => {
    test("producto_anadir_02_no_disponible_con_control_de_stock", () => {
        expect(estaDisponible(ficha({ disponible: false, cantidadDisponible: 0 }))).toBe(false);
    });

    test("producto_anadir_02_disponible_habilita", () => {
        expect(estaDisponible(ficha({ disponible: true }))).toBe(true);
    });
});

describe("[producto-anadir-01] El selector de cantidad no admite menos de 1 ni más del disponible", () => {
    test("producto_anadir_01_respeta_una_cantidad_valida", () => {
        expect(limitarCantidad(3, ficha({ cantidadDisponible: 10 }))).toBe(3);
    });

    test("producto_anadir_01_minimo_1", () => {
        expect(limitarCantidad(0, ficha())).toBe(1);
        expect(limitarCantidad(-5, ficha())).toBe(1);
    });

    test("producto_anadir_01_maximo_cantidad_disponible_con_control_de_stock", () => {
        expect(limitarCantidad(15, ficha({ cantidadDisponible: 10 }))).toBe(10);
    });

    test("producto_anadir_01_igual_al_disponible_es_valida", () => {
        expect(limitarCantidad(10, ficha({ cantidadDisponible: 10 }))).toBe(10);
    });

    test("producto_anadir_01_sin_control_de_stock_no_hay_maximo", () => {
        expect(limitarCantidad(500, ficha({ sinControlStock: true, cantidadDisponible: 0 }))).toBe(500);
    });
});

describe("[producto-carga-05] El título y la descripción del documento salen de los metadatos", () => {
    test("producto_carga_05_usa_los_meta", () => {
        const f = ficha({ metaTitulo: "Meta T", metaDescripcion: "Meta D", descripcionCorta: "Corta" });
        expect(metadatosFicha(f)).toEqual({ titulo: "Meta T", descripcion: "Meta D" });
    });

    test("producto_carga_05_titulo_cae_a_la_descripcion", () => {
        const f = ficha({ metaTitulo: null, descripcion: "Producto 1" });
        expect(metadatosFicha(f).titulo).toBe("Producto 1");
    });

    test("producto_carga_05_descripcion_cae_a_la_corta", () => {
        const f = ficha({ metaDescripcion: null, descripcionCorta: "Corta" });
        expect(metadatosFicha(f).descripcion).toBe("Corta");
    });

    test("producto_carga_05_descripcion_vacia_si_no_hay_ninguna", () => {
        const f = ficha({ metaDescripcion: null, descripcionCorta: null });
        expect(metadatosFicha(f).descripcion).toBe("");
    });
});
