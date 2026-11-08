import { beforeEach, describe, expect, test, vi } from "vitest";
import {
    abrirCajonCarrito,
    cerrarCajonCarrito,
    estaCajonCarritoAbierto,
    suscribirCajonCarrito,
} from "#/tienda_online/comun/cajon_carrito_store.ts";

beforeEach(() => {
    cerrarCajonCarrito();
});

describe("[carrito-cajon-01] El estado del cajón del carrito está en cajon_carrito_store", () => {
    test("carrito_cajon_01_empieza_cerrado", () => {
        expect(estaCajonCarritoAbierto()).toBe(false);
    });

    test("carrito_cajon_01_abrir_lo_abre", () => {
        abrirCajonCarrito();

        expect(estaCajonCarritoAbierto()).toBe(true);
    });

    test("carrito_cajon_01_cerrar_lo_cierra", () => {
        abrirCajonCarrito();

        cerrarCajonCarrito();

        expect(estaCajonCarritoAbierto()).toBe(false);
    });

    test("carrito_cajon_01_notifica_a_los_suscriptores_al_abrir_y_cerrar", () => {
        const cb = vi.fn();
        const baja = suscribirCajonCarrito(cb);

        abrirCajonCarrito();
        cerrarCajonCarrito();

        expect(cb).toHaveBeenCalledTimes(2);
        baja();
    });

    test("carrito_cajon_01_la_desuscripcion_deja_de_notificar", () => {
        const cb = vi.fn();
        const baja = suscribirCajonCarrito(cb);
        baja();

        abrirCajonCarrito();

        expect(cb).not.toHaveBeenCalled();
    });

    test("carrito_cajon_01_abrir_dos_veces_no_notifica_la_segunda", () => {
        const cb = vi.fn();
        const baja = suscribirCajonCarrito(cb);

        abrirCajonCarrito();
        abrirCajonCarrito();

        expect(cb).toHaveBeenCalledTimes(1);
        baja();
    });

    test("carrito_cajon_01_cerrar_estando_cerrado_no_notifica", () => {
        const cb = vi.fn();
        const baja = suscribirCajonCarrito(cb);

        cerrarCajonCarrito();

        expect(cb).not.toHaveBeenCalled();
        baja();
    });
});
