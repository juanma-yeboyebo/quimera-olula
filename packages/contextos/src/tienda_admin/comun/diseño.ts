export interface WebsiteAdmin {
    id: number;
    codigo: string;
    nombre: string;
    activo: boolean;
}

export type CampoConflicto = "slug" | "codigo" | null;

export interface ConflictoApi {
    campo: CampoConflicto;
    mensaje: string;
}

export type GetWebsites = () => Promise<WebsiteAdmin[]>;
