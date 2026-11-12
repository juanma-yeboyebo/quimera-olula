import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { ListaRegalos } from "../diseño.ts";
import {
    metaNuevaLineaListaRegalos,
    nuevaLineaListaRegalosVacia,
    TEXTO_AYUDA_PRECIO,
} from "../dominio.ts";
import { ejecutarConError400 } from "../errores.ts";
import { postLineaListaRegalos } from "../infraestructura.ts";

export const CrearLineaListaRegalos = ({
    lista,
    publicar,
}: {
    lista: ListaRegalos;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(nuevaLineaListaRegalosVacia, []);
    const { modelo, uiProps, valido } = useModelo(metaNuevaLineaListaRegalos, inicial);
    const { intentar } = useContext(ContextoError);
    const [errorArticulo, setErrorArticulo] = useState<string | null>(null);

    const crear = useCallback(async () => {
        setErrorArticulo(null);
        let idLinea = "";
        const ok = await ejecutarConError400(
            async () => {
                idLinea = await postLineaListaRegalos(lista.id, modelo);
            },
            intentar,
            setErrorArticulo,
        );
        if (ok) publicar("linea_creada", idLinea);
    }, [lista.id, modelo, intentar, publicar]);

    const cancelar = useCallback(() => publicar("alta_de_linea_cancelada"), [publicar]);

    const propsArticulo = uiProps("referencia", "descripcion");
    const articulo = {
        ...propsArticulo,
        erroneo: propsArticulo.erroneo || errorArticulo !== null,
        textoValidacion: errorArticulo ?? propsArticulo.textoValidacion,
    };

    return (
        <QModal
            abierto={true}
            nombre="crearLineaListaRegalos"
            titulo="Añadir producto"
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <Articulo {...articulo} />
                <QInput label="Cantidad" {...uiProps("cantidad")} />
                <QInput
                    label="Precio con IVA (opcional)"
                    {...uiProps("precio")}
                    placeholder={TEXTO_AYUDA_PRECIO}
                />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={crear} deshabilitado={!valido}>
                    Añadir
                </QBoton>
            </div>
        </QModal>
    );
};
