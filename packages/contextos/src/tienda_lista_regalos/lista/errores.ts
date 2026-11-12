import { Intentar } from "@olula/lib/contexto.ts";
import { mensajeError400 } from "./dominio.ts";

export const ejecutarConError400 = async (
    accion: () => Promise<void>,
    intentar: Intentar,
    alError400: (mensaje: string) => void,
): Promise<boolean> => {
    try {
        await accion();
        return true;
    } catch (error) {
        const mensaje = mensajeError400(error);
        if (mensaje !== null) {
            alError400(mensaje);
            return false;
        }
        await intentar(() => Promise.reject(error)).catch(() => undefined);
        return false;
    }
};
