import type { EstadoFlujoVoz } from "@olula/lib/voz/useFlujoVoz.ts";
import "./indicador_voz.css";

interface IndicadorVozProps {
    estado: EstadoFlujoVoz;
    textoReconocido: string | null;
    interino: string | null;
}

const etiquetas: Record<EstadoFlujoVoz, string> = {
    inactivo: "",
    hablando: "Hablando...",
    escuchando: "Escuchando...",
    confirmando: "Confirmando...",
};

export const IndicadorVoz = ({ estado, textoReconocido, interino }: IndicadorVozProps) => {
    if (estado === "inactivo") return null;

    return (
        <div className={`indicador-voz indicador-voz--${estado}`} role="status" aria-live="polite">
            <span className="indicador-voz__icono" aria-hidden="true">
                {estado === "hablando" && "🔊"}
                {estado === "escuchando" && "🎙️"}
                {estado === "confirmando" && "❓"}
            </span>
            <span className="indicador-voz__etiqueta">{etiquetas[estado]}</span>
            {interino && (
                <span className="indicador-voz__interino">{interino}</span>
            )}
            {textoReconocido && (
                <span className="indicador-voz__resultado">{textoReconocido}</span>
            )}
        </div>
    );
};
