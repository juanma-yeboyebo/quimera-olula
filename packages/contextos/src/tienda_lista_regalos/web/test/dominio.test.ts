import { describe, expect, test } from "vitest";
import {
    estaRegalada,
    limitarCantidadLinea,
    metadatosFichaLinea,
    rutaLineaLista,
    textoPendiente,
} from "#/tienda_lista_regalos/web/dominio.ts";
import { FichaLineaLista, LineaListaRegalos } from "#/tienda_lista_regalos/web/diseño.ts";

const linea = (parcial: Partial<LineaListaRegalos> = {}): LineaListaRegalos => ({
    id: 7,
    referencia: "REF1",
    descripcion: "Cuna",
    imagen: null,
    precio: 121,
    divisa: "EUR",
    cantidad: 3,
    vendida: 1,
    pendiente: 2,
    ...parcial,
});

const ficha = (parcial: Partial<FichaLineaLista> = {}): FichaLineaLista => ({
    ...linea(),
    descripcionCorta: null,
    descripcionLarga: null,
    metaTitulo: null,
    metaDescripcion: null,
    imagenes: [],
    ...parcial,
});

describe("[lista_regalos-web-lista-02] La tarjeta muestra «Quedan <pendiente> de <cantidad>» y, sin pendiente, «Regalado»", () => {
    test("lista_regalos_web_lista_02_texto_de_pendiente", () => {
        expect(textoPendiente(linea())).toBe("Quedan 2 de 3");
    });

    test("lista_regalos_web_lista_02_con_pendiente_no_esta_regalada", () => {
        expect(estaRegalada(linea())).toBe(false);
    });

    test("lista_regalos_web_lista_02_sin_pendiente_esta_regalada", () => {
        expect(estaRegalada(linea({ vendida: 3, pendiente: 0 }))).toBe(true);
    });

    test("lista_regalos_web_lista_02_enlaza_a_la_ficha_de_la_linea", () => {
        expect(rutaLineaLista("tk", 7)).toBe("/lista/tk/producto/7");
    });
});

describe("[lista_regalos-web-ficha-01] La ficha fija título y descripción como la ficha de producto", () => {
    test("lista_regalos_web_ficha_01_usa_los_meta_si_los_hay", () => {
        expect(metadatosFichaLinea(ficha({ metaTitulo: "T", metaDescripcion: "D" }))).toEqual({
            titulo: "T",
            descripcion: "D",
        });
    });

    test("lista_regalos_web_ficha_01_sin_meta_usa_descripcion_y_corta", () => {
        expect(metadatosFichaLinea(ficha({ descripcionCorta: "Corta" }))).toEqual({
            titulo: "Cuna",
            descripcion: "Corta",
        });
    });
});

describe("[lista_regalos-web-ficha-02] El selector de cantidad va de 1 a lo pendiente", () => {
    test("lista_regalos_web_ficha_02_no_baja_de_1", () => {
        expect(limitarCantidadLinea(0, linea())).toBe(1);
    });

    test("lista_regalos_web_ficha_02_no_pasa_de_lo_pendiente", () => {
        expect(limitarCantidadLinea(5, linea({ pendiente: 2 }))).toBe(2);
    });

    test("lista_regalos_web_ficha_02_dentro_del_rango_se_respeta", () => {
        expect(limitarCantidadLinea(2, linea({ cantidad: 5, pendiente: 4 }))).toBe(2);
    });
});
