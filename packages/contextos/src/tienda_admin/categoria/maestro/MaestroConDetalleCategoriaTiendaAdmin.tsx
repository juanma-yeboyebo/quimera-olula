import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect } from "react";
import { SelectorWebsite } from "../../comun/componentes/SelectorWebsite.tsx";
import { useWebsiteActivo } from "../../comun/website_store.ts";
import { CrearCategoria } from "../crear/CrearCategoria.tsx";
import { DetalleCategoria } from "../detalle/DetalleCategoria.tsx";
import { buscarNodo } from "../dominio.ts";
import { MoverCategoria } from "../mover/MoverCategoria.tsx";
import { ArbolCategorias } from "./ArbolCategorias.tsx";
import { contextoMaestroCategoriaInicial } from "./maestro.ts";
import { getMaquina } from "./maquina.ts";
import "./MaestroConDetalleCategoriaTiendaAdmin.css";

export const MaestroConDetalleCategoriaTiendaAdmin = () => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoMaestroCategoriaInicial);
    const websiteId = useWebsiteActivo();
    const { estado, arbol, activa } = ctx;

    useEffect(() => {
        if (websiteId !== null) emitir("website_cambiado", websiteId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [websiteId]);

    const seleccionada = activa ? buscarNodo(arbol, activa) : null;

    return (
        <div className="CategoriaTiendaAdmin">
            <h2>Categorías de la tienda</h2>
            <SelectorWebsite />
            <div className="CategoriaTiendaAdmin-cuerpo">
                <div className="CategoriaTiendaAdmin-arbol">
                    <div className="maestro-botones">
                        <QBoton
                            deshabilitado={websiteId === null}
                            onClick={() => emitir("alta_solicitada", null)}
                        >
                            Nueva categoría
                        </QBoton>
                    </div>
                    <ArbolCategorias
                        arbol={arbol}
                        activa={activa}
                        onSeleccion={(id) => emitir("categoria_seleccionada", id)}
                        onSubir={(id) => emitir("subir_solicitado", id)}
                        onBajar={(id) => emitir("bajar_solicitado", id)}
                        onMover={(id) => emitir("mover_solicitado", id)}
                        onSoltar={(payload) => emitir("categoria_soltada", payload)}
                    />
                </div>
                <div className="CategoriaTiendaAdmin-detalle">
                    <DetalleCategoria
                        categoria={seleccionada ?? undefined}
                        publicar={emitir}
                    />
                </div>
            </div>
            {estado === "CREANDO" && websiteId !== null && (
                <CrearCategoria
                    websiteId={websiteId}
                    padreId={ctx.padreAlta}
                    publicar={emitir}
                />
            )}
            {estado === "MOVIENDO" && ctx.moviendo !== null && (
                <MoverCategoria arbol={arbol} id={ctx.moviendo} publicar={emitir} />
            )}
        </div>
    );
};
