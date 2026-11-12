import { beforeEach, describe, expect, test, vi } from "vitest";
import { FichaLineaLista } from "#/tienda_lista_regalos/web/diseño.ts";
import { ContextoFichaLinea } from "#/tienda_lista_regalos/web/ficha/diseño.ts";

const getListaRegalos = vi.fn();
const getLineaListaRegalos = vi.fn();
const anadirDeLista = vi.fn();
const anadirEnCarritoNuevo = vi.fn();

vi.mock("#/tienda_lista_regalos/web/infraestructura.ts", () => ({
    getListaRegalos: (token: string) => getListaRegalos(token),
    getLineaListaRegalos: (token: string, idLinea: string) => getLineaListaRegalos(token, idLinea),
}));

vi.mock("#/tienda_lista_regalos/web/anadir.ts", () => ({
    anadirDeLista: (...args: unknown[]) => anadirDeLista(...args),
    anadirEnCarritoNuevo: (...args: unknown[]) => anadirEnCarritoNuevo(...args),
}));

const { cargarFicha, cambiarCantidad, anadirAlCarrito, empezarCarritoNuevo, contextoFichaLineaInicial } =
    await import("#/tienda_lista_regalos/web/ficha/ficha.ts");
const { getMaquina } = await import("#/tienda_lista_regalos/web/ficha/maquina.ts");

const ficha: FichaLineaLista = {
    id: 7,
    referencia: "REF1",
    descripcion: "Cuna",
    imagen: null,
    precio: 121,
    divisa: "EUR",
    cantidad: 5,
    vendida: 2,
    pendiente: 3,
    descripcionCorta: null,
    descripcionLarga: null,
    metaTitulo: null,
    metaDescripcion: null,
    imagenes: [],
};

const clave = { token: "tk", idLinea: "7" };

type Resultado = ContextoFichaLinea | [ContextoFichaLinea, unknown[]];
const ctxDe = (r: Resultado): ContextoFichaLinea => (Array.isArray(r) ? r[0] : r);

const contextoListo = (extra: Partial<ContextoFichaLinea> = {}): ContextoFichaLinea => ({
    ...contextoFichaLineaInicial,
    estado: "LISTO",
    clave,
    nombreLista: "Lista de Ana",
    ficha,
    ...extra,
});

beforeEach(() => {
    getListaRegalos.mockReset();
    getLineaListaRegalos.mockReset();
    anadirDeLista.mockReset();
    anadirEnCarritoNuevo.mockReset();
});

describe("[lista_regalos-web-ficha-01] Carga de la ficha con el nombre de la lista para la miga", () => {
    test("lista_regalos_web_ficha_01_cargada_pasa_a_listo_con_ficha_y_nombre_de_lista", async () => {
        getListaRegalos.mockResolvedValue({ nombre: "Lista de Ana", descripcion: null, lineas: [] });
        getLineaListaRegalos.mockResolvedValue(ficha);

        const r = ctxDe(await cargarFicha(contextoFichaLineaInicial, clave));

        expect(getLineaListaRegalos).toHaveBeenCalledWith("tk", "7");
        expect(getListaRegalos).toHaveBeenCalledWith("tk");
        expect(r.estado).toBe("LISTO");
        expect(r.ficha).toEqual(ficha);
        expect(r.nombreLista).toBe("Lista de Ana");
        expect(r.cantidad).toBe(1);
    });

    test("lista_regalos_web_ficha_01_404_pasa_a_no_encontrada", async () => {
        getListaRegalos.mockResolvedValue({ nombre: "L", descripcion: null, lineas: [] });
        getLineaListaRegalos.mockRejectedValue({ estado: 404 });

        const r = ctxDe(await cargarFicha(contextoFichaLineaInicial, clave));

        expect(r.estado).toBe("NO_ENCONTRADA");
    });

    test("lista_regalos_web_ficha_01_otro_error_pasa_a_error", async () => {
        getListaRegalos.mockResolvedValue({ nombre: "L", descripcion: null, lineas: [] });
        getLineaListaRegalos.mockRejectedValue({ estado: 500 });

        const r = ctxDe(await cargarFicha(contextoFichaLineaInicial, clave));

        expect(r.estado).toBe("ERROR");
        expect(r.clave).toEqual(clave);
    });

    test("lista_regalos_web_ficha_01_reintentar_usa_la_clave_del_contexto", async () => {
        getListaRegalos.mockResolvedValue({ nombre: "L", descripcion: null, lineas: [] });
        getLineaListaRegalos.mockResolvedValue(ficha);

        const r = ctxDe(await cargarFicha({ ...contextoFichaLineaInicial, clave }));

        expect(getLineaListaRegalos).toHaveBeenCalledWith("tk", "7");
        expect(r.estado).toBe("LISTO");
    });
});

describe("[lista_regalos-web-ficha-02] Selector de 1 a lo pendiente y «Añadir al carrito» con esa cantidad", () => {
    test("lista_regalos_web_ficha_02_la_cantidad_se_limita_a_lo_pendiente", async () => {
        const r = ctxDe(await cambiarCantidad(contextoListo(), 9));

        expect(r.cantidad).toBe(3);
    });

    test("lista_regalos_web_ficha_02_anade_la_cantidad_elegida", async () => {
        anadirDeLista.mockResolvedValue("AÑADIDO");

        const r = ctxDe(await anadirAlCarrito(contextoListo({ estado: "AÑADIENDO", cantidad: 2 })));

        expect(anadirDeLista).toHaveBeenCalledWith("tk", "REF1", "Cuna", 2);
        expect(r.estado).toBe("LISTO");
    });

    test("lista_regalos_web_ficha_02_error_al_anadir_vuelve_a_listo", async () => {
        anadirDeLista.mockResolvedValue("ERROR");

        const r = ctxDe(await anadirAlCarrito(contextoListo({ estado: "AÑADIENDO" })));

        expect(r.estado).toBe("LISTO");
    });
});

describe("[lista_regalos-web-anadir-02] Diálogo de carrito de otra lista en la ficha", () => {
    test("lista_regalos_web_anadir_02_carrito_de_otra_lista_abre_el_dialogo", async () => {
        anadirDeLista.mockResolvedValue("CARRITO_DE_OTRA_LISTA");

        const r = ctxDe(await anadirAlCarrito(contextoListo({ estado: "AÑADIENDO", cantidad: 2 })));

        expect(r.estado).toBe("CARRITO_DE_OTRA_LISTA");
        expect(r.cantidad).toBe(2);
    });

    test("lista_regalos_web_anadir_02_empezar_carrito_nuevo_repite_el_anadido", async () => {
        anadirEnCarritoNuevo.mockResolvedValue("AÑADIDO");

        const r = ctxDe(await empezarCarritoNuevo(contextoListo({ estado: "AÑADIENDO", cantidad: 2 })));

        expect(anadirEnCarritoNuevo).toHaveBeenCalledWith("tk", "REF1", "Cuna", 2);
        expect(r.estado).toBe("LISTO");
    });

    test("lista_regalos_web_anadir_02_cancelar_vuelve_a_listo_sin_anadir", () => {
        const maquina = getMaquina();

        expect(maquina.CARRITO_DE_OTRA_LISTA.carrito_nuevo_cancelado).toBe("LISTO");
        expect(maquina.CARRITO_DE_OTRA_LISTA.carrito_nuevo_confirmado).toEqual([
            "AÑADIENDO",
            empezarCarritoNuevo,
        ]);
    });
});
