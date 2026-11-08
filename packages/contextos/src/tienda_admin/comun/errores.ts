import { Intentar } from "@olula/lib/contexto.ts";
import { conflictoDeError } from "./dominio.ts";
import { ConflictoApi } from "./diseño.ts";

export const ejecutarConConflicto = async (
    accion: () => Promise<void>,
    intentar: Intentar,
    alConflicto: (conflicto: ConflictoApi) => void,
): Promise<boolean> => {
    try {
        await accion();
        return true;
    } catch (error) {
        const conflicto = conflictoDeError(error);
        if (conflicto) {
            alConflicto(conflicto);
            return false;
        }
        await intentar(() => Promise.reject(error)).catch(() => undefined);
        return false;
    }
};
