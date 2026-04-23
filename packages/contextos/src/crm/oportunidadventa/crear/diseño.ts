export type NuevaOportunidadVenta = {
    descripcion: string;
    probabilidad: number;
    importe?: number;
    estado_id?: string;
    cliente_id: string;
    contacto_id: string;
    // fecha_cierre?: Date;
    nombre_cliente?: string;
    tarjeta_id: string;
};