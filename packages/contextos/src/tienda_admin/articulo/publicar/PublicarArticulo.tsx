import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import { WebsiteAdmin } from "../../comun/diseño.ts";
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
import "./PublicarArticulo.css";

export const PublicarArticulo = ({
    articulo,
    website,
    publicar,
}: {
    articulo: ArticuloWebDetalle;
    website: WebsiteAdmin;
    publicar: EmitirEvento;
}) => {
    const publicacion = publicacionDeWebsite(articulo, website.id);
    const inicial = useMemo(() => cambiosDePublicacion(publicacion), [publicacion]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaPublicacion, inicial);
    const { intentar } = useContext(ContextoError);
    const [errorSlug, setErrorSlug] = useState<string | null>(null);

    const guardar = useCallback(async () => {
        setErrorSlug(null);
        const ok = await ejecutarConConflicto(
            () => patchPublicacion(articulo.referencia, website.id, modelo),
            intentar,
            (conflicto) => setErrorSlug(conflicto.mensaje),
        );
        if (ok) await publicar("publicacion_guardada");
    }, [articulo.referencia, website.id, modelo, intentar, publicar]);

    const cancelar = useCallback(() => publicar("publicacion_cancelada"), [publicar]);

    const slug = uiProps("slug");

    return (
        <QModal
            abierto={true}
            nombre="publicarArticulo"
            titulo={`Publicación en ${website.nombre}`}
            onCerrar={cancelar}
        >
            <div className="PublicarArticulo">
                <quimera-formulario>
                    <QCheckbox label="En venta" {...uiProps("publicado")} />
                    <QCheckbox label="Visible en el catálogo" {...uiProps("visible")} />
                    <QCheckbox label="Destacado" {...uiProps("destacado")} />
                    <QInput
                        label="Slug"
                        {...slug}
                        erroneo={slug.erroneo || errorSlug !== null}
                        textoValidacion={errorSlug ?? slug.textoValidacion}
                    />
                    <QInput label="Orden" {...uiProps("orden")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={guardar} deshabilitado={!valido || (publicacion !== undefined && !modificado)}>
                        {textoBotonPublicacion(publicacion, website.nombre)}
                    </QBoton>
                    {publicacion && (
                        <QBoton
                            advertencia
                            variante="borde"
                            onClick={() => publicar("quitar_publicacion_solicitada")}
                        >
                            {textoQuitarPublicacion(website.nombre)}
                        </QBoton>
                    )}
                </div>
            </div>
        </QModal>
    );
};
