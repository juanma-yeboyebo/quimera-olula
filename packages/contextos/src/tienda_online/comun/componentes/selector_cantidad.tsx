import { limitarCantidad } from "../dominio.ts";
import "./selector_cantidad.css";

export const SelectorCantidad = ({
    valor,
    minimo = 1,
    maximo,
    onCambiar,
}: {
    valor: number;
    minimo?: number;
    maximo?: number;
    onCambiar: (valor: number) => void;
}) => (
    <div className="selector-cantidad">
        <button
            type="button"
            aria-label="Restar uno"
            disabled={valor <= minimo}
            onClick={() => onCambiar(limitarCantidad(valor - 1, minimo, maximo))}
        >
            −
        </button>
        <span className="selector-cantidad-valor">{valor}</span>
        <button
            type="button"
            aria-label="Sumar uno"
            disabled={maximo !== undefined && valor >= maximo}
            onClick={() => onCambiar(limitarCantidad(valor + 1, minimo, maximo))}
        >
            +
        </button>
    </div>
);
