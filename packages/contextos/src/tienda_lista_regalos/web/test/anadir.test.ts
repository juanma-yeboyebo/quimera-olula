import { beforeEach, describe, expect, test, vi } from "vitest";
import { obtenerAvisos, reiniciarAvisos } from "#/tienda_online/comun/avisos_store.ts";

const postLineaCarrito = vi.fn();
const postLigarCarrito = vi.fn();
const asegurarCarrito = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();

vi.mock("#/tienda_online/producto/infraestructura.ts", () => ({
    postLineaCarrito: (token: string, referencia: string, cantidad: number) =>
        postLineaCarrito(token, referencia, cantidad),
}));

vi.mock("#/tienda_lista_regalos/web/infraestructura.ts", () => ({
    postLigarCarrito: (token: string, tokenCarrito: string) => postLigarCarrito(token, tokenCarrito),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    asegurarCarrito: () => asegurarCarrito(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
}));

const { anadirLineaDeLista, anadirDeLista, anadirEnCarritoNuevo, esCarritoDeOtraLista } =
    await import("#/tienda_lista_regalos/web/anadir.ts");

beforeEach(() => {
    postLineaCarrito.mockReset();
    postLigarCarrito.mockReset();
    asegurarCarrito.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    recargarCarrito.mockResolvedValue(undefined);
    postLigarCarrito.mockResolvedValue(undefined);
    postLineaCarrito.mockResolvedValue(9);
    reiniciarAvisos();
});

describe("[lista_regalos-web-anadir-01] anadirLineaDeLista asegura el carrito, lo liga y añade la línea", () => {
    test("lista_regalos_web_anadir_01_asegura_liga_y_anade_en_orden", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        const orden: string[] = [];
        postLigarCarrito.mockImplementation(async () => orden.push("ligar"));
        postLineaCarrito.mockImplementation(async () => orden.push("linea"));

        await anadirLineaDeLista("tk", "REF1", 2);

        expect(postLigarCarrito).toHaveBeenCalledWith("tk", "car-1");
        expect(postLineaCarrito).toHaveBeenCalledWith("car-1", "REF1", 2);
        expect(orden).toEqual(["ligar", "linea"]);
        expect(recargarCarrito).toHaveBeenCalledOnce();
    });

    test.each([404, 409])(
        "lista_regalos_web_anadir_01_%i_al_ligar_olvida_y_repite_los_tres_pasos_una_vez",
        async (estado) => {
            asegurarCarrito.mockResolvedValueOnce("car-viejo").mockResolvedValueOnce("car-nuevo");
            postLigarCarrito.mockRejectedValueOnce({ estado }).mockResolvedValueOnce(undefined);

            await anadirLineaDeLista("tk", "REF1", 1);

            expect(olvidarCarrito).toHaveBeenCalledOnce();
            expect(postLigarCarrito).toHaveBeenNthCalledWith(1, "tk", "car-viejo");
            expect(postLigarCarrito).toHaveBeenNthCalledWith(2, "tk", "car-nuevo");
            expect(postLineaCarrito).toHaveBeenCalledOnce();
            expect(postLineaCarrito).toHaveBeenCalledWith("car-nuevo", "REF1", 1);
        },
    );

    test.each([404, 409])(
        "lista_regalos_web_anadir_01_%i_al_anadir_la_linea_olvida_y_repite_los_tres_pasos",
        async (estado) => {
            asegurarCarrito.mockResolvedValueOnce("car-viejo").mockResolvedValueOnce("car-nuevo");
            postLineaCarrito.mockRejectedValueOnce({ estado }).mockResolvedValueOnce(9);

            await anadirLineaDeLista("tk", "REF1", 1);

            expect(olvidarCarrito).toHaveBeenCalledOnce();
            expect(postLigarCarrito).toHaveBeenCalledTimes(2);
            expect(postLineaCarrito).toHaveBeenNthCalledWith(2, "car-nuevo", "REF1", 1);
        },
    );

    test("lista_regalos_web_anadir_01_si_el_reintento_falla_no_hay_tercer_intento", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        postLigarCarrito.mockRejectedValue({ estado: 404, descripcion: "no existe" });

        await expect(anadirLineaDeLista("tk", "REF1", 1)).rejects.toEqual({
            estado: 404,
            descripcion: "no existe",
        });

        expect(postLigarCarrito).toHaveBeenCalledTimes(2);
        expect(olvidarCarrito).toHaveBeenCalledOnce();
    });

    test("lista_regalos_web_anadir_01_al_terminar_avisa_producto_anadido", async () => {
        asegurarCarrito.mockResolvedValue("car-1");

        const r = await anadirDeLista("tk", "REF1", "Cuna", 1);

        expect(r).toBe("AÑADIDO");
        expect(obtenerAvisos()).toEqual([
            expect.objectContaining({ tipo: "ok", texto: "Cuna añadido al carrito" }),
        ]);
    });
});

describe("[lista_regalos-web-anadir-02] 400 al ligar: carrito de otra lista, no añade y pide confirmación", () => {
    test("lista_regalos_web_anadir_02_400_al_ligar_no_anade_ni_olvida", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        postLigarCarrito.mockRejectedValue({ estado: 400, descripcion: "El carrito tiene artículos de otra lista" });

        const r = await anadirDeLista("tk", "REF1", "Cuna", 1);

        expect(r).toBe("CARRITO_DE_OTRA_LISTA");
        expect(postLineaCarrito).not.toHaveBeenCalled();
        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(obtenerAvisos()).toEqual([]);
    });

    test("lista_regalos_web_anadir_02_anadirLineaDeLista_lanza_error_de_otra_lista", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        postLigarCarrito.mockRejectedValue({ estado: 400 });

        const error = await anadirLineaDeLista("tk", "REF1", 1).catch((e) => e);

        expect(esCarritoDeOtraLista(error)).toBe(true);
    });

    test("lista_regalos_web_anadir_02_400_al_anadir_la_linea_no_es_de_otra_lista", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        postLineaCarrito.mockRejectedValue({ estado: 400, descripcion: "De Cuna solo quedan 1 unidades en la lista" });

        const r = await anadirDeLista("tk", "REF1", "Cuna", 2);

        expect(r).toBe("ERROR");
    });

    test("lista_regalos_web_anadir_02_empezar_carrito_nuevo_olvida_y_repite", async () => {
        asegurarCarrito.mockResolvedValue("car-nuevo");

        const r = await anadirEnCarritoNuevo("tk", "REF1", "Cuna", 1);

        expect(olvidarCarrito).toHaveBeenCalledOnce();
        expect(olvidarCarrito.mock.invocationCallOrder[0]).toBeLessThan(
            asegurarCarrito.mock.invocationCallOrder[0],
        );
        expect(postLigarCarrito).toHaveBeenCalledWith("tk", "car-nuevo");
        expect(postLineaCarrito).toHaveBeenCalledWith("car-nuevo", "REF1", 1);
        expect(r).toBe("AÑADIDO");
    });
});

describe("[lista_regalos-web-anadir-03] Los demás errores van al aviso de error de la tienda", () => {
    test("lista_regalos_web_anadir_03_muestra_el_texto_del_servidor", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        postLineaCarrito.mockRejectedValue({ estado: 400, descripcion: "De Cuna solo quedan 1 unidades en la lista" });

        await anadirDeLista("tk", "REF1", "Cuna", 2);

        expect(obtenerAvisos()).toEqual([
            expect.objectContaining({ tipo: "error", texto: "De Cuna solo quedan 1 unidades en la lista" }),
        ]);
    });

    test("lista_regalos_web_anadir_03_sin_texto_usa_el_mensaje_por_defecto", async () => {
        asegurarCarrito.mockRejectedValue(new Error("red"));

        const r = await anadirDeLista("tk", "REF1", "Cuna", 1);

        expect(r).toBe("ERROR");
        expect(obtenerAvisos()[0]).toEqual(
            expect.objectContaining({ tipo: "error", texto: "No se ha podido añadir al carrito" }),
        );
    });

    test("lista_regalos_web_anadir_03_500_al_ligar_no_reintenta", async () => {
        asegurarCarrito.mockResolvedValue("car-1");
        postLigarCarrito.mockRejectedValue({ estado: 500, descripcion: "fallo" });

        const r = await anadirDeLista("tk", "REF1", "Cuna", 1);

        expect(r).toBe("ERROR");
        expect(olvidarCarrito).not.toHaveBeenCalled();
        expect(postLigarCarrito).toHaveBeenCalledOnce();
        expect(obtenerAvisos()[0].texto).toBe("fallo");
    });
});
