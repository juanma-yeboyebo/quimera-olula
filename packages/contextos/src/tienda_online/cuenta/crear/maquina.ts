import { Maquina } from "@olula/lib/diseño.ts";
import { cambiarDatos, cargarPaises, registrar, tocarCampo } from "./crear.ts";
import { ContextoRegistro, EstadoRegistro } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoRegistro, ContextoRegistro> = () => ({
    EDITANDO: {
        datos_cambiados: [cambiarDatos],
        campo_tocado: [tocarCampo],
        cargar_paises: [cargarPaises],
        crear: ["REGISTRANDO", registrar],
    },
    REGISTRANDO: {},
    REGISTRADO: {},
    REGISTRADO_SIN_SESION: {},
});
