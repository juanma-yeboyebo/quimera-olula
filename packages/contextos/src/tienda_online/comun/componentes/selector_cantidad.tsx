import { KeyboardEvent, useEffect, useState } from "react";
import { cantidadValida, limitarCantidad } from "../dominio.ts";
import "./selector_cantidad.css";

export const SelectorCantidad = ({
    valor,
    minimo = 1,
    maximo,
    deshabilitado,
    onCambiar,
}: {
    valor: number;
    minimo?: number;
    maximo?: number;
    deshabilitado?: boolean;
    onCambiar: (valor: number) => void;
}) => {
    const [texto, setTexto] = useState(String(valor));

    useEffect(() => {
        setTexto(String(valor));
    }, [valor]);

    const confirmar = () => {
        if (!cantidadValida(texto)) {
            setTexto(String(valor));
            return;
        }
        const nuevo = limitarCantidad(Number(texto), minimo, maximo);
        setTexto(String(nuevo));
        if (nuevo !== valor) onCambiar(nuevo);
    };

    const alPulsar = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            confirmar();
        }
    };

    return (
        <div className="selector-cantidad">
            <button
                type="button"
                aria-label="Restar uno"
                disabled={deshabilitado || valor <= minimo}
                onClick={() => onCambiar(limitarCantidad(valor - 1, minimo, maximo))}
            >
                −
            </button>
            <input
                className="selector-cantidad-valor"
                type="number"
                inputMode="numeric"
                min={minimo}
                max={maximo}
                aria-label="Cantidad"
                value={texto}
                disabled={deshabilitado}
                onChange={(e) => setTexto(e.target.value)}
                onBlur={confirmar}
                onKeyDown={alPulsar}
            />
            <button
                type="button"
                aria-label="Sumar uno"
                disabled={deshabilitado || (maximo !== undefined && valor >= maximo)}
                onClick={() => onCambiar(limitarCantidad(valor + 1, minimo, maximo))}
            >
                +
            </button>
        </div>
    );
};
