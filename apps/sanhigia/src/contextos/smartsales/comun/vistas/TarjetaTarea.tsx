import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { Link } from "react-router";
import { Tarea } from "../diseño.ts";
import { estadoTarea, textoTipoTarea } from "../dominio.ts";
import { rutasSmartsales } from "../rutas.ts";
import "./TarjetaTarea.css";

type TarjetaTareaProps = {
    tarea: Tarea;
    ahora?: Date;
};

const textoEstado = {
    en_curso: "En curso",
    atrasada: "Atrasada",
} as const;

export const TarjetaTarea = ({ tarea, ahora }: TarjetaTareaProps) => {
    const estado = estadoTarea(tarea, ahora);
    const interlocutores = [tarea.nombreCliente, tarea.nombreContacto].filter(Boolean).join(" · ");

    return (
        <Link to={rutasSmartsales.tarea(tarea.id)} className={`TarjetaTarea ${estado ?? ""}`}>
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
        </Link>
    );
};
