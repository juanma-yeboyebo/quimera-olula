import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import { LineaListaRegalos, ListaRegalos } from "../diseño.ts";
import { cambiosDeLinea, edicionDeLinea, metaEdicionLineaListaRegalos } from "../dominio.ts";
import { ejecutarConError400 } from "../errores.ts";
import { patchLineaListaRegalos } from "../infraestructura.ts";

export const CambiarLineaListaRegalos = ({
    lista,
    linea,
    publicar,
}: {
    lista: ListaRegalos;
    linea: LineaListaRegalos;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(() => edicionDeLinea(linea), [linea]);
    const { modelo, uiProps, valido } = useModelo(metaEdicionLineaListaRegalos, inicial);
    const { intentar } = useContext(ContextoError);
    const [error, setError] = useState<string | null>(null);

    const cambiar = useCallback(async () => {
        setError(null);
        const ok = await ejecutarConError400(
            () => patchLineaListaRegalos(lista.id, linea.id, cambiosDeLinea(modelo)),
            intentar,
            setError,
        );
        if (ok) publicar("linea_cambiada", linea);
    }, [lista.id, linea, modelo, intentar, publicar]);

    const cancelar = useCallback(() => publicar("cambio_de_linea_cancelado"), [publicar]);

    return (
        <QModal
            abierto={true}
            nombre="cambiarLineaListaRegalos"
            titulo={`${linea.referencia} · ${linea.descripcion}`}
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <QInput label="Precio con IVA" {...uiProps("precio")} />
                <QInput label="Cantidad" {...uiProps("cantidad")} />
                <QInput label="Vendidas" {...uiProps("cantidadVendida")} />
            </quimera-formulario>
            {error && (
                <p role="alert" className="CambiarLineaListaRegalos-error">
                    {error}
                </p>
            )}
            <div className="botones maestro-botones">
                <QBoton onClick={cambiar} deshabilitado={!valido}>
                    Guardar
                </QBoton>
            </div>
        </QModal>
    );
};
