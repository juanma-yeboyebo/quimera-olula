import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { FilaMultinivel, QTablaMultinivel } from "@olula/componentes/atomos/qtablamultinivel.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { onGlobalServerSentEvent } from "@olula/lib/api/server_sent_events_session.ts";
import { formatearFechaHora, plugin, puede } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { CodigoMiembro, Cubo, PeticionPivot, Presentacion } from "../../diseño.ts";
import {
    cargaTerminadaDesdeEvento,
    columnasTabla,
    filasTabla,
    medidaDeColumna,
    nivelesCubo,
    ordenTrasPulsar,
} from "../../dominio.ts";
import { getMaquina } from "./maquina.ts";
import { contextoNavegadorInicial } from "./navegador.ts";
import { BotoneraTiempo } from "./BotoneraTiempo.tsx";
import { GestionVistas } from "./GestionVistas.tsx";
import { Grafico } from "./Grafico.tsx";
import "./Navegador.css";
import { OpcionesPivot } from "./OpcionesPivot.tsx";
import { PanelEjes } from "./PanelEjes.tsx";
import { RecargarCubo } from "./RecargarCubo.tsx";

const recargando = (cubo: Cubo) => cubo.estadoCarga?.estado === "pendiente" || cubo.estadoCarga?.estado === "en_curso";

const textoCarga = (cubo: Cubo) => {
    const { ultimaCarga, estadoCarga } = cubo;
    if (recargando(cubo)) return "Recarga en curso";
    const ultima = ultimaCarga ? `Última carga: ${formatearFechaHora(ultimaCarga.fecha)}` : "Sin cargar";
    return estadoCarga?.estado === "error" ? `${ultima} · La última recarga falló` : ultima;
};

export const Navegador = () => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoNavegadorInicial);
    const [cargando, setCargando] = useState(false);
    const [pidiendoRecarga, setPidiendoRecarga] = useState(false);
    const { estado, cubos, cubo, peticion, arbol, presentacion, truncado, historial, vistas, vista } = ctx;
    const { medidasEnColumnas, verGrafico, tipoGrafico } = presentacion;

    const avisoSse = plugin("eventos_sse") === "activo";

    useEffect(() => {
        emitir("iniciado", undefined, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!avisoSse || estado !== "NAVEGANDO") return;
        return onGlobalServerSentEvent("analisis.carga.terminada", (evento) => {
            const carga = cargaTerminadaDesdeEvento(evento.data);
            if (carga) emitir("carga_terminada", carga);
        });
    }, [avisoSse, estado, emitir]);

    if (estado === "SIN_CUBOS") {
        return (
            <div className="analisis-navegador">
                <p className="analisis-vacio">No tienes acceso a ningún cubo de análisis.</p>
            </div>
        );
    }
    if (!cubo || !peticion || !arbol) return <div className="analisis-navegador" aria-busy="true" />;

    const consultar = async (evento: string, payload?: unknown) => {
        setCargando(true);
        try {
            await emitir(evento, payload);
        } finally {
            setCargando(false);
        }
    };

    const cambiar = (nueva: PeticionPivot) => consultar("peticion_cambiada", nueva);
    const presentar = (cambios: Partial<Presentacion>) => emitir("presentacion_cambiada", cambios);
    const medidas = cubo.medidas.filter((m) => peticion.medidas.includes(m.id));
    const niveles = nivelesCubo(cubo);
    const cabeceraEtiqueta =
        peticion.filas.map((ref) => niveles.find((n) => n.ref === ref)?.descripcion ?? ref).join(" / ") || "Total";

    const alternar = (fila: FilaMultinivel) => {
        const codigos = JSON.parse(fila.id) as CodigoMiembro[];
        consultar("nodo_alternado", codigos.map((codigo) => ({ codigo, etiqueta: "" })));
    };

    const ordenar = (columnaId: string) => {
        const medida = medidaDeColumna(columnaId);
        if (medida) cambiar({ ...peticion, orden: ordenTrasPulsar(peticion.orden, medida) });
    };

    const ordenTabla = peticion.orden && medidasEnColumnas
        ? [`${JSON.stringify([])}|${peticion.orden.por}`, peticion.orden.sentido.toUpperCase()]
        : [];

    return (
        <div className="analisis-navegador">
            <header className="analisis-cabecera">
                <QSelect
                    label="Cubo"
                    nombre="cubo"
                    valor={cubo.id}
                    opciones={cubos.map((c) => ({ valor: c.id, descripcion: c.descripcion }))}
                    onChange={(opcion) => opcion && consultar("cubo_cambiado", opcion.valor)}
                />
                <GestionVistas
                    vistas={vistas}
                    vista={vista}
                    emitir={(evento, payload) => consultar(evento, payload)}
                />
                <span className="analisis-carga">{textoCarga(cubo)}</span>
                {recargando(cubo) && !avisoSse && (
                    <QBoton variante="texto" onClick={() => emitir("catalogo_refrescado")}>
                        Actualizar estado
                    </QBoton>
                )}
                {puede("analisis.carga") && !recargando(cubo) && (
                    <QBoton variante="texto" onClick={() => setPidiendoRecarga(true)}>
                        Recargar
                    </QBoton>
                )}
                <QBoton
                    variante="texto"
                    deshabilitado={!historial || historial.posicion === 0}
                    onClick={() => consultar("historial_atras")}
                >
                    Atrás
                </QBoton>
                <QBoton
                    variante="texto"
                    deshabilitado={!historial || historial.posicion === historial.peticiones.length - 1}
                    onClick={() => consultar("historial_adelante")}
                >
                    Adelante
                </QBoton>
                <QBoton variante="texto" onClick={() => presentar({ verGrafico: !verGrafico })}>
                    {verGrafico ? "Ver tabla" : "Ver gráfico"}
                </QBoton>
                <QBoton variante="texto" onClick={() => emitir("exportacion_solicitada")}>
                    Exportar a Excel
                </QBoton>
            </header>
            <aside className="analisis-panel">
                <PanelEjes cubo={cubo} peticion={peticion} onCambio={cambiar} />
                <BotoneraTiempo cubo={cubo} peticion={peticion} onCambio={cambiar} />
                <OpcionesPivot
                    cubo={cubo}
                    peticion={peticion}
                    medidasEnColumnas={medidasEnColumnas}
                    onCambio={cambiar}
                    onAlternarMedidasEnColumnas={() => presentar({ medidasEnColumnas: !medidasEnColumnas })}
                />
            </aside>
            <main className="analisis-resultado">
                {truncado && (
                    <QAviso variante="advertencia">
                        El resultado supera el tope del cubo y se muestra recortado. Filtra o quita niveles para verlo entero.
                    </QAviso>
                )}
                {verGrafico ? (
                    <Grafico
                        arbol={arbol}
                        medida={medidas[0]}
                        peticion={peticion}
                        tipo={tipoGrafico}
                        onTipo={(tipo) => presentar({ tipoGrafico: tipo })}
                    />
                ) : (
                    <QTablaMultinivel
                        cabeceraEtiqueta={cabeceraEtiqueta}
                        columnas={columnasTabla(arbol.columnas, medidas, peticion.columnas.length, medidasEnColumnas)}
                        filas={filasTabla(arbol, medidas, peticion.filas.length, medidasEnColumnas)}
                        orden={ordenTabla}
                        onOrdenar={ordenar}
                        cargando={cargando}
                        onAlternar={alternar}
                    />
                )}
            </main>
            {pidiendoRecarga && (
                <RecargarCubo
                    cubo={cubo}
                    avisoAutomatico={avisoSse}
                    onAceptar={(ejercicios) => {
                        setPidiendoRecarga(false);
                        emitir("recarga_solicitada", ejercicios);
                    }}
                    onCerrar={() => setPidiendoRecarga(false)}
                />
            )}
        </div>
    );
};
