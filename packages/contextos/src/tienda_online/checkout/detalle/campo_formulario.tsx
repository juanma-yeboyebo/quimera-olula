import { useId } from "react";

export const CampoFormulario = ({
    etiqueta,
    valor,
    error,
    tipo = "text",
    deshabilitado,
    onCambiar,
}: {
    etiqueta: string;
    valor: string | null;
    error?: string;
    tipo?: string;
    deshabilitado: boolean;
    onCambiar: (valor: string) => void;
}) => {
    const id = useId();
    const idError = `${id}-error`;

    return (
        <div className="checkout-campo">
            <label htmlFor={id}>{etiqueta}</label>
            <input
                id={id}
                type={tipo}
                value={valor ?? ""}
                disabled={deshabilitado}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? idError : undefined}
                onChange={(e) => onCambiar(e.target.value)}
            />
            {error && (
                <span id={idError} className="checkout-campo-error">
                    {error}
                </span>
            )}
        </div>
    );
};
