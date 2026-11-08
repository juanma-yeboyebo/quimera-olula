import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect, useMemo, useState } from "react";
import { ejecutarConConflicto } from "../../comun/errores.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import {
    cambiosDePublicacion,
    metaPublicacion,
    publicacionDeWebsite,
    textoBotonPublicacion,
    textoQuitarPublicacion,
} from "../dominio.ts";
import { patchPublicacion } from "../infraestructura.ts";
import "./TabPublicacion.css";

export const TabPublicacion = ({
    articulo,
    websiteId,
    nombreWebsite,
    publicar,
}: {
    articulo: ArticuloWebDetalle;
    websiteId: number | null;
    nombreWebsite: string | null;
    publicar: EmitirEvento;
}) => {
    const publicacion = publicacionDeWebsite(articulo, websiteId);
    const inicial = useMemo(() => cambiosDePublicacion(publicacion), [publicacion]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaPublicacion, inicial);
    const { intentar } = useContext(ContextoError);
    const [errorSlug, setErrorSlug] = useState<string | null>(null);

    useEffect(() => {
        setErrorSlug(null);
    }, [publicacion]);

    const guardar = async () => {
        if (websiteId === null) return;
        setErrorSlug(null);
        const ok = await ejecutarConConflicto(
            () => patchPublicacion(articulo.referencia, websiteId, modelo),
            intentar,
            (conflicto) => setErrorSlug(conflicto.mensaje),
        );
        if (ok) await publicar("publicacion_guardada");
    };

    const slug = uiProps("slug");

    return (
        <div className="TabPublicacion">
            <quimera-formulario>
                <QCheckbox label="Publicado" {...uiProps("publicado")} />
                <QCheckbox label="Visible" {...uiProps("visible")} />
                <QCheckbox label="Destacado" {...uiProps("destacado")} />
                <QInput
                    label="Slug"
                    {...slug}
                    erroneo={slug.erroneo || errorSlug !== null}
                    textoValidacion={errorSlug ?? slug.textoValidacion}
                />
                <QInput label="Orden" {...uiProps("orden")} />
            </quimera-formulario>
            {publicacion?.fechaPublicacion && (
                <p className="TabPublicacion-fecha">
                    Publicado el {new Date(publicacion.fechaPublicacion).toLocaleDateString()}
                </p>
            )}
            <div className="botones maestro-botones">
                <QBoton
                    onClick={guardar}
                    deshabilitado={websiteId === null || !valido || (publicacion !== undefined && !modificado)}
                >
                    {textoBotonPublicacion(publicacion, nombreWebsite)}
                </QBoton>
                {publicacion && (
                    <QBoton
                        advertencia
                        variante="borde"
                        onClick={() => publicar("quitar_publicacion_solicitada")}
                    >
                        {textoQuitarPublicacion(nombreWebsite)}
                    </QBoton>
                )}
            </div>
        </div>
    );
};
