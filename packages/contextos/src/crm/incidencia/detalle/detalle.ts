import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaModelo, publicar } from "@olula/lib/dominio.js";
import { pipe } from "@olula/lib/funcional.js";
import { Incidencia } from "../diseño.ts";
import { getIncidencia, patchIncidencia } from "../infraestructura.ts";
import { ContextoDetalleIncidencia, EstadoDetalleIncidencia } from "./diseño.ts";

export const incidenciaVacia: Incidencia = {
    id: "",
    descripcion: "",
    descripcion_larga: "",
    nombre: "",
    responsable_id: "",
    prioridad: "media",
    fecha: new Date(),
    estado: "nueva",
};

export const metaIncidencia: MetaModelo<Incidencia> = {
    campos: {
        descripcion: { requerido: true },
        responsable_id: { requerido: false },
        descripcion_larga: { requerido: false },
        prioridad: { requerido: true },
        fecha: { requerido: true, tipo: "fecha" },
        estado: { requerido: true, tipo: "selector" },
    },
};

type ProcesarIncidencia = ProcesarContexto<EstadoDetalleIncidencia, ContextoDetalleIncidencia>;

const pipeIncidencia = ejecutarListaProcesos<EstadoDetalleIncidencia, ContextoDetalleIncidencia>;

const conIncidencia = (incidencia: Incidencia) => (ctx: ContextoDetalleIncidencia) => ({ ...ctx, incidencia });
const conEstado = (estado: EstadoDetalleIncidencia) => (ctx: ContextoDetalleIncidencia) => ({ ...ctx, estado });

const cargarIncidencia: (_: string) => ProcesarIncidencia = (id) =>
    async (contexto) => {
        const incidencia = await getIncidencia(id);

        return pipe(
            contexto,
            conIncidencia(incidencia)
        )
    }

export const refrescarIncidencia: ProcesarIncidencia = async (contexto) => {
    const incidencia = await getIncidencia(contexto.incidencia.id);

    return [
        pipe(
            contexto,
            conIncidencia({
                ...contexto.incidencia,
                ...incidencia
            })
        ),
        [["incidencia_cambiada", incidencia]]
    ]
}

export const cancelarCambioIncidencia: ProcesarIncidencia = async (contexto) => {

    return conIncidencia(contexto.inicial)(contexto);
}

export const cambiarIncidencia: ProcesarIncidencia = async (contexto, payload) => {
    const incidencia = payload as Incidencia;
    await patchIncidencia(contexto.incidencia.id, incidencia)

    return pipeIncidencia(contexto, [
        refrescarIncidencia,
        "INICIAL",
    ]);
}

export const onIncidenciaBorrada: ProcesarIncidencia = async (contexto) => {
    const incidencia = contexto.incidencia;

    return pipeIncidencia(contexto, [
        getContextoVacio,
        publicar('incidencia_borrada', incidencia.id)
    ]);
}

export const getContextoVacio: ProcesarIncidencia = async (contexto) => {
    return pipe(
        contexto,
        conEstado("INICIAL"),
        conIncidencia(incidenciaVacia)
    )
}

export const cargarContexto: ProcesarIncidencia = async (contexto, payload) => {
    const id = payload as string;

    if (!id) return getContextoVacio(contexto);

    return pipeIncidencia(
        contexto,
        [cargarIncidencia(id)],
        payload
    );
}
