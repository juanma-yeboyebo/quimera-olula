import { Entidad } from "@olula/lib/diseño.ts";

export interface OportunidadVenta extends Entidad {
    id: string;
    descripcion: string;
    cliente_id: string | null;
    nombre_cliente: string | null;
    importe: number;
    estado_id: string;
    descripcion_estado: string | null;
    probabilidad: number;
    fecha_cierre: string | null;
    contacto_id: string | null;
    nombre_contacto: string | null;
    tarjeta_id: string | null;
    nombre_tarjeta: string | null;
    usuario_id: string | null;
    observaciones: string | null;
    valor_defecto: boolean;
    agente_id: string | null;
};

export type EstadoOportunidad = {
    id: string;
    descripcion: string | null;
    probabilidad: number;
    valor_defecto: boolean;
};