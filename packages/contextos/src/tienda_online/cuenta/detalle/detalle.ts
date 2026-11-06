import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { añadirPedidos } from "../dominio.ts";
import { getCuenta, getPedidos } from "../infraestructura.ts";
import { ContextoCuenta, EstadoCuenta } from "./diseño.ts";

type ProcesarCuenta = ProcesarContexto<EstadoCuenta, ContextoCuenta>;

export const contextoCuentaInicial: ContextoCuenta = {
    estado: "CARGANDO",
    cuenta: null,
    pedidos: [],
    total: 0,
    pagina: 1,
    errorPedidos: false,
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
