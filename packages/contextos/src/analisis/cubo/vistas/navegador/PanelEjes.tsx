import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { DragEvent, ReactNode, useState } from "react";
import { CodigoMiembro, Cubo, Nivel, PeticionPivot } from "../../diseño.ts";
import { cambiarFiltro, Eje, moverNivel, nivelesCubo } from "../../dominio.ts";
import { FiltroNivel } from "./FiltroNivel.tsx";

type PanelEjesProps = {
    cubo: Cubo;
    peticion: PeticionPivot;
    onCambio: (peticion: PeticionPivot) => void;
};

const TIPO_ARRASTRE = "application/x-olula-nivel";

const permitirSoltar = (evento: DragEvent) => {
    if (evento.dataTransfer.types.includes(TIPO_ARRASTRE)) evento.preventDefault();
};

const useEncima = () => {
    const [encima, setEncima] = useState(false);
    return {
        encima,
        props: {
            onDragOver: (evento: DragEvent) => {
                permitirSoltar(evento);
                setEncima(true);
            },
            onDragLeave: () => setEncima(false),
        },
        salir: () => setEncima(false),
    };
};

type FichaNivelProps = {
    nivel: Nivel;
    filtrados: number;
    onFiltrar: () => void;
    onSoltarDelante: (ref: string) => void;
};

const FichaNivel = ({ nivel, filtrados, onFiltrar, onSoltarDelante }: FichaNivelProps) => {
    const { encima, props, salir } = useEncima();

    return (
        <div
            className={`analisis-ficha${encima ? " encima" : ""}`}
            draggable
            onDragStart={(evento) => {
                evento.dataTransfer.setData(TIPO_ARRASTRE, nivel.ref);
                evento.dataTransfer.effectAllowed = "move";
            }}
            {...props}
            onDrop={(evento) => {
                evento.preventDefault();
                evento.stopPropagation();
                salir();
                onSoltarDelante(evento.dataTransfer.getData(TIPO_ARRASTRE));
            }}
        >
            <span>{nivel.descripcion}</span>
            <button
                type="button"
                className={filtrados > 0 ? "con-filtro" : ""}
                title={`Filtrar ${nivel.descripcion}`}
                onClick={onFiltrar}
            >
                <QIcono nombre="filtro" tamaño="xs" />
                {filtrados > 0 && filtrados}
            </button>
        </div>
    );
};

type ZonaEjeProps = {
    titulo: string;
    onSoltar: (ref: string) => void;
    children: ReactNode;
};

const ZonaEje = ({ titulo, onSoltar, children }: ZonaEjeProps) => {
    const { encima, props, salir } = useEncima();

    return (
        <section
            className={`analisis-zona${encima ? " encima" : ""}`}
            {...props}
            onDrop={(evento) => {
                evento.preventDefault();
                salir();
                onSoltar(evento.dataTransfer.getData(TIPO_ARRASTRE));
            }}
        >
            <h3>{titulo}</h3>
            <div className="analisis-zona-fichas">{children}</div>
        </section>
    );
};

export const PanelEjes = ({ cubo, peticion, onCambio }: PanelEjesProps) => {
    const [filtrando, setFiltrando] = useState<Nivel | null>(null);
    const niveles = nivelesCubo(cubo);
    const enEjes = [...peticion.filas, ...peticion.columnas];

    const ejeDe = (ref: string): Eje | null =>
        peticion.filas.includes(ref) ? "filas" : peticion.columnas.includes(ref) ? "columnas" : null;

    const mover = (destino: Eje | null) => (ref: string) => {
        if (ref) onCambio(moverNivel(peticion, ref, destino));
    };

    const moverDelante = (antesDe: string) => (ref: string) => {
        if (ref && ref !== antesDe) onCambio(moverNivel(peticion, ref, ejeDe(antesDe), antesDe));
    };

    const ficha = (nivel: Nivel) => (
        <FichaNivel
            key={nivel.ref}
            nivel={nivel}
            filtrados={peticion.filtros[nivel.ref]?.length ?? 0}
            onFiltrar={() => setFiltrando(nivel)}
            onSoltarDelante={moverDelante(nivel.ref)}
        />
    );

    const fichasEje = (refs: string[]) =>
        refs.map((ref) => niveles.find((n) => n.ref === ref)).filter((n) => n !== undefined).map(ficha);

    const aceptarFiltro = (codigos: CodigoMiembro[]) => {
        if (filtrando) onCambio(cambiarFiltro(peticion, filtrando.ref, codigos));
        setFiltrando(null);
    };

    return (
        <>
            <div className="analisis-ejes">
                <ZonaEje titulo="Filas" onSoltar={mover("filas")}>{fichasEje(peticion.filas)}</ZonaEje>
                <ZonaEje titulo="Columnas" onSoltar={mover("columnas")}>{fichasEje(peticion.columnas)}</ZonaEje>
                <ZonaEje titulo="Niveles" onSoltar={mover(null)}>
                    {cubo.dimensiones.map((dimension) => {
                        const libres = dimension.niveles.filter((n) => !enEjes.includes(n.ref));
                        return libres.length === 0 ? null : (
                            <div key={dimension.id} className="analisis-dimension">
                                <h4>{dimension.descripcion}</h4>
                                {libres.map(ficha)}
                            </div>
                        );
                    })}
                </ZonaEje>
            </div>
            {filtrando && (
                <FiltroNivel
                    cuboId={cubo.id}
                    nivel={filtrando}
                    seleccion={peticion.filtros[filtrando.ref] ?? []}
                    onAceptar={aceptarFiltro}
                    onCerrar={() => setFiltrando(null)}
                />
            )}
        </>
    );
};
