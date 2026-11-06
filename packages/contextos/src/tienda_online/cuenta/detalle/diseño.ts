import { CuentaTienda, PedidoResumen } from "../diseño.ts";

export type EstadoCuenta = "CARGANDO" | "LISTA" | "SIN_CUENTA" | "ERROR";

export type ContextoCuenta = {
    estado: EstadoCuenta;
    cuenta: CuentaTienda | null;
    pedidos: PedidoResumen[];
    total: number;
    pagina: number;
    errorPedidos: boolean;
};
