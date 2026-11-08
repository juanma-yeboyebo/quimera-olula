import { beforeEach, describe, expect, test, vi } from "vitest";
import { obtenerAvisos, reiniciarAvisos } from "#/tienda_online/comun/avisos_store.ts";
import { estaCajonCarritoAbierto, cerrarCajonCarrito } from "#/tienda_online/comun/cajon_carrito_store.ts";

const postLineaCarrito = vi.fn();
const asegurarCarrito = vi.fn();
const recargarCarrito = vi.fn();
const olvidarCarrito = vi.fn();

vi.mock("#/tienda_online/producto/infraestructura.ts", () => ({
    postLineaCarrito: (token: string, referencia: string, cantidad: number) =>
        postLineaCarrito(token, referencia, cantidad),
}));

vi.mock("#/tienda_online/comun/carrito_store.ts", () => ({
    asegurarCarrito: () => asegurarCarrito(),
    recargarCarrito: () => recargarCarrito(),
    olvidarCarrito: () => olvidarCarrito(),
}));

const { anadirRapido } = await import("#/tienda_online/producto/anadir.ts");

beforeEach(() => {
    postLineaCarrito.mockReset();
    asegurarCarrito.mockReset();
    recargarCarrito.mockReset();
    olvidarCarrito.mockReset();
    recargarCarrito.mockResolvedValue(undefined);
    reiniciarAvisos();
    cerrarCajonCarrito();
});

describe("[catalogo-tarjeta-07] añadir desde la tarjeta", () => {
    test("catalogo_tarjeta_07_añade_una_unidad_y_avisa_sin_abrir_el_cajon", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockResolvedValue(9);

        await anadirRapido("REF1", "Producto 1");

        expect(postLineaCarrito).toHaveBeenCalledWith("tok-1", "REF1", 1);
        expect(recargarCarrito).toHaveBeenCalledOnce();
        expect(estaCajonCarritoAbierto()).toBe(false);
        const [aviso] = obtenerAvisos();
        expect(aviso.tipo).toBe("ok");
        expect(aviso.texto).toBe("Producto 1 añadido al carrito");
        expect(aviso.accion).toBeUndefined();
    });

    test("catalogo_tarjeta_07_error_muestra_aviso_de_error_con_el_texto_del_backend", async () => {
        asegurarCarrito.mockResolvedValue("tok-1");
        postLineaCarrito.mockRejectedValue({ estado: 400, descripcion: "Sin stock" });

        await anadirRapido("REF1", "Producto 1");

        expect(obtenerAvisos()).toEqual([expect.objectContaining({ tipo: "error", texto: "Sin stock" })]);
        expect(estaCajonCarritoAbierto()).toBe(false);
    });

    test("catalogo_tarjeta_07_error_sin_descripcion_usa_el_texto_por_defecto", async () => {
        asegurarCarrito.mockRejectedValue(new Error("x"));

        await anadirRapido("REF1", "Producto 1");

        expect(obtenerAvisos()[0].texto).toBe("No se ha podido añadir al carrito");
    });
});
