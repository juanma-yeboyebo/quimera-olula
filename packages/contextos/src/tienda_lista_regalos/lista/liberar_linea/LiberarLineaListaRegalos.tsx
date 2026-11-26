import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { LineaListaRegalos, ListaRegalos } from "../diseño.ts";
import { TEXTO_LIBERAR_LINEA } from "../dominio.ts";
import { liberarLineaListaRegalos } from "../infraestructura.ts";

export const LiberarLineaListaRegalos = ({
    lista,
    linea,
    publicar,
}: {
    lista: ListaRegalos;
    linea: LineaListaRegalos;
    publicar: EmitirEvento;
}) => {
    const liberar_ = useCallback(
        async () => {
            await liberarLineaListaRegalos(lista.id, linea.id);
            publicar("linea_liberada", linea.id);
        },
        [lista.id, linea, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("liberacion_de_linea_cancelada"),
        [publicar]
    );

    const [liberar, cancelar] = useForm(liberar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="confirmarLiberarLineaListaRegalos"
            abierto={true}
            titulo={`Liberar "${linea.referencia} · ${linea.descripcion}"`}
            mensaje={TEXTO_LIBERAR_LINEA}
            labelAceptar="Liberar"
            onCerrar={cancelar}
            onAceptar={liberar}
        />
    );
};
