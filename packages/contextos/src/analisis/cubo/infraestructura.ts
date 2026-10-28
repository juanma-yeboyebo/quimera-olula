import { RestAPI } from "@olula/lib/api/rest_api.ts";
import AnalisisUrls from "../comun/urls.ts";
import {
    CodigoMiembro,
    Cubo,
    Dimension,
    EstadoCarga,
    FilaPivot,
    GetCatalogo,
    GetMiembros,
    Medida,
    Miembro,
    PostPivot,
    TipoNivel,
} from "./diseño.ts";

const baseUrl = new AnalisisUrls().CUBO;

type DimensionApi = {
    id: string;
    descripcion: string;
    niveles: { id: string; descripcion: string; tipo: TipoNivel | null }[];
    jerarquias: { id: string; niveles: string[] }[];
};

type EstadoCargaApi = {
    id: number;
    estado: EstadoCarga["estado"];
    fecha: string;
    usuario_id: string;
    ejercicios: string[];
    mensaje: string | null;
};

type CuboApi = {
    id: string;
    descripcion: string;
    dimensiones: DimensionApi[];
    medidas: Medida[];
    ultima_carga: { fecha: string; usuario_id: string } | null;
    estado_carga: EstadoCargaApi | null;
};

type PeticionPivotApi = {
    filas: string[];
    columnas: string[];
    medidas: string[];
    filtros: Record<string, (string | null)[]>;
    orden: { por: string; sentido: "asc" | "desc" } | null;
    top: number | null;
    excluir_ceros: boolean;
};

type RespuestaPivotApi = {
    datos: FilaPivot[];
    truncado: boolean;
};

const dimensionDesdeApi = (d: DimensionApi): Dimension => ({
    id: d.id,
    descripcion: d.descripcion,
    niveles: d.niveles.map((n) => ({ ...n, ref: `${d.id}.${n.id}` })),
    jerarquias: d.jerarquias,
});

const cuboDesdeApi = (c: CuboApi): Cubo => ({
    id: c.id,
    descripcion: c.descripcion,
    dimensiones: c.dimensiones.map(dimensionDesdeApi),
    medidas: c.medidas,
    ultimaCarga: c.ultima_carga && {
        fecha: new Date(c.ultima_carga.fecha),
        usuarioId: c.ultima_carga.usuario_id,
    },
    estadoCarga: c.estado_carga && {
        id: c.estado_carga.id,
        estado: c.estado_carga.estado,
        fecha: new Date(c.estado_carga.fecha),
        usuarioId: c.estado_carga.usuario_id,
        ejercicios: c.estado_carga.ejercicios,
        mensaje: c.estado_carga.mensaje,
    },
});

const codigoApi = (codigo: CodigoMiembro) => (codigo === null ? null : String(codigo));

export const getCatalogo: GetCatalogo = async () => {
    const respuesta = await RestAPI.get<{ datos: CuboApi[] }>(baseUrl);
    return respuesta.datos.map(cuboDesdeApi);
};

export const getMiembros: GetMiembros = async (cuboId, nivel, buscar) => {
    const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : "";
    const respuesta = await RestAPI.get<{ datos: Miembro[]; hay_mas: boolean }>(
        `${baseUrl}/${cuboId}/nivel/${nivel}/miembro${query}`
    );
    return { miembros: respuesta.datos, hayMas: respuesta.hay_mas };
};

export const postPivot: PostPivot = async (cuboId, peticion) => {
    const respuesta = await RestAPI.query<PeticionPivotApi, RespuestaPivotApi>(
        `${baseUrl}/${cuboId}/pivot`,
        {
            filas: peticion.filas,
            columnas: peticion.columnas,
            medidas: peticion.medidas,
            filtros: Object.fromEntries(
                Object.entries(peticion.filtros).map(([nivel, codigos]) => [nivel, codigos.map(codigoApi)])
            ),
            orden: peticion.orden,
            top: peticion.top,
            excluir_ceros: peticion.excluirCeros,
        }
    );
    return { filas: respuesta.datos, truncado: respuesta.truncado };
};
