import { beforeEach, describe, expect, test, vi } from "vitest";
import { ListaRegalosPublica } from "#/tienda_lista_regalos/web/diseño.ts";
import { ContextoListaRegalos } from "#/tienda_lista_regalos/web/lista/diseño.ts";

const getListaRegalos = vi.fn();

vi.mock("#/tienda_lista_regalos/web/infraestructura.ts", () => ({
    getListaRegalos: (token: string) => getListaRegalos(token),
}));

const { cargarLista, contextoListaInicial } = await import("#/tienda_lista_regalos/web/lista/lista.ts");
const { getMaquina } = await import("#/tienda_lista_regalos/web/lista/maquina.ts");

const lista: ListaRegalosPublica = {
    nombre: "Lista de Ana",
    descripcion: "Gracias",
    lineas: [],
};

type Resultado = ContextoListaRegalos | [ContextoListaRegalos, unknown[]];
const ctxDe = (r: Resultado): ContextoListaRegalos => (Array.isArray(r) ? r[0] : r);

beforeEach(() => {
    getListaRegalos.mockReset();
});

describe("[lista_regalos-web-lista-01] [CARGANDO] lista cargada → LISTO", () => {
    test("lista_regalos_web_lista_01_pasa_a_listo_con_la_lista", async () => {
        getListaRegalos.mockResolvedValue(lista);

        const r = ctxDe(await cargarLista(contextoListaInicial, "tk"));

        expect(getListaRegalos).toHaveBeenCalledWith("tk");
        expect(r.estado).toBe("LISTO");
        expect(r.lista).toEqual(lista);
        expect(r.token).toBe("tk");
    });

    test("lista_regalos_web_lista_01_404_pasa_a_no_encontrada", async () => {
        getListaRegalos.mockRejectedValue({ estado: 404 });

        const r = ctxDe(await cargarLista(contextoListaInicial, "tk"));

        expect(r.estado).toBe("NO_ENCONTRADA");
        expect(r.lista).toBeNull();
    });

    test.each([{ estado: 500 }, new Error("red")])(
        "lista_regalos_web_lista_01_otro_error_pasa_a_error",
        async (error) => {
            getListaRegalos.mockRejectedValue(error);

            const r = ctxDe(await cargarLista(contextoListaInicial, "tk"));

            expect(r.estado).toBe("ERROR");
        },
    );

    test("lista_regalos_web_lista_01_reintentar_usa_el_token_del_contexto", async () => {
        getListaRegalos.mockResolvedValue(lista);

        const r = ctxDe(await cargarLista({ ...contextoListaInicial, estado: "CARGANDO", token: "tk" }));

        expect(getListaRegalos).toHaveBeenCalledWith("tk");
        expect(r.estado).toBe("LISTO");
    });

    test("lista_regalos_web_lista_01_solo_error_admite_reintentar", () => {
        const maquina = getMaquina();

        expect(maquina.ERROR.reintentar).toBeDefined();
        expect(maquina.NO_ENCONTRADA.reintentar).toBeUndefined();
        expect(maquina.LISTO.reintentar).toBeUndefined();
    });
});
