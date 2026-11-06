import { DatosRegistro, ErroresRegistro } from "../diseño.ts";

export type EstadoRegistro = "EDITANDO" | "REGISTRANDO" | "REGISTRADO" | "REGISTRADO_SIN_SESION";

export type ContextoRegistro = {
    estado: EstadoRegistro;
    datos: DatosRegistro;
    errores: ErroresRegistro;
    error: string | null;
    emailRepetido: boolean;
};
