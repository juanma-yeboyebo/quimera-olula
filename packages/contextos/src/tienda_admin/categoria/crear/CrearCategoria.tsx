import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { ConflictoApi } from "../../comun/diseño.ts";
import { ejecutarConConflicto } from "../../comun/errores.ts";
import { metaNuevaCategoria, nuevaCategoriaVacia } from "../dominio.ts";
import { postCategoria } from "../infraestructura.ts";
import "./CrearCategoria.css";

export const CrearCategoria = ({
    websiteId,
    padreId,
    publicar,
}: {
    websiteId: number;
    padreId: string | null;
    publicar: EmitirEvento;
}) => {
    const { modelo, uiProps, valido } = useModelo(metaNuevaCategoria, nuevaCategoriaVacia);
    const { intentar } = useContext(ContextoError);
    const [conflicto, setConflicto] = useState<ConflictoApi | null>(null);
    const focus = useFocus();

    const crear = useCallback(async () => {
        setConflicto(null);
        let id = "";
        const ok = await ejecutarConConflicto(
            async () => {
                id = await postCategoria(websiteId, padreId, modelo);
            },
            intentar,
            setConflicto,
        );
        if (ok) publicar("categoria_creada", id);
    }, [websiteId, padreId, modelo, intentar, publicar]);

    const cancelar = useCallback(() => publicar("alta_cancelada"), [publicar]);

    const codigo = uiProps("codigo");
    const slug = uiProps("slug");
    const errorEn = (campo: "codigo" | "slug") => (conflicto?.campo === campo ? conflicto.mensaje : null);

    return (
        <QModal
            abierto={true}
            nombre="crearCategoria"
            titulo={padreId === null ? "Nueva categoría" : "Nueva subcategoría"}
            onCerrar={cancelar}
        >
            <div className="CrearCategoria">
                <quimera-formulario>
                    <QInput
                        label="Código"
                        {...codigo}
                        ref={focus}
                        erroneo={codigo.erroneo || errorEn("codigo") !== null}
                        textoValidacion={errorEn("codigo") ?? codigo.textoValidacion}
                    />
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QInput
                        label="Slug (opcional)"
                        {...slug}
                        erroneo={slug.erroneo || errorEn("slug") !== null}
                        textoValidacion={errorEn("slug") ?? slug.textoValidacion}
                    />
                    <QCheckbox label="Visible en la tienda" {...uiProps("visible")} />
                    <QCheckbox
                        label="Mostrar en el menú"
                        {...uiProps("enMenu")}
                        deshabilitado={!modelo.visible}
                    />
                </quimera-formulario>
                {conflicto && conflicto.campo === null && (
                    <p role="alert" className="CrearCategoria-error">
                        {conflicto.mensaje}
                    </p>
                )}
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
