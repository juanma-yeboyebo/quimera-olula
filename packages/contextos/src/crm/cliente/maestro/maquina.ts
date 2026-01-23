import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroClientes, EstadoMaestroClientes } from "./diseño.ts";
import { activarCliente, cambiarClienteEnLista, desactivarClienteActivo, incluirClienteEnLista, quitarClienteDeLista, recargarClientes } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroClientes, ContextoMaestroClientes> = () => {
    return {
        INICIAL: {
            cliente_cambiado: cambiarClienteEnLista,

            cliente_seleccionado: activarCliente,

            cliente_deseleccionado: desactivarClienteActivo,

            cliente_borrado: quitarClienteDeLista,

            recarga_de_clientes_solicitada: recargarClientes,

            creacion_de_cliente_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_cliente_cancelada: "INICIAL",

            cliente_creado: [incluirClienteEnLista, activarCliente, "INICIAL"],
        }
    }
}
