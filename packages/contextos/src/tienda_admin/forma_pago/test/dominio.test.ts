import { describe, expect, test } from "vitest";
import { CredencialExterna } from "#/comun/credencial_externa/diseño.ts";
import { FormaPagoTienda } from "#/tienda_admin/forma_pago/diseño.ts";
import {
    cambiosDeEdicion,
    cuentasStripe,
    edicionDeForma,
    estaConectada,
    metaNuevaFormaPago,
    nuevaFormaPagoVacia,
    textoCuenta,
    textoTipo,
} from "#/tienda_admin/forma_pago/dominio.ts";
import { cambiosFormaPagoAApi, nuevaFormaPagoAApi } from "#/tienda_admin/forma_pago/infraestructura.ts";

const forma = (extra: Partial<FormaPagoTienda> = {}): FormaPagoTienda => ({
    id: "3", websiteId: 1, codigo: "tarjeta", nombre: "Tarjeta", descripcion: "",
    tipo: "PASARELA", codpago: "CONT", orden: 1, activo: true,
    credencial: { id: "cred_1", nombre: "Stripe Dulce Bebé" }, destino: "PEDIDO", recibosPagados: true, ...extra,
});

const credencial = (extra: Partial<CredencialExterna> = {}): CredencialExterna => ({
    id: "cred_1", empresaId: "1", nombre: "Stripe", proveedor: "Stripe", tipoAuth: "api_key",
    activo: true, creadoPor: "ana", creadoEn: new Date(), actualizadoEn: new Date(),
    propietarioId: null, categoria: "conector", ...extra,
});

describe("[tienda_admin-forma_pago-maestro-01] Listado de formas de pago", () => {
    test("tienda_admin_forma_pago_maestro_01_tipo_y_cuenta", () => {
        expect(textoTipo("PASARELA")).toBe("Tarjeta");
        expect(textoTipo("SIN_PASARELA")).toBe("Sin pago online");
        expect(textoCuenta(forma())).toBe("Stripe Dulce Bebé");
        expect(textoCuenta(forma({ credencial: null }))).toBe("Sin cuenta de Stripe");
        expect(textoCuenta(forma({ tipo: "SIN_PASARELA", credencial: null }))).toBeNull();
    });
});

describe("[tienda_admin-forma_pago-crear-01] Alta de forma de pago", () => {
    test("tienda_admin_forma_pago_crear_01_solo_cuentas_stripe_activas_de_empresa", () => {
        const cuentas = cuentasStripe([
            credencial(),
            credencial({ id: "c2", proveedor: "Telegram" }),
            credencial({ id: "c3", activo: false }),
            credencial({ id: "c4", propietarioId: "ana" }),
        ]);
        expect(cuentas).toEqual([{ id: "cred_1", nombre: "Stripe" }]);
    });

    test("tienda_admin_forma_pago_crear_01_sin_pago_online_no_envia_cuenta", () => {
        const nueva = { ...nuevaFormaPagoVacia(), tipo: "SIN_PASARELA" as const, codigo: " tienda ", nombre: "Pago en tienda", codpago: "CONT", credencialId: "cred_1" };
        expect(nuevaFormaPagoAApi(1, nueva)).toEqual({
            website_id: 1, tipo: "SIN_PASARELA", codigo: "tienda", nombre: "Pago en tienda",
            descripcion: null, codpago: "CONT", credencial_id: null,
            destino: "PEDIDO", recibos_pagados: false,
        });
    });

    test("tienda_admin_forma_pago_crear_01_por_defecto_pedido_y_recibos_cobrados", () => {
        const nueva = { ...nuevaFormaPagoVacia(), codigo: "tarjeta", nombre: "Tarjeta", codpago: "CONT" };
        expect(nuevaFormaPagoAApi(1, nueva)).toMatchObject({ destino: "PEDIDO", recibos_pagados: true });
        expect(nuevaFormaPagoAApi(1, { ...nueva, destino: "VENTA_TPV", recibosPagados: false }))
            .toMatchObject({ destino: "VENTA_TPV", recibos_pagados: false });
    });

    test("tienda_admin_forma_pago_crear_01_recibos_solo_en_tarjeta", () => {
        const modelo = { ...nuevaFormaPagoVacia(), tipo: "SIN_PASARELA" as const };
        expect(metaNuevaFormaPago.editable?.(modelo, "recibosPagados")).toBe(false);
        expect(metaNuevaFormaPago.editable?.(modelo, "destino")).toBe(true);
    });

    test("tienda_admin_forma_pago_crear_01_al_pasar_a_sin_pago_online_se_vacia_la_cuenta", () => {
        const modelo = { ...nuevaFormaPagoVacia(), tipo: "SIN_PASARELA" as const, credencialId: "cred_1" };
        expect(metaNuevaFormaPago.onChange?.(modelo, "tipo", "PASARELA").credencialId).toBe("");
        expect(metaNuevaFormaPago.editable?.(modelo, "credencialId")).toBe(false);
    });
});

describe("[tienda_admin-forma_pago-detalle-01] Edición de forma de pago", () => {
    test("tienda_admin_forma_pago_detalle_01_sin_cambios", () => {
        const f = forma();
        expect(cambiosDeEdicion(f, edicionDeForma(f))).toEqual({});
    });

    test("tienda_admin_forma_pago_detalle_01_solo_los_cambios_y_quitar_cuenta", () => {
        const f = forma();
        const cambios = cambiosDeEdicion(f, { ...edicionDeForma(f), nombre: "Tarjeta o Bizum", credencialId: "", activo: false });
        expect(cambios).toEqual({ nombre: "Tarjeta o Bizum", credencialId: null, activo: false });
        expect(cambiosFormaPagoAApi(cambios)).toEqual({ nombre: "Tarjeta o Bizum", credencial_id: null, activo: false });
    });

    test("tienda_admin_forma_pago_detalle_01_destino_y_recibos", () => {
        const f = forma();
        const cambios = cambiosDeEdicion(f, { ...edicionDeForma(f), destino: "VENTA_TPV", recibosPagados: false });
        expect(cambiosFormaPagoAApi(cambios)).toEqual({ destino: "VENTA_TPV", recibos_pagados: false });
    });

    test("tienda_admin_forma_pago_detalle_01_recibos_no_se_envian_sin_pago_online", () => {
        const f = forma({ tipo: "SIN_PASARELA", credencial: null });
        expect(cambiosDeEdicion(f, { ...edicionDeForma(f), recibosPagados: false })).toEqual({});
    });
});

describe("[tienda_admin-forma_pago-conexion-01] Estado de la conexión", () => {
    test("tienda_admin_forma_pago_conexion_01_segun_el_modo_en_uso", () => {
        expect(estaConectada(null)).toBe(false);
        expect(estaConectada({ modo: "test", test: true, live: false })).toBe(true);
        expect(estaConectada({ modo: "live", test: true, live: false })).toBe(false);
    });
});
