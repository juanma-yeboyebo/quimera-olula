import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useEffect } from "react";
import { BorrarListaRegalos } from "../borrar/BorrarListaRegalos.tsx";
import { ListaRegalos } from "../diseño.ts";
import { distintivoPublicacion } from "../dominio.ts";
import { contextoDetalleListaRegalosInicial } from "./detalle.ts";
import "./DetalleListaRegalos.css";
import { LineasListaRegalos } from "./lineas/LineasListaRegalos.tsx";
import { getMaquina } from "./maquina.ts";
import { TabCompartir } from "./TabCompartir.tsx";
import { TabDatos } from "./TabDatos.tsx";

export const DetalleListaRegalos = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleListaRegalosInicial, publicar);

    useEffect(() => {
        emitir("lista_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.lista.id) return null;

    const { lista, lineas, estado } = ctx;

    return (
        <Detalle
            id={id}
            obtenerTitulo={(l: ListaRegalos) => l.nombre}
            obtenerEstado={(l: ListaRegalos) => (
                <QEtiqueta variante={l.publicada ? "exito" : "gris"}>
                    {distintivoPublicacion(l.publicada)}
                </QEtiqueta>
            )}
            setEntidad={() => {}}
            entidad={lista}
            cerrarDetalle={() => emitir("lista_deseleccionada", null, true)}
        >
            <div className="DetalleListaRegalos">
                <div className="maestro-botones">
                    <QuimeraAcciones
                        acciones={[
                            {
                                icono: "eliminar",
                                texto: "Borrar",
                                onClick: () => emitir("borrado_solicitado"),
                                advertencia: true,
                            },
                        ]}
                        vertical
                    />
                </div>
                <Tabs
                    children={[
                        <Tab
                            key="tab-datos"
                            label="Datos"
                            children={<TabDatos contexto={ctx} publicar={emitir} />}
                        />,
                        <Tab
                            key="tab-productos"
                            label="Productos"
                            children={
                                <LineasListaRegalos
                                    lista={lista}
                                    lineas={lineas}
                                    estado={estado}
                                    publicar={emitir}
                                />
                            }
                        />,
                        <Tab
                            key="tab-compartir"
                            label="Compartir"
                            children={<TabCompartir lista={lista} />}
                        />,
                    ]}
                />
            </div>

            {estado === "BORRANDO" && <BorrarListaRegalos lista={lista} publicar={emitir} />}
        </Detalle>
    );
};
