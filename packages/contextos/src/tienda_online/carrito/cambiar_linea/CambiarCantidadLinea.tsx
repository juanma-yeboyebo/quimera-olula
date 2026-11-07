import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { LineaCarritoTienda } from "../../comun/diseño.ts";
import { cantidadValida } from "../dominio.ts";

export const CambiarCantidadLinea = ({
    linea,
    deshabilitado,
    onCambiar,
}: {
    linea: LineaCarritoTienda;
    deshabilitado: boolean;
    onCambiar: (cantidad: number) => void;
}) => {
    const [texto, setTexto] = useState(String(linea.cantidad));
    const enviado = useRef(false);

    useEffect(() => {
        enviado.current = false;
        setTexto(String(linea.cantidad));
    }, [deshabilitado, linea.cantidad]);

    const enviar = (valor: unknown) => {
        if (enviado.current) return;
        if (!cantidadValida(valor)) {
            setTexto(String(linea.cantidad));
            return;
        }
        const cantidad = Number(valor);
        if (cantidad === linea.cantidad) return;
        enviado.current = true;
        onCambiar(cantidad);
    };

    const alPulsar = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") enviar(texto);
    };

    return (
        <div className="linea-cantidad">
            <button
                type="button"
                aria-label={`Quitar una unidad de ${linea.descripcion}`}
                disabled={deshabilitado || linea.cantidad <= 1}
                onClick={() => linea.cantidad > 1 && enviar(linea.cantidad - 1)}
            >
                −
            </button>
            <input
                type="number"
                min={1}
                aria-label={`Cantidad de ${linea.descripcion}`}
                value={texto}
                disabled={deshabilitado}
                onChange={(e) => setTexto(e.target.value)}
                onBlur={() => enviar(texto)}
                onKeyUp={alPulsar}
            />
            <button
                type="button"
                aria-label={`Añadir una unidad de ${linea.descripcion}`}
                disabled={deshabilitado}
                onClick={() => enviar(linea.cantidad + 1)}
            >
                +
            </button>
        </div>
    );
};
