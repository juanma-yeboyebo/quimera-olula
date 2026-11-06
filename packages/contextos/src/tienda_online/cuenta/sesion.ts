import { login, logout } from "../../auth/login/dominio.ts";
import { permisosGrupo, whoAmI, whoAmIStorage } from "../../auth/login/infraestructura.ts";
import {
    adoptarToken,
    obtenerToken,
    olvidarCarrito,
    recargarCarrito,
} from "../comun/carrito_store.ts";
import { getCarritoUsuario, postAsociarCarrito } from "./infraestructura.ts";

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

const asociarCarritoLocal = async (token: string): Promise<boolean> => {
    try {
        await postAsociarCarrito(token);
        await recargarCarrito();
        return true;
    } catch (e) {
        if (estadoDe(e) === 404 || estadoDe(e) === 409) {
            olvidarCarrito();
            return false;
        }
        throw e;
    }
};

export const enlazarCarritoTrasLogin = async (): Promise<void> => {
    try {
        const token = obtenerToken();
        if (token && (await asociarCarritoLocal(token))) return;

        const carrito = await getCarritoUsuario();
        if (carrito) await adoptarToken(carrito.token);
    } catch {
        return;
    }
};

export const iniciarSesion = async (email: string, contraseña: string): Promise<boolean> => {
    try {
        await login(email, contraseña);
        const datos = await whoAmI();
        whoAmIStorage.actualizar(datos);
        permisosGrupo.actualizar(datos.permisos);
    } catch {
        return false;
    }
    await enlazarCarritoTrasLogin();
    return true;
};

export const cerrarSesion = async (): Promise<void> => {
    try {
        await logout();
    } finally {
        olvidarCarrito();
    }
};
