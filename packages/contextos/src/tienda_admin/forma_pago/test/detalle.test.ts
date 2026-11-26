import { beforeEach, describe, expect, test, vi } from "vitest";
import { FormaPagoTiendaDetalle } from "#/tienda_admin/forma_pago/diseño.ts";

const getFormaPago = vi.fn();
const getFormasPago = vi.fn();
const patchFormaPago = vi.fn();
const postProbarConexion = vi.fn();

vi.mock("#/tienda_admin/forma_pago/infraestructura.ts", () => ({
    getFormaPago: (...a: unknown[]) => getFormaPago(...a),
    getFormasPago: (...a: unknown[]) => getFormasPago(...a),
    patchFormaPago: (...a: unknown[]) => patchFormaPago(...a),
    postProbarConexion: (...a: unknown[]) => postProbarConexion(...a),
}));

const d = await import("#/tienda_admin/forma_pago/detalle/detalle.ts");
const { getMaquina } = await import("#/tienda_admin/forma_pago/detalle/maquina.ts");
const m = await import("#/tienda_admin/forma_pago/maestro/maestro.ts");
const { getMaquina: getMaquinaMaestro } = await import("#/tienda_admin/forma_pago/maestro/maquina.ts");

const forma = (extra: Partial<FormaPagoTiendaDetalle> = {}): FormaPagoTiendaDetalle => ({
    id: "3", websiteId: 1, codigo: "tarjeta", nombre: "Tarjeta", descripcion: "",
    tipo: "PASARELA", codpago: "CONT", orden: 1, activo: true,
    credencial: { id: "cred_1", nombre: "Stripe" }, destino: "PEDIDO", recibosPagados: true, conexion: null, ...extra,
});

beforeEach(() => {
    getFormaPago.mockReset();
    getFormasPago.mockReset();
    patchFormaPago.mockReset();
    postProbarConexion.mockReset();
});

describe("[tienda_admin-forma_pago-maestro-01] Listado del website activo", () => {
    test("tienda_admin_forma_pago_maestro_01_al_cambiar_de_website_recarga", async () => {
        getFormasPago.mockResolvedValue([forma()]);
        const ctx = { estado: "INICIAL" as const, websiteId: null, formas: { lista: [], total: 0, activo: "9", criteria: { filtro: [], orden: [], paginacion: { limite: 50, pagina: 1 } } } };
        const conWebsite = await m.cambiarWebsite(ctx, 2);
        const r = await m.recargarFormas(conWebsite as typeof ctx);
        expect(getFormasPago).toHaveBeenCalledWith(2);
        expect((r as typeof ctx).formas.lista).toHaveLength(1);
        expect((conWebsite as typeof ctx).formas.activo).toBeUndefined();
        expect(getMaquinaMaestro().INICIAL.website_cambiado).toEqual([m.cambiarWebsite, m.recargarFormas]);
    });
});

describe("[tienda_admin-forma_pago-detalle-01] Guardar el detalle", () => {
    test("tienda_admin_forma_pago_detalle_01_sin_cambios_no_llama_al_servidor", async () => {
        const f = forma();
        expect(await d.guardarDatos(f, { nombre: "Tarjeta", descripcion: "", codpago: "CONT", credencialId: "cred_1", orden: 1, activo: true, destino: "PEDIDO", recibosPagados: true })).toBe(false);
        expect(patchFormaPago).not.toHaveBeenCalled();
    });

    test("tienda_admin_forma_pago_detalle_01_con_cambios_llama_a_patch_y_refresca", async () => {
        const f = forma();
        expect(await d.guardarDatos(f, { nombre: "Tarjeta", descripcion: "", codpago: "CONT", credencialId: "cred_1", orden: 1, activo: false })).toBe(true);
        expect(patchFormaPago).toHaveBeenCalledWith("3", { activo: false });
        expect(getMaquina().ABIERTO.forma_pago_guardada).toEqual([d.refrescarForma]);
    });

    test("tienda_admin_forma_pago_detalle_01_refrescar_avisa_al_maestro", async () => {
        getFormaPago.mockResolvedValue(forma({ nombre: "Otra" }));
        const [r, eventos] = (await d.refrescarForma({ estado: "ABIERTO", forma: forma() })) as [{ forma: FormaPagoTiendaDetalle }, unknown[][]];
        expect(r.forma.nombre).toBe("Otra");
        expect(eventos[0][0]).toBe("forma_pago_cambiada");
    });
});

describe("[tienda_admin-forma_pago-conexion-01] Comprobar conexión", () => {
    test("tienda_admin_forma_pago_conexion_01_llama_a_probar_conexion_y_recarga", async () => {
        await d.comprobarConexion(forma());
        expect(postProbarConexion).toHaveBeenCalledWith("3");
        expect(getMaquina().ABIERTO.conexion_comprobada).toEqual([d.refrescarForma]);
    });
});
