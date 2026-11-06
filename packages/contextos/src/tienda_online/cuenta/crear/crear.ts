import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { DatosRegistro } from "../diseño.ts";
import { erroresRegistro, registroAApi } from "../dominio.ts";
import { postRegistro } from "../infraestructura.ts";
import { iniciarSesion } from "../sesion.ts";
import { ContextoRegistro, EstadoRegistro } from "./diseño.ts";

type ProcesarRegistro = ProcesarContexto<EstadoRegistro, ContextoRegistro>;

const ERROR_GENERICO = "No se ha podido crear la cuenta. Inténtalo de nuevo.";

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

export const contextoRegistroInicial = (datos: DatosRegistro): ContextoRegistro => ({
    estado: "EDITANDO",
    datos,
    errores: {},
    error: null,
    emailRepetido: false,
});

export const cambiarDatos: ProcesarRegistro = async (contexto, payload) => ({
    ...contexto,
    datos: payload as DatosRegistro,
    errores: {},
    error: null,
    emailRepetido: false,
});

export const registrar: ProcesarRegistro = async (contexto) => {
    const errores = erroresRegistro(contexto.datos);
    if (Object.keys(errores).length > 0)
        return { ...contexto, estado: "EDITANDO", errores, error: null, emailRepetido: false };

    try {
        await postRegistro(registroAApi(contexto.datos));
    } catch (e) {
        if (estadoDe(e) === 409)
            return { ...contexto, estado: "EDITANDO", errores: {}, error: null, emailRepetido: true };
        const descripcion = (e as { descripcion?: string })?.descripcion;
        return {
            ...contexto,
            estado: "EDITANDO",
            errores: {},
            error: estadoDe(e) === 400 && descripcion ? descripcion : ERROR_GENERICO,
            emailRepetido: false,
        };
    }

    const conSesion = await iniciarSesion(contexto.datos.email, contexto.datos.password);
    return {
        ...contexto,
        estado: conSesion ? "REGISTRADO" : "REGISTRADO_SIN_SESION",
        errores: {},
        error: null,
        emailRepetido: false,
    };
};
