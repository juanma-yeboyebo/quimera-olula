import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getIdUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { SelectorWebsite } from "../../comun/componentes/SelectorWebsite.tsx";
import { useWebsiteActivo } from "../../comun/website_store.ts";
import { CrearFormaPago } from "../crear/CrearFormaPago.tsx";
import { DetalleFormaPago } from "../detalle/DetalleFormaPago.tsx";
import { FormaPagoTienda } from "../diseño.ts";
import { esTarjeta, textoCuenta, textoTipo } from "../dominio.ts";
import "./MaestroConDetalleFormaPago.css";
import { getMaquina } from "./maquina.ts";

const Distintivos = ({ forma }: { forma: FormaPagoTienda }) => (
    <span className="FormaPago-distintivos">
        <QEtiqueta variante={esTarjeta(forma) ? "exito" : "gris"}>{textoTipo(forma.tipo)}</QEtiqueta>
        {!forma.activo && <QEtiqueta variante="gris">Inactiva</QEtiqueta>}
    </span>
);

const metaTablaFormaPago: MetaTabla<FormaPagoTienda> = [
    { id: "nombre", cabecera: "Nombre", estilo: "destacado" },
    { id: "codigo", cabecera: "Código" },
    { id: "tipo", cabecera: "Tipo", render: (f: FormaPagoTienda) => <Distintivos forma={f} /> },
    { id: "credencial", cabecera: "Cuenta de Stripe", render: (f: FormaPagoTienda) => textoCuenta(f) ?? "" },
];

const TarjetaFormaPago = (forma: FormaPagoTienda) => (
    <div className="FormaPago-tarjeta" key={forma.id}>
        <div className="FormaPago-tarjeta-fila">
            <strong>{forma.nombre}</strong>
            <Distintivos forma={forma} />
        </div>
        <div className="FormaPago-tarjeta-fila">
            <span>{forma.codigo}</span>
            <span>{textoCuenta(forma)}</span>
        </div>
    </div>
);

export const MaestroConDetalleFormaPago = () => {
    const id = getIdUrlParams();

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        formas: listaActivaEntidadesInicial<FormaPagoTienda>(id, criteriaDefecto),
        websiteId: null,
    });

    const { estado, formas } = ctx;
    const websiteId = useWebsiteActivo();

    useUrlParams(formas.activo, formas.criteria);

    useEffect(() => {
        if (websiteId !== null) emitir("website_cambiado", websiteId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [websiteId]);

    return (
        <div className="FormaPago">
            <MaestroDetalle<FormaPagoTienda>
                Maestro={
                    <>
                        <h2>Formas de pago</h2>
                        <SelectorWebsite />
                        <Listado<FormaPagoTienda>
                            metaTabla={metaTablaFormaPago}
                            mostrarFiltros={false}
                            criteria={formas.criteria}
                            modoInicial="tarjetas"
                            tarjeta={TarjetaFormaPago}
                            entidades={formas.lista}
                            totalEntidades={formas.total}
                            seleccionada={formas.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton
                                        deshabilitado={websiteId === null}
                                        onClick={() => emitir("crear_forma_pago_solicitado")}
                                    >
                                        Nueva forma de pago
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("forma_pago_seleccionada", payload)}
                            onCriteriaChanged={() => undefined}
                        />
                    </>
                }
                Detalle={<DetalleFormaPago id={formas.activo} publicar={emitir} />}
                seleccionada={formas.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "CREANDO" && websiteId !== null && (
                <CrearFormaPago websiteId={websiteId} publicar={emitir} />
            )}
        </div>
    );
};
