import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { Tarea } from "../diseño.ts";
import { estadoTarea, textoTipoTarea } from "../dominio.ts";
import "./TarjetaTarea.css";

type TarjetaTareaProps = {
    tarea: Tarea;
    ahora?: Date;
    onClick?: (tarea: Tarea) => void;
};

const textoEstado = {
    en_curso: "En curso",
    atrasada: "Atrasada",
} as const;

export const TarjetaTarea = ({ tarea, ahora, onClick }: TarjetaTareaProps) => {
    const estado = estadoTarea(tarea, ahora);
    const interlocutores = [tarea.nombreCliente, tarea.nombreContacto].filter(Boolean).join(" · ");

    return (
        <article
            className={`TarjetaTarea ${estado ?? ""}`}
            onClick={onClick ? () => onClick(tarea) : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <time className="hora">{tarea.hora?.slice(0, 5) ?? "—"}</time>
            <div className="contenido">
                <strong className="interlocutores">{interlocutores || tarea.titulo}</strong>
                {interlocutores && <span className="titulo">{tarea.titulo}</span>}
            </div>
            <div className="etiquetas">
                <QEtiqueta variante="neutro">{textoTipoTarea[tarea.tipo]}</QEtiqueta>
                {estado && (
                    <QEtiqueta variante={estado === "atrasada" ? "error" : "advertencia"}>
                        {textoEstado[estado]}
                    </QEtiqueta>
                )}
            </div>
        </article>
    );
};
