import { Caja } from "#/almacen/comun/componentes/Caja.tsx";
import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { buscarCajaPorTexto, buscarUbicacionPorTexto } from "#/almacen/comun/voz_resolvers.ts";
import { OrdenAlmacen, TipoOrden } from "#/almacen/orden/diseño.ts";
import { IndicadorVoz } from "@olula/componentes/atomos/indicador_voz.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useFlujoVoz } from "@olula/lib/voz/useFlujoVoz.ts";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { registrarLecturaUbicacionOrden } from "../../../infraestructura.ts";
import { getLecturaUbicacionOrdenVacia, getMetaLecturaUbicacionOrden } from "./lectura_ubicacion_orden.ts";
import "./LecturaUbicacionOrden.css";

export const LecturaUbicacionOrden = ({
    publicar,
    orden,
    tipo,
    modoVoz = false,
}: {
    publicar: ProcesarEvento;
    orden: OrdenAlmacen;
    tipo: TipoOrden;
    modoVoz?: boolean;
}) => {
    const { intentar } = useContext(ContextoError);
    const flujoVoz = useFlujoVoz();

    const [lecturaInicial, metaLecturaUbicacionOrden] = useMemo(
        () => [
            getLecturaUbicacionOrdenVacia(orden),
            getMetaLecturaUbicacionOrden(orden.tipo),
        ],
        [orden]
    );

    const { modelo, uiProps, valido, init, set } = useModelo(
        metaLecturaUbicacionOrden,
        lecturaInicial
    );

    const esTraspaso = tipo === "TRASPASO";

    const registrar = useCallback(async () => {
        await intentar(() =>
            registrarLecturaUbicacionOrden(orden.id, {
                idUbicacion: modelo.idUbicacion,
                idUbicacionDestino: esTraspaso
                    ? modelo.idUbicacionDestino
                    : null,
                idCajaDestino: esTraspaso ? modelo.idCajaDestino : null,
            })
        );
        publicar("lectura_registrada");
        init();
    }, [modelo, publicar, orden.id, intentar, init, esTraspaso]);

    const registrarRef = useRef(registrar);
    registrarRef.current = registrar;
    const setRef = useRef(set);
    setRef.current = set;

    // --- Flujo de voz secuencial ---
    useEffect(() => {
        if (!modoVoz || !flujoVoz.soportado) return;

        let cancelado = false;

        const ejecutar = async () => {
            try {
                // 1. Ubicación principal
                const ubi = await flujoVoz.preguntar({
                    instruccion: "Dime la ubicación",
                    tipo: "texto",
                    resolver: async (texto) => {
                        const u = await buscarUbicacionPorTexto(texto);
                        return u ? { id: u.id, codigo: u.codigo } : null;
                    },
                    confirmacion: (v) => `Ubicación ${v.codigo}, ¿correcto?`,
                });
                if (cancelado) return;

                const parcial = { ...lecturaInicial, idUbicacion: ubi.id };

                // 2. Destino (solo traspaso)
                if (esTraspaso) {
                    const ubiDestino = await flujoVoz.preguntar({
                        instruccion: "Dime la ubicación de destino",
                        tipo: "texto",
                        resolver: async (texto) => {
                            const u = await buscarUbicacionPorTexto(texto);
                            return u ? { id: u.id, codigo: u.codigo } : null;
                        },
                        confirmacion: (v) => `Ubicación ${v.codigo}, ¿correcto?`,
                    });
                    if (cancelado) return;
                    parcial.idUbicacionDestino = ubiDestino.id;

                    const cajaDestino = await flujoVoz.preguntar({
                        instruccion: "Dime la caja de destino",
                        tipo: "texto",
                        resolver: async (texto) => {
                            const c = await buscarCajaPorTexto(texto);
                            return c ? { id: c.id, lpn: c.lpn } : null;
                        },
                        confirmacion: (v) => `Caja ${v.lpn}, ¿correcto?`,
                    });
                    if (cancelado) return;
                    parcial.idCajaDestino = cajaDestino.id;
                }

                setRef.current(parcial);
                setTimeout(() => registrarRef.current(), 0);
            } catch (err) {
                if (err instanceof Error && err.message === "cancelado") return;
                console.error("Error en flujo de voz lectura ubicación:", err);
            }
        };

        ejecutar();

        return () => {
            cancelado = true;
            flujoVoz.cancelar();
        };
    }, [modoVoz]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <QModal abierto={true} nombre="lecturaUbicacionOrden" titulo={modoVoz ? "Lectura de ubicación (voz)" : "Lectura de ubicación"} onCerrar={() => { flujoVoz.cancelar(); publicar("lectura_ubicacion_cancelada"); }}>
            <div className="LecturaUbicacionOrden">
                {modoVoz && (
                    <IndicadorVoz
                        estado={flujoVoz.estado}
                        textoReconocido={flujoVoz.textoReconocido}
                        interino={flujoVoz.interino}
                    />
                )}
                <quimera-formulario>
                    <Ubicacion
                        {...uiProps("idUbicacion")}
                        label="Ubicación"
                        nombre="idUbicacion"
                    />
                    {esTraspaso && (
                        <>
                            <Ubicacion
                                {...uiProps("idUbicacionDestino")}
                                label="Ubicación destino"
                                nombre="idUbicacionDestino"
                            />
                            <Caja
                                {...uiProps("idCajaDestino")}
                                label="Caja destino"
                                nombre="idCajaDestino"
                            />
                        </>
                    )}
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={registrar} deshabilitado={!valido}>
                        Registrar
                    </QBoton>
                    <QBoton onClick={() => { flujoVoz.cancelar(); publicar("lectura_ubicacion_cancelada"); }}>
                        Cerrar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
