export type NuevaAccion = {
    fecha: Date;
    descripcion: string;
    tipo: string;
    estado: "Pendiente" | "En Progreso" | "Completada" | "Cancelada";
    observaciones: string;
    incidencia_id: string;
    tarjeta_id: string;
    responsable_id: string;
    oportunidad_id: string;
    contacto_id: string;
    cliente_id: string;
};