import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { OportunidadVenta } from "./diseño.ts";

export const oportunidadVentaVacia: OportunidadVenta = {
    id: '',
    descripcion: '',
    cliente_id: null,
    nombre_cliente: null,
    importe: 0,
    estado_id: '',
    descripcion_estado: null,
    probabilidad: 0,
    fecha_cierre: null,
    contacto_id: null,
    nombre_contacto: null,
    tarjeta_id: null,
    nombre_tarjeta: null,
    usuario_id: null,
    observaciones: null,
    valor_defecto: false,
    agente_id: null,
};

export const metaOportunidadVenta: MetaModelo<OportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: OportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        importe: { requerido: true, tipo: "moneda" },
        probabilidad: { requerido: true, tipo: "numero" },
        fecha_cierre: { requerido: true, tipo: "fecha" },
        estado_id: { requerido: true, tipo: "selector" },
        cliente_id: { requerido: false, tipo: "autocompletar" },
        responsable_id: { requerido: true, tipo: "autocompletar" },
        nombre_cliente: { requerido: true, validacion: (oportunidad: OportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
    },
};

export const initEstadoOportunidadVenta = (oportunidad: OportunidadVenta): EstadoModelo<OportunidadVenta> =>
    initEstadoModelo(oportunidad);

export const initEstadoOportunidadVentaVacia = () => initEstadoOportunidadVenta(oportunidadVentaVacia);
