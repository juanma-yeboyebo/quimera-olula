import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect, useMemo } from "react";
import { FormaPago } from "#/comun/componentes/formapago.tsx";
import { AvisoSinCuentas } from "../componentes/AvisoSinCuentas.tsx";
import { SelectorCuentaStripe, useCuentasStripe } from "../componentes/SelectorCuentaStripe.tsx";
import { FormaPagoTienda, FormaPagoTiendaDetalle } from "../diseño.ts";
import {
    AVISO_SIN_CONECTAR,
    edicionDeForma,
    esTarjeta,
    estaConectada,
    metaEdicionFormaPago,
    textoTipo,
} from "../dominio.ts";
import { comprobarConexion, contextoDetalleFormaPagoInicial, guardarDatos } from "./detalle.ts";
import "./DetalleFormaPago.css";
import { getMaquina } from "./maquina.ts";

export const DetalleFormaPago = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleFormaPagoInicial, publicar);

    useEffect(() => {
        emitir("forma_pago_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.forma.id) return null;

    return (
        <Detalle
            id={id}
            obtenerTitulo={(f: FormaPagoTienda) => f.nombre}
            obtenerEstado={(f: FormaPagoTienda) => (
                <QEtiqueta variante={esTarjeta(f) ? "exito" : "gris"}>{textoTipo(f.tipo)}</QEtiqueta>
            )}
            setEntidad={() => {}}
            entidad={ctx.forma}
            cerrarDetalle={() => emitir("forma_pago_deseleccionada", null, true)}
        >
            <FormularioFormaPago forma={ctx.forma} publicar={emitir} />
        </Detalle>
    );
};

const FormularioFormaPago = ({ forma, publicar }: { forma: FormaPagoTiendaDetalle; publicar: EmitirEvento }) => {
    const { intentar } = useContext(ContextoError);
    const cuentas = useCuentasStripe();
    const inicial = useMemo(() => edicionDeForma(forma), [forma]);
    const { modelo, uiProps, valido, modificado } = useModelo(metaEdicionFormaPago, inicial);
    const tarjeta = esTarjeta(forma);

    const guardar = async () => {
        const guardado = await intentar(() => guardarDatos(forma, modelo)).catch(() => false);
        if (guardado) await publicar("forma_pago_guardada");
    };

    const comprobar = async () => {
        const ok = await intentar(() => comprobarConexion(forma)).then(() => true).catch(() => false);
        if (ok) await publicar("conexion_comprobada");
    };

    return (
        <div className="DetalleFormaPago">
            <quimera-formulario>
                <QInput label="Código" nombre="codigo" valor={forma.codigo} soloLectura />
                <QInput label="Tipo" nombre="tipo" valor={textoTipo(forma.tipo)} soloLectura />
                <QInput label="Nombre" {...uiProps("nombre")} />
                <QInput label="Descripción" {...uiProps("descripcion")} />
                <FormaPago {...uiProps("codpago")} nombre="codpago" />
                {tarjeta && cuentas !== null && cuentas.length > 0 && (
                    <SelectorCuentaStripe cuentas={cuentas} {...uiProps("credencialId")} />
                )}
                <QInput label="Orden" {...uiProps("orden")} />
                <QCheckbox label="Activa" {...uiProps("activo")} />
            </quimera-formulario>
            {tarjeta && cuentas !== null && cuentas.length === 0 && <AvisoSinCuentas />}
            <div className="botones maestro-botones">
                <QBoton onClick={guardar} deshabilitado={!valido || !modificado}>
                    Guardar
                </QBoton>
            </div>

            {tarjeta && forma.credencial !== null && (
                <section className="DetalleFormaPago-conexion">
                    <h3>Conexión con Stripe</h3>
                    {estaConectada(forma.conexion) ? (
                        <QEtiqueta variante="exito">Conectada</QEtiqueta>
                    ) : (
                        <>
                            <QEtiqueta variante="gris">Sin conectar</QEtiqueta>
                            <QAviso variante="advertencia">{AVISO_SIN_CONECTAR}</QAviso>
                        </>
                    )}
                    <div className="botones maestro-botones">
                        <QBoton variante="borde" onClick={comprobar}>
                            Comprobar conexión
                        </QBoton>
                    </div>
                </section>
            )}
        </div>
    );
};
