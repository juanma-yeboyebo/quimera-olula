import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import {
    metaNuevaListaRegalos,
    nuevaListaRegalosVacia,
    TEXTO_CODIGO_DIRECCION,
    vistaPreviaNuevaDireccion,
} from "../dominio.ts";
import { postListaRegalos } from "../infraestructura.ts";

export const CrearListaRegalos = ({
    websiteId,
    publicar,
}: {
    websiteId: number;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(nuevaListaRegalosVacia, []);

    const { modelo, uiProps, valido } = useModelo(metaNuevaListaRegalos, inicial);

    const crear_ = useCallback(
        async () => {
            const id = await postListaRegalos(websiteId, modelo);
            publicar("lista_creada", id);
        },
        [websiteId, modelo, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("alta_de_lista_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="crearListaRegalos"
            titulo="Nueva lista"
            onCerrar={cancelar}
        >
            <div className="CrearListaRegalos">
                <quimera-formulario>
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QInput label="Dirección" {...uiProps("direccion")} />
                    <QInput label="Fecha" {...uiProps("fecha")} />
                    <Cliente {...uiProps("clienteId", "clienteNombre")} />
                    <QInput label="Descripción (opcional)" {...uiProps("descripcion")} />
                </quimera-formulario>
                <p className="CrearListaRegalos-direccion">
                    {vistaPreviaNuevaDireccion(modelo.direccion)}
                    <br />
                    {TEXTO_CODIGO_DIRECCION}
                </p>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
