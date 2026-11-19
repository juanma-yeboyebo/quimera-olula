import { useId } from "react";
import "./campo_formulario.css";

export const CampoFormulario = ({
    etiqueta,
    valor,
    error,
    tipo = "text",
    deshabilitado,
    autocompletar,
    obligatorio = false,
    valido = false,
    onCambiar,
    onSalir,
}: {
    etiqueta: string;
    valor: string | null;
    error?: string;
    tipo?: string;
    deshabilitado: boolean;
    autocompletar?: string;
    obligatorio?: boolean;
    valido?: boolean;
    onCambiar: (valor: string) => void;
    onSalir?: () => void;
}) => {
    const id = useId();
    const idError = `${id}-error`;

    return (
        <div className="campo-formulario" data-valido={valido || undefined}>
            <label htmlFor={id}>
                {etiqueta}
                {obligatorio && (
                    <span className="campo-formulario-obligatorio" aria-hidden="true">
                        {" *"}
                    </span>
                )}
            </label>
            <span className="campo-formulario-control">
                <input
                    id={id}
                    type={tipo}
                    value={valor ?? ""}
                    disabled={deshabilitado}
                    autoComplete={autocompletar}
                    aria-required={obligatorio || undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? idError : undefined}
                    onChange={(e) => onCambiar(e.target.value)}
                    onBlur={onSalir}
                />
                {valido && (
                    <span className="campo-formulario-ok" aria-hidden="true">
                        ✓
                    </span>
                )}
            </span>
            {error && (
                <span id={idError} className="campo-formulario-error">
                    {error}
                </span>
            )}
        </div>
    );
};
