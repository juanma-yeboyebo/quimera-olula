import { beforeEach, describe, expect, test, vi } from "vitest";
import {
    ContextoCatalogo,
    FiltrosCatalogo,
    ProductoCatalogo,
} from "#/tienda_online/catalogo/diseño.ts";

const getCatalogo = vi.fn();

vi.mock("#/tienda_online/catalogo/infraestructura.ts", () => ({
    getCatalogo: (filtros: FiltrosCatalogo, pagina: number) => getCatalogo(filtros, pagina),
}));

const { cargarCatalogo, siguientePagina, filtrosCambiados } = await import(
    "#/tienda_online/catalogo/maestro/maestro.ts"
);

const filtrosBase: FiltrosCatalogo = {
    texto: "", categoria: null, soloDestacados: false, orden: "relevancia",
};

const producto = (referencia: string): ProductoCatalogo => ({
    referencia,
    slug: `slug-${referencia}`,
    descripcion: `Producto ${referencia}`,
    descripcionCorta: "",
    imagen: null,
    destacado: false,
    disponible: true,
    sinControlStock: false,
    precio: 10,
    precioConIva: 12.1,
    tipoIva: 21,
    divisa: "EUR",
    ivaIncluido: false,
});

const contexto = (extra: Partial<ContextoCatalogo> = {}): ContextoCatalogo => ({
    estado: "CARGANDO",
    productos: [],
    total: 0,
    pagina: 1,
    filtros: filtrosBase,
    ...extra,
});

beforeEach(() => { getCatalogo.mockReset(); });

describe("[catalogo-carga-04] [CARGANDO] catálogo cargado → LISTO (muestra la primera página y el total)", () => {
    test("catalogo_carga_04_pasa_a_listo_con_productos_y_total", async () => {
        getCatalogo.mockResolvedValue({ productos: [producto("A"), producto("B")], total: 30 });

        const r = await cargarCatalogo(contexto());

        expect(r).toMatchObject({ estado: "LISTO", total: 30, pagina: 1 });
        expect((r as ContextoCatalogo).productos.map((p) => p.referencia)).toEqual(["A", "B"]);
    });

    test("catalogo_carga_04_pide_la_pagina_1_con_los_filtros_del_contexto", async () => {
        const filtros: FiltrosCatalogo = { ...filtrosBase, texto: "gel" };
        getCatalogo.mockResolvedValue({ productos: [], total: 0 });

        await cargarCatalogo(contexto({ filtros }));

        expect(getCatalogo).toHaveBeenCalledWith(filtros, 1);
    });
});

describe("[catalogo-carga-05] [CARGANDO] error al cargar → ERROR", () => {
    test("catalogo_carga_05_pasa_a_error_si_falla_la_carga", async () => {
        getCatalogo.mockRejectedValue({ nombre: "Error", descripcion: "fallo", estado: 500 });

        const r = await cargarCatalogo(contexto());

        expect((r as ContextoCatalogo).estado).toBe("ERROR");
    });
});

describe("[catalogo-paginacion-01] «Ver más» pide la página siguiente y añade sus productos a los ya mostrados", () => {
    test("catalogo_paginacion_01_anade_productos_y_avanza_pagina", async () => {
        getCatalogo.mockResolvedValue({ productos: [producto("C")], total: 3 });
        const ctx = contexto({
            estado: "LISTO", productos: [producto("A"), producto("B")], total: 3, pagina: 1,
        });

        const r = (await siguientePagina(ctx)) as ContextoCatalogo;

        expect(getCatalogo).toHaveBeenCalledWith(ctx.filtros, 2);
        expect(r.estado).toBe("LISTO");
        expect(r.pagina).toBe(2);
        expect(r.productos.map((p) => p.referencia)).toEqual(["A", "B", "C"]);
    });
});

describe("[catalogo-paginacion-02] Al cambiar cualquier filtro o el orden se vuelve a la página 1 y se sustituyen los productos", () => {
    test("catalogo_paginacion_02_vuelve_a_pagina_1_y_sustituye", async () => {
        getCatalogo.mockResolvedValue({ productos: [producto("X")], total: 1 });
        const ctx = contexto({
            estado: "LISTO", productos: [producto("A"), producto("B")], total: 40, pagina: 2,
        });
        const nuevos: FiltrosCatalogo = { ...filtrosBase, orden: "precio_desc" };

        const r = (await filtrosCambiados(ctx, nuevos)) as ContextoCatalogo;

        expect(getCatalogo).toHaveBeenCalledWith(nuevos, 1);
        expect(r.estado).toBe("LISTO");
        expect(r.pagina).toBe(1);
        expect(r.total).toBe(1);
        expect(r.filtros).toEqual(nuevos);
        expect(r.productos.map((p) => p.referencia)).toEqual(["X"]);
    });
});

describe("[catalogo-paginacion-03] Si la página siguiente devuelve productos ya presentes, no se duplican", () => {
    test("catalogo_paginacion_03_siguiente_pagina_no_duplica_referencias", async () => {
        getCatalogo.mockResolvedValue({ productos: [producto("B"), producto("C")], total: 3 });
        const ctx = contexto({
            estado: "LISTO", productos: [producto("A"), producto("B")], total: 3, pagina: 1,
        });

        const r = (await siguientePagina(ctx)) as ContextoCatalogo;

        expect(r.productos.map((p) => p.referencia)).toEqual(["A", "B", "C"]);
    });
});
