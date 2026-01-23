import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { Contacto } from "../diseño.ts";
import { getContactos } from "../infraestructura.ts";
import { ContextoMaestroContactos, EstadoMaestroContactos } from "./diseño.ts";

export const metaTablaContacto: MetaTabla<Contacto> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
    { id: "telefono1", cabecera: "Teléfono" },
];

type ProcesarContactos = ProcesarContexto<EstadoMaestroContactos, ContextoMaestroContactos>;

// const conEstado = (estado: EstadoMaestroContactos) => (ctx: ContextoMaestroContactos) => ({ ...ctx, estado });
const conContactos = (contactos: Contacto[]) => (ctx: ContextoMaestroContactos) => ({ ...ctx, contactos });
const conTotal = (totalContactos: number) => (ctx: ContextoMaestroContactos) => ({ ...ctx, totalContactos });
const conActivo = (activo: Contacto | null) => (ctx: ContextoMaestroContactos) => ({ ...ctx, activo });

export const recargarContactos: ProcesarContactos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: contactos, total } = await getContactos(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conContactos(contactos),
        conTotal(total === -1 ? contexto.totalContactos : total),
        conActivo(contexto.activo
            ? contactos.find(contacto => contacto.id === contexto.activo?.id) ?? null
            : null)
    )
}

export const incluirContactoEnLista: ProcesarContactos = async (contexto, payload) => {
    const contacto = payload as Contacto;

    return pipe(
        contexto,
        conContactos([contacto, ...contexto.contactos])
    )
}

export const activarContacto: ProcesarContactos = async (contexto, payload) => {
    const activo = payload as Contacto;

    return pipe(
        contexto,
        conActivo(activo)
    )
}

export const desactivarContactoActivo: ProcesarContactos = async (contexto) => {
    return pipe(
        contexto,
        conActivo(null)
    )
}

export const cambiarContactoEnLista: ProcesarContactos = async (contexto, payload) => {
    const contacto = payload as Contacto;

    return pipe(
        contexto,
        conContactos(contexto.contactos.map(item => item.id === contacto.id ? contacto : item))
    )
}

export const quitarContactoDeLista: ProcesarContactos = async (contexto, payload) => {
    const idBorrado = payload as string;

    return pipe(
        contexto,
        conContactos(contexto.contactos.filter(contacto => contacto.id !== idBorrado)),
        conActivo(null)
    )
}
