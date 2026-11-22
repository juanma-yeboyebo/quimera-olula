import { CuentaTienda, ErroresRegistro, PaisTienda, PedidoResumen } from "../diseño.ts";

export type EstadoCuenta = "CARGANDO" | "LISTA" | "GUARDANDO" | "SIN_CUENTA" | "ERROR";

export type ContextoCuenta = {
    estado: EstadoCuenta;
    cuenta: CuentaTienda | null;
    paises: PaisTienda[];
    pedidos: PedidoResumen[];
    total: number;
    pagina: number;
    errorPedidos: boolean;
    errorEdicion: string | null;
    erroresEdicion: ErroresRegistro;
};
