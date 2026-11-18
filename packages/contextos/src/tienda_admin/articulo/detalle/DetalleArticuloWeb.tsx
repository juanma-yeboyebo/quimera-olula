import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { useEffect } from "react";
import { useWebsites } from "../../comun/website_store.ts";
import { BorrarPublicacionArticulo } from "../borrar/BorrarPublicacionArticulo.tsx";
import { BorrarFotoArticulo } from "../borrar_foto/BorrarFotoArticulo.tsx";
import { ArticuloWebDetalle } from "../diseño.ts";
import { enlaceArticuloErp } from "../dominio.ts";
import { PublicarArticulo } from "../publicar/PublicarArticulo.tsx";
import { contextoDetalleArticuloInicial } from "./detalle.ts";
import "./DetalleArticuloWeb.css";
import { getMaquina } from "./maquina.ts";
import { TabCategorias } from "./TabCategorias.tsx";
import { TabFotos } from "./TabFotos.tsx";
import { TabPublicacion } from "./TabPublicacion.tsx";
import { TabTextos } from "./TabTextos.tsx";

export const DetalleArticuloWeb = ({
    id,
    websiteId,
    publicar = async () => {},
}: {
    id?: string;
    websiteId: number | null;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleArticuloInicial, publicar);
    const websites = useWebsites();

    useEffect(() => {
        emitir("articulo_id_cambiado", { id, websiteId }, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, websiteId]);

    if (!ctx.articulo.id) return null;

    const { articulo } = ctx;
    const websitePublicacion = websites.find((w) => w.id === ctx.websitePublicacion);

    return (
        <Detalle
            id={id}
            obtenerTitulo={(a: ArticuloWebDetalle) => `${a.referencia} · ${a.descripcion}`}
            setEntidad={() => {}}
            entidad={articulo}
            cerrarDetalle={() => emitir("articulo_deseleccionado", null, true)}
        >
            <div className="DetalleArticuloWeb">
                <dl className="DetalleArticuloWeb-erp">
                    <dt>Referencia</dt>
                    <dd>{articulo.referencia}</dd>
                    <dt>Descripción</dt>
                    <dd>{articulo.descripcion}</dd>
                    <dt>Precio</dt>
                    <dd>{formatearMoneda(articulo.precio, "EUR")}</dd>
                </dl>
                <div className="maestro-botones">
                    <QBoton variante="borde" enlace={enlaceArticuloErp(articulo.referencia)}>
                        Ver en el ERP
                    </QBoton>
                </div>
                <Tabs
                    children={[
                        <Tab
                            label="Publicación"
                            key="tab-publicacion"
                            children={
                                <TabPublicacion articulo={articulo} websites={websites} publicar={emitir} />
                            }
                        />,
                        <Tab
                            label="Textos"
                            key="tab-textos"
                            children={<TabTextos articulo={articulo} publicar={emitir} />}
                        />,
                        <Tab
                            label="Categorías"
                            key="tab-categorias"
                            children={
                                <TabCategorias
                                    articulo={articulo}
                                    arbol={ctx.arbol}
                                    publicar={emitir}
                                />
                            }
                        />,
                        <Tab
                            label="Fotos"
                            key="tab-fotos"
                            children={<TabFotos articulo={articulo} publicar={emitir} />}
                        />,
                    ]}
                />
            </div>
            {ctx.estado === "PUBLICANDO" && websitePublicacion && (
                <PublicarArticulo articulo={articulo} website={websitePublicacion} publicar={emitir} />
            )}
            {ctx.estado === "QUITANDO" && websitePublicacion && (
                <BorrarPublicacionArticulo articulo={articulo} website={websitePublicacion} publicar={emitir} />
            )}
            {ctx.estado === "BORRANDO_FOTO" && ctx.fotoActiva && (
                <BorrarFotoArticulo articulo={articulo} foto={ctx.fotoActiva} publicar={emitir} />
            )}
        </Detalle>
    );
};
