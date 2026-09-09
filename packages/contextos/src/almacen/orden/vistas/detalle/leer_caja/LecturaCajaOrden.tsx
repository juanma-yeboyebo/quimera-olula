import { Caja } from "#/almacen/comun/componentes/Caja.tsx";
import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { buscarCajaPorTexto, buscarUbicacionPorTexto } from "#/almacen/comun/voz_resolvers.ts";
import { OrdenAlmacen, TipoOrden } from "#/almacen/orden/diseño.ts";
import { IndicadorVoz } from "@olula/componentes/atomos/indicador_voz.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/index.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useFlujoVoz } from "@olula/lib/voz/useFlujoVoz.ts";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { registrarLecturaCajaOrden } from "../../../infraestructura.ts";
import { getLecturaCajaOrdenVacia, getMetaLecturaCajaOrden } from "./lectura_caja_orden.ts";
import "./LecturaCajaOrden.css";

export const LecturaCajaOrden = ({
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

    const [lecturaInicial, metaLecturaCajaOrden] = useMemo(
        () => [
            getLecturaCajaOrdenVacia(orden),
            getMetaLecturaCajaOrden(orden.tipo),
        ],
        [orden]
    );

    const { modelo, uiProps, valido, init, set } = useModelo(
        metaLecturaCajaOrden,
        lecturaInicial
    );

    const esTraspaso = tipo === "TRASPASO";

    const registrar = useCallback(async () => {
        await intentar(() =>
            registrarLecturaCajaOrden(orden.id, {
                cajaId: modelo.cajaId,
                cajaCompleta: modelo.cajaCompleta,
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
                // 1. Caja
                const caja = await flujoVoz.preguntar({
                    instruccion: "Dime la caja",
                    tipo: "texto",
                    resolver: async (texto) => {
                        const c = await buscarCajaPorTexto(texto);
                        return c ? { id: c.id, lpn: c.lpn } : null;
                    },
                    confirmacion: (v) => `Caja ${v.lpn}, ¿correcto?`,
                });
                if (cancelado) return;

                const parcial = { ...lecturaInicial, cajaId: caja.id };

                // 2. ¿Caja completa?
                const completa = await flujoVoz.preguntar({
                    instruccion: "¿Caja completa?",
                    tipo: "si-no",
                    confirmacion: (v) => v ? "Caja completa, ¿correcto?" : "Caja parcial, ¿correcto?",
                });
                if (cancelado) return;
                parcial.cajaCompleta = completa as boolean;

                // 3. Destino (solo traspaso)
                if (esTraspaso) {
                    const ubi = await flujoVoz.preguntar({
                        instruccion: "Dime la ubicación de destino",
                        tipo: "texto",
                        resolver: async (texto) => {
                            const u = await buscarUbicacionPorTexto(texto);
                            return u ? { id: u.id, codigo: u.codigo } : null;
                        },
                        confirmacion: (v) => `Ubicación ${v.codigo}, ¿correcto?`,
                    });
                    if (cancelado) return;
                    parcial.idUbicacionDestino = ubi.id;

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
                console.error("Error en flujo de voz lectura caja:", err);
            }
        };

        ejecutar();

        return () => {
            cancelado = true;
            flujoVoz.cancelar();
        };
    }, [modoVoz]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <QModal abierto={true} nombre="lecturaCajaOrden" titulo={modoVoz ? "Lectura de caja (voz)" : "Lectura de caja"} onCerrar={() => { flujoVoz.cancelar(); publicar("lectura_caja_cancelada"); }}>
            <div className="LecturaCajaOrden">
                {modoVoz && (
                    <IndicadorVoz
                        estado={flujoVoz.estado}
                        textoReconocido={flujoVoz.textoReconocido}
                        interino={flujoVoz.interino}
                    />
                )}
                <quimera-formulario>
                    <Caja
                        {...uiProps("cajaId")}
                        label="Caja"
                        nombre="cajaId"
                    />
                    <QInput label="Caja completa" {...uiProps("cajaCompleta")} />
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
                </div>
            </div>
        </QModal>
    );
};
