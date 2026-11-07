import { useId } from "react";
import "./campo_formulario.css";

export const CampoFormulario = ({
    etiqueta,
    valor,
    error,
    tipo = "text",
    deshabilitado,
    autocompletar,
    onCambiar,
}: {
    etiqueta: string;
    valor: string | null;
    error?: string;
    tipo?: string;
    deshabilitado: boolean;
    autocompletar?: string;
    onCambiar: (valor: string) => void;
}) => {
    const id = useId();
    const idError = `${id}-error`;

    return (
        <div className="campo-formulario">
            <label htmlFor={id}>{etiqueta}</label>
            <input
                id={id}
                type={tipo}
                value={valor ?? ""}
                disabled={deshabilitado}
                autoComplete={autocompletar}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? idError : undefined}
                onChange={(e) => onCambiar(e.target.value)}
            />
            {error && (
                <span id={idError} className="campo-formulario-error">
                    {error}
                </span>
            )}
        </div>
    );
};
