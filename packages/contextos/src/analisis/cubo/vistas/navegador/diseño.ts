import { Arbol, Cubo, PeticionPivot } from "../../diseño.ts";

export type EstadoNavegador = "CARGANDO" | "SIN_CUBOS" | "NAVEGANDO";

export type ContextoNavegador = {
    estado: EstadoNavegador;
    cubos: Cubo[];
    cubo: Cubo | null;
    peticion: PeticionPivot | null;
    medidasEnColumnas: boolean;
    arbol: Arbol | null;
    truncado: boolean;
};
