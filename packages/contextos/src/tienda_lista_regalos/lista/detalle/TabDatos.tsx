import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useMemo } from "react";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import {
    edicionDeLista,
    metaEdicionListaRegalos,
    TEXTO_DIRECCION_PUBLICADA,
    urlConDireccion,
} from "../dominio.ts";
import { guardarDatos } from "./detalle.ts";
import { ContextoDetalleListaRegalos } from "./diseño.ts";

export const TabDatos = ({
    contexto,
    publicar,
}: {
    contexto: ContextoDetalleListaRegalos;
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);
    const inicial = useMemo(() => edicionDeLista(contexto.lista), [contexto.lista]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaEdicionListaRegalos, inicial);

    const guardar = async () => {
        const guardado = await intentar(() => guardarDatos(contexto, modelo)).catch(() => false);
        if (guardado) await publicar("lista_guardada");
    };

    return (
        <div className="TabDatos">
            <quimera-formulario>
                <QInput label="Nombre" {...uiProps("nombre")} />
                <QInput label="Dirección" {...uiProps("direccion")} soloLectura={contexto.lista.publicada} />
                <Cliente {...uiProps("clienteId", "clienteNombre")} />
                <QInput label="Descripción" {...uiProps("descripcion")} />
            </quimera-formulario>
            <p className="TabDatos-direccion">
                {urlConDireccion(contexto.lista, modelo.direccion)}
                {contexto.lista.publicada && (
                    <>
                        <br />
                        {TEXTO_DIRECCION_PUBLICADA}
                    </>
                )}
            </p>
            <div className="botones maestro-botones">
                <QBoton onClick={guardar} deshabilitado={!valido || !modificado}>
                    Guardar
                </QBoton>
            </div>
        </div>
    );
};
