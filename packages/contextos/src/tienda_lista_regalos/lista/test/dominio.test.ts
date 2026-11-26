import { describe, expect, test } from "vitest";
import { modeloEsValido } from "@olula/lib/dominio.ts";
import { fechaActual } from "@olula/lib/fecha.ts";
import { LineaListaRegalos, ListaRegalos } from "#/tienda_lista_regalos/lista/diseño.ts";
import {
    AVISO_NO_PUBLICADA,
    cambiosDeEdicion,
    cambiosDeLinea,
    criteriaListas,
    criteriaListasDefecto,
    distintivoPublicacion,
    edicionDeLinea,
    edicionDeLista,
    filtroListas,
    filtrosListaRegalosIniciales,
    hayCambios,
    intercambioOrden,
    itemDeLista,
    lineaEntregable,
    lineaEntregada,
    lineaLiberable,
    mensajeError400,
    metaEdicionLineaListaRegalos,
    metaNuevaLineaListaRegalos,
    metaNuevaListaRegalos,
    MOTIVO_LINEA_CON_VENTAS,
    motivoNoBorrableLinea,
    nuevaLineaListaRegalosVacia,
    nuevaListaRegalosVacia,
    TEXTO_AYUDA_PRECIO,
    TEXTO_CODIGO_DIRECCION,
    TEXTO_DIRECCION_PUBLICADA,
    textoCliente,
    textoVendidas,
    urlConDireccion,
    vistaPreviaNuevaDireccion,
    presentacionEstadoEnvio,
    presentacionEstadoPago,
    TEXTO_LIBERAR_LINEA,
    totalesLista,
} from "#/tienda_lista_regalos/lista/dominio.ts";
import { slugDesdeTexto } from "#/tienda_admin/comun/dominio.ts";

const linea = (id: string, extra: Partial<LineaListaRegalos> = {}): LineaListaRegalos => ({
    id,
    referencia: `R${id}`,
    descripcion: `Artículo ${id}`,
    precio: 10,
    cantidad: 2,
    cantidadVendida: 0,
    pendiente: 2,
    orden: Number(id),
    sinControlStock: false,
    stock: 5,
    entregada: false,
    estadoPago: "PENDIENTE",
    estadoEnvio: "PENDIENTE",
    imagen: null,
    dedicatoria: null,
    ...extra,
});

const lista = (extra: Partial<ListaRegalos> = {}): ListaRegalos => ({
    id: "7",
    websiteId: 1,
    cliente: { codigo: "C1", nombre: "Ana" },
    nombre: "Boda",
    descripcion: "",
    token: "boda-abc123",
    slug: "boda",
    codigo: "abc123",
    url: "https://tienda/lista/boda-abc123",
    publicada: false,
    creada: "2026-11-01T10:00:00",
    lineas: [linea("1"), linea("2", { cantidad: 3, cantidadVendida: 1, pendiente: 2 })],
    ...extra,
});

describe("[lista_regalos-maestro-01] Listado del website activo", () => {
    test("lista_regalos_maestro_01_distintivo_publicada_o_sin_publicar", () => {
        expect(distintivoPublicacion(true)).toBe("Publicada");
        expect(distintivoPublicacion(false)).toBe("Sin publicar");
    });

    test("lista_regalos_maestro_01_texto_de_vendidas", () => {
        expect(textoVendidas({ vendidas: 1, unidades: 5 })).toBe("1 de 5 vendidas");
    });

    test("lista_regalos_maestro_01_por_defecto_de_la_mas_reciente_a_la_mas_antigua", () => {
        expect(criteriaListasDefecto.orden).toEqual(["creada", "DESC"]);
    });

    test("lista_regalos_maestro_01_el_filtro_lleva_siempre_el_website", () => {
        expect(filtroListas({ ...filtrosListaRegalosIniciales, websiteId: 2 })).toEqual({ and: [["website_id", "=", "2"]] });
    });

    test("lista_regalos_maestro_01_sin_website_no_hay_clausulas", () => {
        expect(filtroListas(filtrosListaRegalosIniciales)).toEqual({ and: [] });
    });

    test("lista_regalos_maestro_01_el_item_se_calcula_desde_el_detalle", () => {
        expect(itemDeLista(lista())).toEqual({
            id: "7",
            websiteId: 1,
            cliente: { codigo: "C1", nombre: "Ana" },
            nombre: "Boda",
            publicada: false,
            creada: "2026-11-01T10:00:00",
            lineas: 2,
            unidades: 5,
            vendidas: 1,
        });
    });
});

describe("[lista_regalos-maestro-02] Filtro de texto por lista o cliente", () => {
    test("lista_regalos_maestro_02_texto_por_nombre_o_nombre_de_cliente", () => {
        expect(filtroListas({ ...filtrosListaRegalosIniciales, websiteId: 1, texto: " ana " })).toEqual({
            and: [
                ["website_id", "=", "1"],
                { or: [["nombre", "~", "ana"], ["cliente_nombre", "~", "ana"]] },
            ],
        });
    });

    test("lista_regalos_maestro_02_texto_de_solo_espacios_se_ignora", () => {
        expect(filtroListas({ ...filtrosListaRegalosIniciales, websiteId: 1, texto: "  " })).toEqual({ and: [["website_id", "=", "1"]] });
    });

    test("lista_regalos_maestro_02_criteria_conserva_orden_y_paginacion", () => {
        const r = criteriaListas(
            { ...filtrosListaRegalosIniciales, websiteId: 1 },
            { filtro: [], orden: ["creada", "DESC"], paginacion: { limite: 20, pagina: 2 } },
        );
        expect(r.orden).toEqual(["creada", "DESC"]);
        expect(r.paginacion).toEqual({ limite: 20, pagina: 2 });
    });
});

describe("[lista_regalos-maestro-03] Filtro por fecha", () => {
    test("lista_regalos_maestro_03_desde_y_hasta_incluyen_el_dia_entero", () => {
        expect(filtroListas({ ...filtrosListaRegalosIniciales, websiteId: 1, desde: "2026-03-01", hasta: "2026-03-31" })).toEqual({
            and: [["website_id", "=", "1"], ["creada", ">=", "2026-03-01"], ["creada", "<", "2026-04-01"]],
        });
    });

    test("lista_regalos_maestro_03_cada_limite_es_opcional", () => {
        expect(filtroListas({ ...filtrosListaRegalosIniciales, websiteId: 1, hasta: "2026-12-31" })).toEqual({
            and: [["website_id", "=", "1"], ["creada", "<", "2027-01-01"]],
        });
        expect(filtroListas({ ...filtrosListaRegalosIniciales, websiteId: 1, desde: "2026-03-01" })).toEqual({
            and: [["website_id", "=", "1"], ["creada", ">=", "2026-03-01"]],
        });
    });
});

describe("[lista_regalos-crear-01] Alta de lista", () => {
    const valida = modeloEsValido(metaNuevaListaRegalos);

    test("lista_regalos_crear_01_la_fecha_es_hoy_y_obligatoria", () => {
        const hoy = fechaActual().slice(0, 10);
        expect(nuevaListaRegalosVacia().fecha.toISOString().slice(0, 10)).toBe(hoy);
        expect(metaNuevaListaRegalos.campos?.fecha).toMatchObject({ requerido: true, tipo: "fecha" });
    });

    test("lista_regalos_crear_01_vacia_no_es_valida", () => {
        expect(valida(nuevaListaRegalosVacia())).toBe(false);
    });

    test("lista_regalos_crear_01_nombre_y_direccion_bastan_sin_cliente", () => {
        expect(valida({ ...nuevaListaRegalosVacia(), nombre: "Boda", direccion: "boda" })).toBe(true);
    });

    test("lista_regalos_crear_01_nombre_de_solo_espacios_no_es_valido", () => {
        expect(valida({ ...nuevaListaRegalosVacia(), clienteId: "C1", nombre: "  " })).toBe(false);
    });
});

describe("[lista_regalos-datos-01] Pestaña Datos", () => {
    test("lista_regalos_datos_01_la_edicion_parte_de_la_lista", () => {
        expect(edicionDeLista(lista())).toEqual({
            clienteId: "C1", clienteNombre: "Ana", nombre: "Boda", direccion: "boda", descripcion: "",
        });
    });

    test("lista_regalos_datos_01_sin_cambios_no_hay_nada_que_guardar", () => {
        expect(hayCambios(cambiosDeEdicion(lista(), edicionDeLista(lista())))).toBe(false);
    });

    test("lista_regalos_datos_01_solo_envia_lo_cambiado", () => {
        const edicion = { ...edicionDeLista(lista()), nombre: " Bautizo " };
        expect(cambiosDeEdicion(lista(), edicion)).toEqual({ nombre: "Bautizo" });
    });

    test("lista_regalos_datos_01_cambio_de_cliente", () => {
        const edicion = { ...edicionDeLista(lista()), clienteId: "C2", clienteNombre: "Luis" };
        expect(cambiosDeEdicion(lista(), edicion)).toEqual({ clienteId: "C2" });
    });
});

describe("[lista_regalos-productos-01] Tabla de productos", () => {
    test("lista_regalos_productos_01_estado_de_pago", () => {
        const casos = [
            ["PENDIENTE", "Pendiente", "gris"],
            ["RESERVADO", "Reservado", "advertencia"],
            ["PAGADO_TARJETA", "Pagado tarjeta", "exito"],
            ["PAGADO_TPV", "Pagado TPV", "exito"],
        ] as const;
        for (const [estadoPago, texto, variante] of casos) {
            expect(presentacionEstadoPago(linea("1", { estadoPago }))).toEqual({ texto, variante });
        }
    });

    test("lista_regalos_productos_01_estado_de_envio", () => {
        const casos = [
            ["PENDIENTE", "Pendiente", "gris"],
            ["POR_ENTREGAR_COMPRADOR", "Por entregar a comprador", "primario"],
            ["POR_ENTREGAR_PADRES", "Por entregar a padres", "primario"],
            ["ENTREGADO", "Entregado", "exito"],
        ] as const;
        for (const [estadoEnvio, texto, variante] of casos) {
            expect(presentacionEstadoEnvio(linea("1", { estadoEnvio }))).toEqual({ texto, variante });
        }
    });
});

describe("[lista_regalos-productos-06] Totales de la lista", () => {
    test("lista_regalos_productos_06_total_vendido_y_reservado", () => {
        const lineas = [
            linea("1", { precio: 10.1 }),
            linea("2", { precio: 20.2, estadoPago: "RESERVADO" }),
            linea("3", { precio: 30.3, estadoPago: "PAGADO_TARJETA" }),
            linea("4", { precio: 40, estadoPago: "PAGADO_TPV" }),
        ];
        expect(totalesLista(lineas)).toEqual({ total: 100.6, vendido: 90.5, reservado: 20.2 });
    });

    test("lista_regalos_productos_06_lista_vacia_a_cero", () => {
        expect(totalesLista([])).toEqual({ total: 0, vendido: 0, reservado: 0 });
    });
});

describe("[lista_regalos-productos-07] Entregado y deshacer entrega", () => {
    test("lista_regalos_productos_07_solo_por_entregar_se_puede_entregar", () => {
        expect(lineaEntregable(linea("1", { estadoEnvio: "POR_ENTREGAR_COMPRADOR" }))).toBe(true);
        expect(lineaEntregable(linea("1", { estadoEnvio: "POR_ENTREGAR_PADRES" }))).toBe(true);
        expect(lineaEntregable(linea("1", { estadoEnvio: "PENDIENTE" }))).toBe(false);
        expect(lineaEntregable(linea("1", { estadoEnvio: "ENTREGADO" }))).toBe(false);
    });

    test("lista_regalos_productos_07_solo_entregado_se_puede_deshacer", () => {
        expect(lineaEntregada(linea("1", { estadoEnvio: "ENTREGADO", entregada: true }))).toBe(true);
        expect(lineaEntregada(linea("1", { estadoEnvio: "POR_ENTREGAR_PADRES" }))).toBe(false);
    });
});

describe("[lista_regalos-productos-08] Liberar una reserva", () => {
    test("lista_regalos_productos_08_solo_reservada_y_sin_entregar", () => {
        expect(lineaLiberable(linea("1", { estadoPago: "RESERVADO" }))).toBe(true);
        expect(lineaLiberable(linea("1", { estadoPago: "RESERVADO", entregada: true }))).toBe(false);
        expect(lineaLiberable(linea("1", { estadoPago: "PAGADO_TPV" }))).toBe(false);
        expect(lineaLiberable(linea("1", { estadoPago: "PENDIENTE" }))).toBe(false);
    });

    test("lista_regalos_productos_08_texto_de_confirmacion", () => {
        expect(TEXTO_LIBERAR_LINEA).toBe(
            "El producto vuelve a quedar pendiente en la lista. La venta de TPV no se anula: anúlala en el TPV si hace falta",
        );
    });
});

describe("[lista_regalos-productos-02] Añadir producto", () => {
    const valida = modeloEsValido(metaNuevaLineaListaRegalos);

    test("lista_regalos_productos_02_sin_cantidad_y_precio_vacio", () => {
        expect(nuevaLineaListaRegalosVacia()).toEqual({ referencia: "", descripcion: "", precio: null });
    });

    test("lista_regalos_productos_02_texto_de_ayuda_del_precio", () => {
        expect(TEXTO_AYUDA_PRECIO).toBe(
            "Si lo dejas vacío se usa el precio de la tarifa del cliente o, si la lista no tiene cliente, el de la tienda");
    });

    test("lista_regalos_productos_02_hace_falta_articulo", () => {
        expect(valida(nuevaLineaListaRegalosVacia())).toBe(false);
        expect(valida({ ...nuevaLineaListaRegalosVacia(), referencia: "R1" })).toBe(true);
    });

    test("lista_regalos_productos_02_un_400_da_su_mensaje", () => {
        expect(mensajeError400({ estado: 400, descripcion: "El artículo R1 ya está en la lista" }))
            .toBe("El artículo R1 ya está en la lista");
        expect(mensajeError400({ estado: 404, descripcion: "x" })).toBeNull();
        expect(mensajeError400(null)).toBeNull();
    });
});

describe("[lista_regalos-productos-03] Cambiar una línea", () => {
    const valida = modeloEsValido(metaEdicionLineaListaRegalos);

    test("lista_regalos_productos_03_la_edicion_solo_lleva_el_precio", () => {
        expect(edicionDeLinea(linea("1", { cantidadVendida: 1 }))).toEqual({ precio: 10 });
    });

    test("lista_regalos_productos_03_los_cambios_solo_llevan_el_precio", () => {
        expect(cambiosDeLinea({ precio: 12 })).toEqual({ precio: 12 });
    });

    test("lista_regalos_productos_03_precio_negativo_no_es_valido", () => {
        expect(valida({ precio: -1 })).toBe(false);
        expect(valida({ precio: 0 })).toBe(true);
    });
});

describe("[lista_regalos-productos-04] Borrar una línea", () => {
    test("lista_regalos_productos_04_con_vendidas_no_se_puede_borrar", () => {
        expect(motivoNoBorrableLinea(linea("1", { cantidadVendida: 1 }))).toBe(MOTIVO_LINEA_CON_VENTAS);
        expect(MOTIVO_LINEA_CON_VENTAS).toBe("Tiene unidades vendidas");
    });

    test("lista_regalos_productos_04_sin_vendidas_se_puede_borrar", () => {
        expect(motivoNoBorrableLinea(linea("1"))).toBeNull();
    });
});

describe("[lista_regalos-productos-05] Subir y bajar líneas", () => {
    const lineas = [linea("1", { orden: 1 }), linea("2", { orden: 3 }), linea("3", { orden: 4 })];

    test("lista_regalos_productos_05_subir_intercambia_el_orden_con_la_anterior", () => {
        expect(intercambioOrden(lineas, "2", -1)).toEqual([{ id: "2", orden: 1 }, { id: "1", orden: 3 }]);
    });

    test("lista_regalos_productos_05_bajar_intercambia_el_orden_con_la_siguiente", () => {
        expect(intercambioOrden(lineas, "2", 1)).toEqual([{ id: "2", orden: 4 }, { id: "3", orden: 3 }]);
    });

    test("lista_regalos_productos_05_la_primera_no_sube_y_la_ultima_no_baja", () => {
        expect(intercambioOrden(lineas, "1", -1)).toBeNull();
        expect(intercambioOrden(lineas, "3", 1)).toBeNull();
        expect(intercambioOrden(lineas, "9", 1)).toBeNull();
    });
});

describe("[lista_regalos-compartir-01] Aviso de lista sin publicar", () => {
    test("lista_regalos_compartir_01_texto_del_aviso", () => {
        expect(AVISO_NO_PUBLICADA).toBe("La lista no está publicada: el enlace no funcionará hasta que la publiques");
    });
});

describe("[lista_regalos-maestro-01] Cliente opcional", () => {
    test("lista_regalos_maestro_01_sin_cliente", () => {
        expect(textoCliente({ cliente: null })).toBe("Sin cliente");
        expect(textoCliente({ cliente: { codigo: "C1", nombre: "Ana" } })).toBe("Ana");
    });

    test("lista_regalos_datos_01_quitar_el_cliente_envia_nulo", () => {
        const edicion = { ...edicionDeLista(lista()), clienteId: "", clienteNombre: "" };
        expect(cambiosDeEdicion(lista(), edicion)).toEqual({ clienteId: null });
    });

    test("lista_regalos_datos_01_lista_sin_cliente_se_edita_vacia", () => {
        expect(edicionDeLista(lista({ cliente: null }))).toMatchObject({ clienteId: "", clienteNombre: "" });
    });
});

describe("[lista_regalos-direccion-01] Dirección al crear", () => {
    const valida = modeloEsValido(metaNuevaListaRegalos);
    test("lista_regalos_direccion_01_slug_con_las_reglas_del_servidor", () => {
        expect(slugDesdeTexto("Boda de Ana & Pedro ¡2026!")).toBe("boda-de-ana-pedro-2026");
        expect(slugDesdeTexto("  Bautizo   Niño ")).toBe("bautizo-nino");
    });

    test("lista_regalos_direccion_01_sigue_al_nombre_mientras_no_se_toca", () => {
        const onChange = metaNuevaListaRegalos.onChange!;
        const conNombre = onChange({ ...nuevaListaRegalosVacia(), nombre: "Boda Ana" }, "nombre", "");
        expect(conNombre.direccion).toBe("boda-ana");
        const tocada = { ...conNombre, direccion: "mi-boda" };
        expect(onChange({ ...tocada, nombre: "Boda Ana y Pedro" }, "nombre", "Boda Ana").direccion).toBe("mi-boda");
    });

    test("lista_regalos_direccion_01_direccion_no_valida", () => {
        expect(valida({ ...nuevaListaRegalosVacia(), nombre: "Boda", direccion: "Con Espacios" })).toBe(false);
    });

    test("lista_regalos_direccion_01_vista_previa_y_aviso_del_codigo", () => {
        expect(vistaPreviaNuevaDireccion("boda-ana")).toBe("…/lista/boda-ana-······");
        expect(TEXTO_CODIGO_DIRECCION).toBe("Al final se añade un código para que nadie pueda adivinar la dirección");
    });
});

describe("[lista_regalos-direccion-02] Dirección en Datos", () => {
    test("lista_regalos_direccion_02_url_completa_con_el_codigo", () => {
        expect(urlConDireccion(lista(), "bautizo")).toBe("https://tienda/lista/bautizo-abc123");
    });

    test("lista_regalos_direccion_02_sin_publicar_se_envia", () => {
        const edicion = { ...edicionDeLista(lista()), direccion: "bautizo" };
        expect(cambiosDeEdicion(lista(), edicion)).toEqual({ slug: "bautizo" });
    });

    test("lista_regalos_direccion_02_publicada_no_se_envia", () => {
        const publicada = lista({ publicada: true });
        const edicion = { ...edicionDeLista(publicada), direccion: "bautizo" };
        expect(cambiosDeEdicion(publicada, edicion)).toEqual({});
        expect(TEXTO_DIRECCION_PUBLICADA).toBe("La dirección no se puede cambiar una vez publicada");
    });
});
