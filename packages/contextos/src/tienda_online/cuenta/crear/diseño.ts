import { DatosRegistro, ErroresRegistro, PaisTienda } from "../diseño.ts";

export type EstadoRegistro = "EDITANDO" | "REGISTRANDO" | "REGISTRADO" | "REGISTRADO_SIN_SESION";

export type ContextoRegistro = {
    estado: EstadoRegistro;
    datos: DatosRegistro;
    errores: ErroresRegistro;
    tocados: string[];
    paises: PaisTienda[];
    error: string | null;
    emailRepetido: boolean;
};
