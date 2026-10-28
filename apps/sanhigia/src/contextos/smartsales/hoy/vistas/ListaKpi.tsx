import { porcentajeConseguido, porcentajeTiempoTranscurrido } from "../../comun/dominio.ts";
import { IndicadorProgreso } from "../../comun/vistas/IndicadorProgreso.tsx";
import { BloqueKpi } from "../diseño.ts";

type ListaKpiProps = {
    bloque: BloqueKpi;
    textoVacio: string;
};

export const ListaKpi = ({ bloque, textoVacio }: ListaKpiProps) => {
    if (bloque.lineas.length === 0) return <p className="vacio">{textoVacio}</p>;

    const tiempo = bloque.rango ? porcentajeTiempoTranscurrido(bloque.rango) : 0;

    return (
        <ul className="ListaKpi">
            {bloque.lineas.map((linea) => {
                const conseguido = porcentajeConseguido(linea.alcanzada, linea.objetivo);
                return (
                    <li key={linea.clave}>
                        <span className="etiqueta">{linea.etiqueta}</span>
                        <span className="cifras">
                            {linea.alcanzada} / {linea.objetivo}
                        </span>
                        <span className="porcentaje">{conseguido === null ? "—" : `${Math.round(conseguido)} %`}</span>
                        <IndicadorProgreso conseguido={conseguido} tiempo={tiempo} />
                    </li>
                );
            })}
        </ul>
    );
};
