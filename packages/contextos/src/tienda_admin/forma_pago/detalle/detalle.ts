import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { EdicionFormaPagoTienda, FormaPagoTienda } from "../diseño.ts";
import { cambiosDeEdicion, formaPagoVacia, hayCambios } from "../dominio.ts";
import { getFormaPago, patchFormaPago, postProbarConexion } from "../infraestructura.ts";
import { ContextoDetalleFormaPago, EstadoDetalleFormaPago } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleFormaPago, ContextoDetalleFormaPago>;

export const contextoDetalleFormaPagoInicial: ContextoDetalleFormaPago = {
    estado: "INICIAL",
    forma: formaPagoVacia(),
};

export const refrescarForma: ProcesarDetalle = async (contexto) => {
    const forma = await getFormaPago(contexto.forma.id);
    return [{ ...contexto, forma }, [["forma_pago_cambiada", forma]]];
};

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string | undefined;
    if (!id) return { ...contexto, estado: "INICIAL", forma: formaPagoVacia() };
    const forma = await getFormaPago(id);
    return { ...contexto, estado: "ABIERTO", forma };
};

export const guardarDatos = async (forma: FormaPagoTienda, edicion: EdicionFormaPagoTienda): Promise<boolean> => {
    const cambios = cambiosDeEdicion(forma, edicion);
    if (!hayCambios(cambios)) return false;
    await patchFormaPago(forma.id, cambios);
    return true;
};

export const comprobarConexion = async (forma: FormaPagoTienda): Promise<void> => postProbarConexion(forma.id);
