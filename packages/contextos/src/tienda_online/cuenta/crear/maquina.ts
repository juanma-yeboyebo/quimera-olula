import { Maquina } from "@olula/lib/diseño.ts";
import { cambiarDatos, registrar } from "./crear.ts";
import { ContextoRegistro, EstadoRegistro } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoRegistro, ContextoRegistro> = () => ({
    EDITANDO: {
        datos_cambiados: [cambiarDatos],
        crear: ["REGISTRANDO", registrar],
    },
    REGISTRANDO: {},
    REGISTRADO: {},
    REGISTRADO_SIN_SESION: {},
});
