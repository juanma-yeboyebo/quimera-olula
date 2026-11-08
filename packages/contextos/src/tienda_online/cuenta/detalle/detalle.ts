import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { CambioPassword, DatosCuenta, DireccionRegistro } from "../diseño.ts";
import { añadirPedidos, erroresCambioPassword, erroresDatosCuenta, erroresDireccion } from "../dominio.ts";
import {
    deleteDireccion,
    getCuenta,
    getPedidos,
    patchCuenta,
    patchDireccion,
    patchDireccionEnvio,
    patchDireccionFacturacion,
    patchPassword,
    postDireccion,
} from "../infraestructura.ts";
import { ContextoCuenta, EstadoCuenta } from "./diseño.ts";

type ProcesarCuenta = ProcesarContexto<EstadoCuenta, ContextoCuenta>;

export const contextoCuentaInicial: ContextoCuenta = {
    estado: "CARGANDO",
    cuenta: null,
    pedidos: [],
    total: 0,
    pagina: 1,
    errorPedidos: false,
    errorEdicion: null,
    erroresEdicion: {},
};

export const cargarCuenta: ProcesarCuenta = async (contexto) => {
    let cuenta;
    try {
        cuenta = await getCuenta();
    } catch (e) {
        if ((e as { estado?: number })?.estado === 404)
            return { ...contexto, estado: "SIN_CUENTA", cuenta: null };
        return { ...contexto, estado: "ERROR", cuenta: null };
    }

    try {
        const { pedidos, total } = await getPedidos(1);
        return { ...contexto, estado: "LISTA", cuenta, pedidos, total, pagina: 1, errorPedidos: false };
    } catch {
        return { ...contexto, estado: "LISTA", cuenta, pedidos: [], total: 0, pagina: 1, errorPedidos: true };
    }
};

export const verMasPedidos: ProcesarCuenta = async (contexto) => {
    const pagina = contexto.pagina + 1;
    try {
        const { pedidos, total } = await getPedidos(pagina);
        return {
            ...contexto,
            pedidos: añadirPedidos(contexto.pedidos, pedidos),
            total,
            pagina,
            errorPedidos: false,
        };
    } catch {
        return { ...contexto, errorPedidos: true };
    }
};

const ERROR_EDICION = "No se ha podido guardar. Inténtalo de nuevo.";

const ejecutarEdicion = async (
    contexto: ContextoCuenta,
    accion: () => Promise<void>,
): Promise<ContextoCuenta> => {
    const limpio = { ...contexto, estado: "LISTA" as const, errorEdicion: null, erroresEdicion: {} };
    try {
        await accion();
    } catch (e) {
        const descripcion = (e as { descripcion?: string })?.descripcion;
        return { ...limpio, errorEdicion: descripcion || ERROR_EDICION };
    }
    try {
        return { ...limpio, cuenta: await getCuenta() };
    } catch {
        return { ...limpio, errorEdicion: ERROR_EDICION };
    }
};

export const cerrarFormulario: ProcesarCuenta = async (contexto) => ({
    ...contexto,
    errorEdicion: null,
    erroresEdicion: {},
});

export const guardarDatos: ProcesarCuenta = async (contexto, payload) => {
    const datos = payload as DatosCuenta;
    const errores = erroresDatosCuenta(datos);
    if (Object.keys(errores).length > 0)
        return { ...contexto, estado: "LISTA", errorEdicion: null, erroresEdicion: errores };
    return ejecutarEdicion(contexto, () => patchCuenta(datos));
};

export const guardarPassword: ProcesarCuenta = async (contexto, payload) => {
    const cambio = payload as CambioPassword;
    const errores = erroresCambioPassword(cambio);
    if (Object.keys(errores).length > 0)
        return { ...contexto, estado: "LISTA", errorEdicion: null, erroresEdicion: errores };
    return ejecutarEdicion(contexto, () => patchPassword(cambio));
};

export const guardarDireccion: ProcesarCuenta = async (contexto, payload) => {
    const { id, direccion } = payload as { id: string | null; direccion: DireccionRegistro };
    const errores = erroresDireccion(direccion);
    if (Object.keys(errores).length > 0)
        return { ...contexto, estado: "LISTA", errorEdicion: null, erroresEdicion: errores };
    return ejecutarEdicion(contexto, () =>
        id ? patchDireccion(id, direccion) : postDireccion(direccion),
    );
};

export const borrarDireccion: ProcesarCuenta = (contexto, payload) =>
    ejecutarEdicion(contexto, () => deleteDireccion(payload as string));

export const marcarEnvio: ProcesarCuenta = (contexto, payload) =>
    ejecutarEdicion(contexto, () => patchDireccionEnvio(payload as string));

export const marcarFacturacion: ProcesarCuenta = (contexto, payload) =>
    ejecutarEdicion(contexto, () => patchDireccionFacturacion(payload as string));
