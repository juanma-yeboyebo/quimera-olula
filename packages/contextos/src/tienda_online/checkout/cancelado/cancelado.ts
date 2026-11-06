import { obtenerToken, olvidarCarrito, recargarCarrito } from "../../comun/carrito_store.ts";
import { clavePagoEnCurso } from "../dominio.ts";
import { postCancelarPago } from "../infraestructura.ts";

export const cancelarPago = async (codigoStoreView: string): Promise<boolean> => {
    const clave = clavePagoEnCurso(codigoStoreView);
    const token = obtenerToken() ?? sessionStorage.getItem(clave);
    if (!token) return false;

    try {
        await postCancelarPago(token);
    } catch (e) {
        const estado = (e as { estado?: number })?.estado;
        if (estado === 404 || estado === 409) {
            olvidarCarrito();
            sessionStorage.removeItem(clave);
        }
        return false;
    }

    sessionStorage.removeItem(clave);
    await recargarCarrito().catch(() => undefined);
    return true;
};
