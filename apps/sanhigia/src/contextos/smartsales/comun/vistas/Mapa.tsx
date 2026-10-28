import { Posicion } from "../geolocalizacion.ts";
import "./Mapa.css";

export type PuntoMapa = {
    id: string;
    latitud: number;
    longitud: number;
    titulo: string;
};

type MapaProps = {
    centro: Posicion;
    radioKm: number;
    puntos: PuntoMapa[];
    seleccionado?: string | null;
    onSeleccionar?: (id: string) => void;
    onMover?: (centro: Posicion, radioKm: number) => void;
};

const TAMAÑO = 200;
const KM_POR_GRADO = 111;

const proyectar = (centro: Posicion, radioKm: number, latitud: number, longitud: number) => {
    const escala = TAMAÑO / 2 / radioKm;
    return {
        x: TAMAÑO / 2 + (longitud - centro.longitud) * KM_POR_GRADO * Math.cos((centro.latitud * Math.PI) / 180) * escala,
        y: TAMAÑO / 2 - (latitud - centro.latitud) * KM_POR_GRADO * escala,
    };
};

export const Mapa = ({ centro, radioKm, puntos, seleccionado = null, onSeleccionar, onMover }: MapaProps) => {
    const desplazar = (norte: number, este: number) =>
        onMover?.(
            {
                latitud: centro.latitud + (norte * radioKm) / 2 / KM_POR_GRADO,
                longitud: centro.longitud + (este * radioKm) / 2 / (KM_POR_GRADO * Math.cos((centro.latitud * Math.PI) / 180)),
            },
            radioKm
        );

    return (
        <div className="Mapa">
            <svg viewBox={`0 0 ${TAMAÑO} ${TAMAÑO}`} role="img" aria-label={`${puntos.length} clientes en ${Math.round(radioKm)} km`}>
                <circle className="radio" cx={TAMAÑO / 2} cy={TAMAÑO / 2} r={TAMAÑO / 2 - 1} />
                <circle className="centro" cx={TAMAÑO / 2} cy={TAMAÑO / 2} r={2.5} />
                {puntos.map((punto) => {
                    const { x, y } = proyectar(centro, radioKm, punto.latitud, punto.longitud);
                    return (
                        <circle
                            key={punto.id}
                            className={punto.id === seleccionado ? "punto seleccionado" : "punto"}
                            cx={x}
                            cy={y}
                            r={punto.id === seleccionado ? 4.5 : 3}
                            onClick={() => onSeleccionar?.(punto.id)}
                        >
                            <title>{punto.titulo}</title>
                        </circle>
                    );
                })}
            </svg>
            {onMover && (
                <div className="controles">
                    <button type="button" aria-label="Acercar" onClick={() => onMover(centro, Math.max(radioKm / 2, 1))}>
                        +
                    </button>
                    <button type="button" aria-label="Alejar" onClick={() => onMover(centro, Math.min(radioKm * 2, 400))}>
                        −
                    </button>
                    <button type="button" aria-label="Mover al norte" onClick={() => desplazar(1, 0)}>
                        ↑
                    </button>
                    <button type="button" aria-label="Mover al sur" onClick={() => desplazar(-1, 0)}>
                        ↓
                    </button>
                    <button type="button" aria-label="Mover al oeste" onClick={() => desplazar(0, -1)}>
                        ←
                    </button>
                    <button type="button" aria-label="Mover al este" onClick={() => desplazar(0, 1)}>
                        →
                    </button>
                </div>
            )}
        </div>
    );
};
