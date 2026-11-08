import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect, useMemo, useState } from "react";
import { ejecutarConConflicto } from "../../comun/errores.ts";
import { BorrarCategoria } from "../borrar/BorrarCategoria.tsx";
import { NodoCategoria } from "../diseño.ts";
import { distintivosCategoria, edicionDeCategoria, metaEdicionCategoria, motivoNoBorrable } from "../dominio.ts";
import { contextoDetalleCategoriaInicial, guardarCategoria } from "./detalle.ts";
import "./DetalleCategoria.css";
import { getMaquina } from "./maquina.ts";

export const DetalleCategoria = ({
    categoria,
    publicar = async () => {},
}: {
    categoria?: NodoCategoria;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleCategoriaInicial, publicar);
    const { intentar } = useContext(ContextoError);
    const [errorSlug, setErrorSlug] = useState<string | null>(null);

    const inicial = useMemo(() => edicionDeCategoria(ctx.categoria), [ctx.categoria]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaEdicionCategoria, inicial);

    useEffect(() => {
        setErrorSlug(null);
        emitir("categoria_cambiada", categoria ?? null, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoria]);

    if (!ctx.categoria.id) return null;

    const guardar = async () => {
        setErrorSlug(null);
        const ok = await ejecutarConConflicto(
            async () => {
                await guardarCategoria(ctx, modelo);
            },
            intentar,
            (conflicto) => setErrorSlug(conflicto.mensaje),
        );
        if (ok) await emitir("categoria_guardada");
    };

    const motivo = motivoNoBorrable(ctx.categoria);
    const slug = uiProps("slug");

    return (
        <Detalle
            id={ctx.categoria.id}
            obtenerTitulo={(c: NodoCategoria) => c.nombre}
            setEntidad={() => {}}
            entidad={ctx.categoria}
            cerrarDetalle={() => emitir("cierre_solicitado")}
        >
            <div className="DetalleCategoria">
                <div className="maestro-botones">
                    <QBoton onClick={() => emitir("subcategoria_solicitada")}>
                        Añadir subcategoría
                    </QBoton>
                    <QBoton
                        advertencia
                        deshabilitado={motivo !== null}
                        onClick={() => emitir("borrar_solicitado")}
                    >
                        Borrar
                    </QBoton>
                </div>
                {motivo && <p className="DetalleCategoria-motivo">{motivo}</p>}
                <quimera-formulario>
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QInput
                        label="Slug"
                        {...slug}
                        erroneo={slug.erroneo || errorSlug !== null}
                        textoValidacion={errorSlug ?? slug.textoValidacion}
                    />
                    <QCheckbox label="Visible en la tienda" {...uiProps("visible")} />
                    <QCheckbox
                        label="Mostrar en el menú"
                        {...uiProps("enMenu")}
                        deshabilitado={!modelo.visible}
                    />
                </quimera-formulario>
                <dl className="DetalleCategoria-datos">
                    <dt>Código</dt>
                    <dd>{ctx.categoria.codigo}</dd>
                    <dt>Artículos</dt>
                    <dd>{ctx.categoria.articulos}</dd>
                    {distintivosCategoria(ctx.categoria).length > 0 && (
                        <>
                            <dt>Estado</dt>
                            <dd>{distintivosCategoria(ctx.categoria).join(", ")}</dd>
                        </>
                    )}
                </dl>
                <div className="botones maestro-botones">
                    <QBoton onClick={guardar} deshabilitado={!valido || !modificado}>
                        Guardar
                    </QBoton>
                </div>
            </div>
            {ctx.estado === "BORRANDO" && (
                <BorrarCategoria categoria={ctx.categoria} publicar={emitir} />
            )}
        </Detalle>
    );
};
