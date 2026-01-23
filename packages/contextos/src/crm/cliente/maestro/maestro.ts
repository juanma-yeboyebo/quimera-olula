import { Criteria, Entidad, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { Cliente } from "../diseño.ts";
import { getClientes } from "../infraestructura.ts";
import { ContextoMaestroClientes, EstadoMaestroClientes } from "./diseño.ts";

export const metaTablaCliente = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    {
        id: "id_fiscal",
        cabecera: "Id Fiscal",
        render: (entidad: Entidad) =>
            `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
    },
    { id: "telefono1", cabecera: "Teléfono" },
    { id: "email", cabecera: "Email" },
];

type ProcesarClientes = ProcesarContexto<EstadoMaestroClientes, ContextoMaestroClientes>;

// const conEstado = (estado: EstadoMaestroClientes) => (ctx: ContextoMaestroClientes) => ({ ...ctx, estado });
const conClientes = (clientes: Cliente[]) => (ctx: ContextoMaestroClientes) => ({ ...ctx, clientes });
const conTotal = (totalClientes: number) => (ctx: ContextoMaestroClientes) => ({ ...ctx, totalClientes });
const conActivo = (activo: Cliente | null) => (ctx: ContextoMaestroClientes) => ({ ...ctx, activo });

export const recargarClientes: ProcesarClientes = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: clientes, total } = await getClientes(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conClientes(clientes),
        conTotal(total === -1 ? contexto.totalClientes : total),
        conActivo(contexto.activo
            ? clientes.find(cliente => cliente.id === contexto.activo?.id) ?? null
            : null)
    )
}

export const incluirClienteEnLista: ProcesarClientes = async (contexto, payload) => {
    const cliente = payload as Cliente;

    return pipe(
        contexto,
        conClientes([cliente, ...contexto.clientes])
    )
}

export const activarCliente: ProcesarClientes = async (contexto, payload) => {
    const activo = payload as Cliente;

    return pipe(
        contexto,
        conActivo(activo)
    )
}

export const desactivarClienteActivo: ProcesarClientes = async (contexto) => {
    return pipe(
        contexto,
        conActivo(null)
    )
}

export const cambiarClienteEnLista: ProcesarClientes = async (contexto, payload) => {
    const cliente = payload as Cliente;

    return pipe(
        contexto,
        conClientes(contexto.clientes.map(item => item.id === cliente.id ? cliente : item))
    )
}

export const quitarClienteDeLista: ProcesarClientes = async (contexto, payload) => {
    const idBorrado = payload as string;

    return pipe(
        contexto,
        conClientes(contexto.clientes.filter(cliente => cliente.id !== idBorrado)),
        conActivo(null)
    )
}
