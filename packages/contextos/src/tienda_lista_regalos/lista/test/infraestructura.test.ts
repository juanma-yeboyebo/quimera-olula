import { beforeEach, describe, expect, test, vi } from "vitest";

const getQuery = vi.fn();
const getItem = vi.fn();
const post = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        getQuery: (...a: unknown[]) => getQuery(...a),
        getItem: (...a: unknown[]) => getItem(...a),
        post: (...a: unknown[]) => post(...a),
        patch: (...a: unknown[]) => patch(...a),
        delete: (...a: unknown[]) => del(...a),
    },
}));

const infra = await import("#/tienda_lista_regalos/lista/infraestructura.ts");

const listaApi = {
    id: 7,
    website_id: 1,
    cliente: { codigo: "C1", nombre: null },
    nombre: "Boda",
    descripcion: null,
    token: "tok",
    url: "https://tienda/lista/tok",
    publicada: true,
    creada: "2026-11-01T10:00:00",
    lineas: [
        { id: 11, referencia: "R1", descripcion: null, precio: 12.5, cantidad: 2, cantidad_vendida: 2, pendiente: 0 },
        { id: 12, referencia: "R2", descripcion: "Cuna", precio: 99, cantidad: 1, cantidad_vendida: 0, pendiente: 1, orden: 5 },
    ],
};

describe("[lista_regalos-maestro-01] Lectura del listado", () => {
    beforeEach(() => {
        getQuery.mockReset();
    });

    test("lista_regalos_maestro_01_pide_la_ruta_con_el_website_en_el_filtro", async () => {
        getQuery.mockResolvedValue({ datos: [], total: 0 });
        await infra.getListasRegalos(
            { websiteId: 1, texto: "" },
            { filtro: [], orden: ["creada", "DESC"], paginacion: { limite: 10, pagina: 1 } },
        );
        expect(getQuery.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista");
        expect(getQuery.mock.calls[0][1]).toEqual({
            filtro: { and: [["website_id", "=", "1"]] },
            orden: ["creada", "DESC"],
            paginacion: { limite: 10, pagina: 1 },
        });
    });

    test("lista_regalos_maestro_01_convierte_el_item", () => {
        expect(
            infra.itemListaDesdeApi({
                id: 7, website_id: 1, cliente: { codigo: "C1", nombre: "Ana" }, nombre: "Boda",
                publicada: false, creada: "2026-11-01T10:00:00", lineas: 2, unidades: 5, vendidas: 1,
            }),
        ).toEqual({
            id: "7", websiteId: 1, cliente: { codigo: "C1", nombre: "Ana" }, nombre: "Boda",
            publicada: false, creada: "2026-11-01T10:00:00", lineas: 2, unidades: 5, vendidas: 1,
        });
    });
});

describe("[lista_regalos-detalle-01] Lectura y borrado de la lista", () => {
    beforeEach(() => {
        getItem.mockReset();
        del.mockReset();
    });

    test("lista_regalos_detalle_01_pide_la_lista_por_id", async () => {
        getItem.mockResolvedValue({});
        await infra.getListaRegalos("7");
        expect(getItem.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista/7");
    });

    test("lista_regalos_detalle_01_convierte_la_lista_con_sus_lineas", () => {
        const l = infra.listaDesdeApi(listaApi);
        expect(l).toMatchObject({
            id: "7", websiteId: 1, cliente: { codigo: "C1", nombre: "" }, nombre: "Boda",
            descripcion: "", token: "tok", url: "https://tienda/lista/tok", publicada: true,
        });
        expect(l.lineas[0]).toEqual({
            id: "11", referencia: "R1", descripcion: "", precio: 12.5,
            cantidad: 2, cantidadVendida: 2, pendiente: 0, orden: 1,
        });
    });

    test("lista_regalos_detalle_01_el_orden_del_servidor_manda_y_si_falta_se_usa_la_posicion", () => {
        const l = infra.listaDesdeApi(listaApi);
        expect(l.lineas.map((x) => x.orden)).toEqual([1, 5]);
    });

    test("lista_regalos_detalle_01_delete_a_la_ruta_de_la_lista", async () => {
        await infra.deleteListaRegalos("7");
        expect(del.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista/7");
    });

    test("lista_regalos_detalle_01_un_400_al_borrar_se_propaga", async () => {
        del.mockRejectedValue({ estado: 400, descripcion: "La lista 7 tiene unidades vendidas" });
        await expect(infra.deleteListaRegalos("7")).rejects.toMatchObject({ estado: 400 });
    });
});

describe("[lista_regalos-crear-01] Alta de lista", () => {
    beforeEach(() => {
        post.mockReset();
    });

    test("lista_regalos_crear_01_el_cuerpo_lleva_el_website_activo", async () => {
        post.mockResolvedValue({ id: 9 });
        const id = await infra.postListaRegalos(2, { clienteId: "C1", clienteNombre: "Ana", nombre: " Boda ", descripcion: "" });
        expect(id).toBe("9");
        expect(post.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista");
        expect(post.mock.calls[0][1]).toEqual({ id_website: 2, cliente_id: "C1", nombre: "Boda", descripcion: null });
    });
});

describe("[lista_regalos-datos-01] Guardar la lista", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("lista_regalos_datos_01_patch_con_los_campos_en_snake_case", async () => {
        await infra.patchListaRegalos("7", { nombre: "B", descripcion: "d", clienteId: "C2", publicada: true });
        expect(patch.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista/7");
        expect(patch.mock.calls[0][1]).toEqual({ nombre: "B", descripcion: "d", cliente_id: "C2", publicada: true });
    });

    test("lista_regalos_datos_01_solo_envia_lo_que_cambia", () => {
        expect(infra.cambiosListaAApi({ publicada: false })).toEqual({ publicada: false });
    });
});

describe("[lista_regalos-productos-02] Añadir producto", () => {
    beforeEach(() => {
        post.mockReset();
    });

    test("lista_regalos_productos_02_post_a_la_ruta_de_lineas", async () => {
        post.mockResolvedValue({ id: 15 });
        const id = await infra.postLineaListaRegalos("7", { referencia: "R1", descripcion: "x", cantidad: 1, precio: 20 });
        expect(id).toBe("15");
        expect(post.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista/7/linea");
        expect(post.mock.calls[0][1]).toEqual({ referencia: "R1", cantidad: 1, precio: 20 });
    });

    test("lista_regalos_productos_02_sin_precio_no_se_envia", () => {
        expect(infra.nuevaLineaAApi({ referencia: "R1", descripcion: "", cantidad: 2, precio: null })).toEqual({
            referencia: "R1", cantidad: 2,
        });
    });

    test("lista_regalos_productos_02_un_400_de_articulo_repetido_se_propaga", async () => {
        post.mockRejectedValue({ estado: 400, descripcion: "El artículo R1 ya está en la lista" });
        await expect(
            infra.postLineaListaRegalos("7", { referencia: "R1", descripcion: "", cantidad: 1, precio: null }),
        ).rejects.toMatchObject({ estado: 400 });
    });
});

describe("[lista_regalos-productos-03] Cambiar una línea", () => {
    beforeEach(() => {
        patch.mockReset();
    });

    test("lista_regalos_productos_03_patch_a_la_ruta_de_la_linea", async () => {
        await infra.patchLineaListaRegalos("7", "11", { precio: 10, cantidad: 3, cantidadVendida: 1 });
        expect(patch.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista/7/linea/11");
        expect(patch.mock.calls[0][1]).toEqual({ precio: 10, cantidad: 3, cantidad_vendida: 1 });
    });
});

describe("[lista_regalos-productos-04] Borrar una línea", () => {
    beforeEach(() => {
        del.mockReset();
    });

    test("lista_regalos_productos_04_delete_a_la_ruta_de_la_linea", async () => {
        await infra.deleteLineaListaRegalos("7", "11");
        expect(del.mock.calls[0][0]).toBe("/tienda_lista_regalos/lista/7/linea/11");
    });
});

describe("[lista_regalos-productos-05] Cambiar el orden", () => {
    test("lista_regalos_productos_05_el_cuerpo_solo_lleva_el_orden", () => {
        expect(infra.cambiosLineaAApi({ orden: 3 })).toEqual({ orden: 3 });
    });
});
