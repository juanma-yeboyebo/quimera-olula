import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { obtenerToken, olvidarCarrito, recargarCarrito } from "../../comun/carrito_store.ts";
import { codigoStoreViewActivo } from "../../comun/storeview.ts";
import { DatosCheckout } from "../diseño.ts";
import { clavePagoEnCurso, datosCheckoutAApi, erroresCheckout } from "../dominio.ts";
import { patchDatosCheckout, postIniciarPago } from "../infraestructura.ts";
import { redirigirA } from "../navegacion.ts";
import { ContextoCheckout, EstadoCheckout } from "./diseño.ts";

type ProcesarCheckout = ProcesarContexto<EstadoCheckout, ContextoCheckout>;

const NO_DISPONIBLE = "Este carrito ya no está disponible";
const PAGO_FALLIDO = "No se ha podido iniciar el pago. Inténtalo de nuevo.";

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

const textoDe = (e: unknown): string =>
    (e as { descripcion?: string })?.descripcion ?? "No se han podido guardar los datos";

const carritoPerdido = (e: unknown): boolean => estadoDe(e) === 404 || estadoDe(e) === 409;

export const contextoCheckoutInicial = (datos: DatosCheckout): ContextoCheckout => ({
    estado: "DATOS",
    datos,
    errores: {},
    error: null,
});

export const cambiarDatos: ProcesarCheckout = async (contexto, payload) => ({
    ...contexto,
    datos: payload as DatosCheckout,
    errores: {},
    error: null,
});

export const volverADatos: ProcesarCheckout = async (contexto) => ({
    ...contexto,
    estado: "DATOS",
    error: null,
});

export const guardarDatos: ProcesarCheckout = async (contexto) => {
    const errores = erroresCheckout(contexto.datos);
    if (Object.keys(errores).length > 0)
        return { ...contexto, estado: "DATOS", errores, error: null };

    const token = obtenerToken();
    if (!token) return { ...contexto, estado: "DATOS", errores: {}, error: NO_DISPONIBLE };

    try {
        await patchDatosCheckout(token, datosCheckoutAApi(contexto.datos));
    } catch (e) {
        if (carritoPerdido(e)) {
            olvidarCarrito();
            return { ...contexto, estado: "DATOS", errores: {}, error: NO_DISPONIBLE };
        }
        return { ...contexto, estado: "DATOS", errores: {}, error: textoDe(e) };
    }

    await recargarCarrito().catch(() => undefined);
    return { ...contexto, estado: "REVISION", errores: {}, error: null };
};

export const iniciarPago: ProcesarCheckout = async (contexto) => {
    const token = obtenerToken();
    if (!token) return { ...contexto, estado: "REVISION", error: PAGO_FALLIDO };

    let url: string;
    try {
        url = await postIniciarPago(token);
    } catch (e) {
        if (estadoDe(e) === 400) {
            await recargarCarrito().catch(() => undefined);
            return { ...contexto, estado: "DATOS", error: textoDe(e) };
        }
        if (carritoPerdido(e)) olvidarCarrito();
        return { ...contexto, estado: "REVISION", error: PAGO_FALLIDO };
    }

    sessionStorage.setItem(clavePagoEnCurso(codigoStoreViewActivo() ?? ""), token);
    redirigirA(url);
    return { ...contexto, estado: "REDIRIGIENDO", error: null };
};
