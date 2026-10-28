import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { FilaMultinivel, QTablaMultinivel } from "@olula/componentes/atomos/qtablamultinivel.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { formatearFechaHora } from "@olula/lib/dominio.ts";
import { useEffect } from "react";
import { CodigoMiembro, Cubo, PeticionPivot } from "../../diseño.ts";
import { columnasTabla, filasTabla, medidaDeColumna, nivelesCubo, ordenTrasPulsar } from "../../dominio.ts";
import { getMaquina } from "./maquina.ts";
import { contextoNavegadorInicial } from "./navegador.ts";
import "./Navegador.css";
import { OpcionesPivot } from "./OpcionesPivot.tsx";
import { PanelEjes } from "./PanelEjes.tsx";

const textoCarga = (cubo: Cubo) => {
    const { ultimaCarga, estadoCarga } = cubo;
    if (estadoCarga?.estado === "pendiente" || estadoCarga?.estado === "en_curso") return "Recarga en curso";
    const ultima = ultimaCarga ? `Última carga: ${formatearFechaHora(ultimaCarga.fecha)}` : "Sin cargar";
    return estadoCarga?.estado === "error" ? `${ultima} · La última recarga falló` : ultima;
};

export const Navegador = () => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoNavegadorInicial);
    const { estado, cubos, cubo, peticion, arbol, medidasEnColumnas, truncado } = ctx;

    useEffect(() => {
        emitir("iniciado", undefined, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (estado === "SIN_CUBOS") {
        return (
            <div className="analisis-navegador">
                <p className="analisis-vacio">No tienes acceso a ningún cubo de análisis.</p>
            </div>
        );
    }
    if (!cubo || !peticion || !arbol) return <div className="analisis-navegador" aria-busy="true" />;

    const cambiar = (nueva: PeticionPivot) => emitir("peticion_cambiada", nueva);
    const medidas = cubo.medidas.filter((m) => peticion.medidas.includes(m.id));
    const niveles = nivelesCubo(cubo);
    const cabeceraEtiqueta =
        peticion.filas.map((ref) => niveles.find((n) => n.ref === ref)?.descripcion ?? ref).join(" / ") || "Total";

    const alternar = (fila: FilaMultinivel) => {
        const codigos = JSON.parse(fila.id) as CodigoMiembro[];
        emitir("nodo_alternado", codigos.map((codigo) => ({ codigo, etiqueta: "" })));
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
                    onChange={(opcion) => opcion && emitir("cubo_cambiado", opcion.valor)}
                />
                <span className="analisis-carga">{textoCarga(cubo)}</span>
                <QBoton variante="texto" onClick={() => emitir("exportacion_solicitada")}>
                    Exportar a Excel
                </QBoton>
            </header>
            <aside className="analisis-panel">
                <PanelEjes cubo={cubo} peticion={peticion} onCambio={cambiar} />
                <OpcionesPivot
                    cubo={cubo}
                    peticion={peticion}
                    medidasEnColumnas={medidasEnColumnas}
                    onCambio={cambiar}
                    onAlternarMedidasEnColumnas={() => emitir("medidas_en_columnas_alternado")}
                />
            </aside>
            <main className="analisis-resultado">
                {truncado && (
                    <QAviso variante="advertencia">
                        El resultado supera el tope del cubo y se muestra recortado. Filtra o quita niveles para verlo entero.
                    </QAviso>
                )}
                <QTablaMultinivel
                    cabeceraEtiqueta={cabeceraEtiqueta}
                    columnas={columnasTabla(arbol.columnas, medidas, peticion.columnas.length, medidasEnColumnas)}
                    filas={filasTabla(arbol, medidas, peticion.filas.length, medidasEnColumnas)}
                    orden={ordenTabla}
                    onOrdenar={ordenar}
                    onAlternar={alternar}
                />
            </main>
        </div>
    );
};
