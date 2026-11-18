import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useMemo, useState } from "react";
import { textoContador } from "../../comun/dominio.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import {
    AVISO_TEXTOS_IDIOMA,
    IDIOMA_POR_DEFECTO,
    MAXIMO_DESCRIPCION_CORTA,
    MAXIMO_META_DESCRIPCION,
    MAXIMO_META_TITULO,
    MAXIMO_NOMBRE,
    metaTextos,
    opcionesIdioma,
    sugerenciasTextos,
    textosDeArticulo,
} from "../dominio.ts";
import { patchTextos } from "../infraestructura.ts";
import "./TabTextos.css";

export const TabTextos = ({
    articulo,
    publicar,
}: {
    articulo: ArticuloWebDetalle;
    publicar: EmitirEvento;
}) => {
    const [idioma, setIdioma] = useState(IDIOMA_POR_DEFECTO);
    const [idiomaPendiente, setIdiomaPendiente] = useState<string | null>(null);
    const inicial = useMemo(() => textosDeArticulo(articulo, idioma), [articulo, idioma]);
    const sugerencias = useMemo(() => sugerenciasTextos(articulo, idioma), [articulo, idioma]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaTextos, inicial);

    const guardar = async () => {
        await patchTextos(articulo.referencia, idioma, modelo);
        await publicar("textos_guardados");
    };

    const elegirIdioma = (nuevo: string) => {
        if (nuevo === idioma) return;
        if (modificado) setIdiomaPendiente(nuevo);
        else setIdioma(nuevo);
    };

    const confirmarIdioma = () => {
        if (idiomaPendiente !== null) setIdioma(idiomaPendiente);
        setIdiomaPendiente(null);
    };

    return (
        <div className="TabTextos">
            <quimera-formulario>
                <QSelect
                    label="Idioma"
                    nombre="idioma"
                    valor={idioma}
                    opciones={opcionesIdioma(articulo.idiomas)}
                    onChange={(opcion) => elegirIdioma(opcion?.valor ?? IDIOMA_POR_DEFECTO)}
                />
                {idioma !== IDIOMA_POR_DEFECTO && <small id="aviso-idioma">{AVISO_TEXTOS_IDIOMA}</small>}
                <QInput label="Nombre en la tienda" {...uiProps("nombre")} placeholder={sugerencias.nombre} />
                <small id="contador-nombre">{textoContador(modelo.nombre, MAXIMO_NOMBRE)}</small>
                <QInput
                    label="Descripción corta"
                    {...uiProps("descripcionCorta")}
                    placeholder={sugerencias.descripcionCorta}
                />
                <small id="contador-descripcionCorta">
                    {textoContador(modelo.descripcionCorta, MAXIMO_DESCRIPCION_CORTA)}
                </small>
                <QTextArea
                    label="Descripción larga"
                    rows={8}
                    {...uiProps("descripcionLarga")}
                    placeholder={sugerencias.descripcionLarga}
                />
                <small id="contador-descripcionLarga">{textoContador(modelo.descripcionLarga)}</small>
                <QInput label="Título SEO" {...uiProps("metaTitulo")} placeholder={sugerencias.metaTitulo} />
                <small id="contador-metaTitulo">
                    {textoContador(modelo.metaTitulo, MAXIMO_META_TITULO)}
                </small>
                <QTextArea
                    label="Descripción SEO"
                    rows={3}
                    {...uiProps("metaDescripcion")}
                    placeholder={sugerencias.metaDescripcion}
                />
                <small id="contador-metaDescripcion">
                    {textoContador(modelo.metaDescripcion, MAXIMO_META_DESCRIPCION)}
                </small>
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={guardar} deshabilitado={!valido || !modificado}>
                    Guardar
                </QBoton>
            </div>
            {idiomaPendiente !== null && (
                <QModalConfirmacion
                    nombre="cambiarIdiomaTextos"
                    abierto={true}
                    titulo="Cambios sin guardar"
                    mensaje="Si cambias de idioma perderás los cambios sin guardar. ¿Continuar?"
                    onCerrar={() => setIdiomaPendiente(null)}
                    onAceptar={confirmarIdioma}
                />
            )}
        </div>
    );
};
