import { Cliente } from "../diseño.ts";

export type EstadoMaestroClientes = "INICIAL" | "CREANDO";

export type ContextoMaestroClientes = {
    estado: EstadoMaestroClientes;
    clientes: Cliente[];
    totalClientes: number;
    activo: Cliente | null;
};