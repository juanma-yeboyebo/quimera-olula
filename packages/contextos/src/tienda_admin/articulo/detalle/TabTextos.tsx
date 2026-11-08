import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useMemo } from "react";
import { textoContador } from "../../comun/dominio.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import {
    MAXIMO_DESCRIPCION_CORTA,
    MAXIMO_META_DESCRIPCION,
    MAXIMO_META_TITULO,
    metaTextos,
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
    const inicial = useMemo(() => textosDeArticulo(articulo), [articulo]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaTextos, inicial);

    const guardar = async () => {
        await patchTextos(articulo.referencia, modelo);
        await publicar("textos_guardados");
    };

    return (
        <div className="TabTextos">
            <quimera-formulario>
                <QInput label="Descripción corta" {...uiProps("descripcionCorta")} />
                <small id="contador-descripcionCorta">
                    {textoContador(modelo.descripcionCorta, MAXIMO_DESCRIPCION_CORTA)}
                </small>
                <QTextArea label="Descripción larga" rows={8} {...uiProps("descripcionLarga")} />
                <small id="contador-descripcionLarga">{textoContador(modelo.descripcionLarga)}</small>
                <QInput label="Título SEO" {...uiProps("metaTitulo")} />
                <small id="contador-metaTitulo">
                    {textoContador(modelo.metaTitulo, MAXIMO_META_TITULO)}
                </small>
                <QTextArea label="Descripción SEO" rows={3} {...uiProps("metaDescripcion")} />
                <small id="contador-metaDescripcion">
                    {textoContador(modelo.metaDescripcion, MAXIMO_META_DESCRIPCION)}
                </small>
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={guardar} deshabilitado={!valido || !modificado}>
                    Guardar
                </QBoton>
            </div>
        </div>
    );
};
