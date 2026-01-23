export type NuevaOportunidadVenta = {
    descripcion: string;
    valor_defecto: boolean;
    probabilidad: string;
    importe?: number;
    estado_id?: string;
    cliente_id: string;
    contacto_id: string;
    fecha_cierre?: string;
    nombre_cliente?: string;
    tarjeta_id: string;
};