import { KeyboardEvent, useEffect, useId, useState } from "react";
import { OpcionAutocompletar, filtrarOpciones, opcionExacta, textoDeOpcion } from "../dominio.ts";
import "./autocompletar_tienda.css";
import "./campo_formulario.css";

const MAXIMO_SUGERENCIAS = 8;

export const AutocompletarTienda = ({
    etiqueta,
    valor,
    opciones,
    error,
    deshabilitado,
    autocompletar,
    obligatorio = false,
    valido = false,
    onCambiar,
    onSalir,
}: {
    etiqueta: string;
    valor: string | null;
    opciones: OpcionAutocompletar[];
    error?: string;
    deshabilitado: boolean;
    autocompletar?: string;
    obligatorio?: boolean;
    valido?: boolean;
    onCambiar: (valor: string) => void;
    onSalir?: () => void;
}) => {
    const id = useId();
    const idError = `${id}-error`;
    const idLista = `${id}-lista`;
    const [texto, setTexto] = useState(textoDeOpcion(opciones, valor));
    const [abierto, setAbierto] = useState(false);
    const [activa, setActiva] = useState(-1);
    const sugerencias = filtrarOpciones(opciones, abierto ? texto : "", MAXIMO_SUGERENCIAS);

    useEffect(() => {
        if (!abierto) setTexto(textoDeOpcion(opciones, valor));
    }, [abierto, opciones, valor]);

    const abrir = (nuevoTexto: string) => {
        setTexto(nuevoTexto);
        setAbierto(true);
        setActiva(-1);
    };

    const cerrar = () => {
        setAbierto(false);
        setActiva(-1);
        setTexto(textoDeOpcion(opciones, valor));
    };

    const elegir = (opcion: OpcionAutocompletar) => {
        setAbierto(false);
        setActiva(-1);
        setTexto(opcion.texto);
        if (opcion.valor !== valor) onCambiar(opcion.valor);
    };

    const salir = () => {
        const exacta = abierto ? opcionExacta(opciones, texto) : null;
        if (exacta) elegir(exacta);
        else cerrar();
        onSalir?.();
    };

    const teclear = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!abierto) return abrir(texto === textoDeOpcion(opciones, valor) ? "" : texto);
            setActiva((i) => Math.min(i + 1, sugerencias.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiva((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && abierto) {
            e.preventDefault();
            const opcion = sugerencias[activa] ?? opcionExacta(opciones, texto);
            if (opcion) elegir(opcion);
        } else if (e.key === "Escape" && abierto) {
            e.preventDefault();
            cerrar();
        }
    };

    const idOpcion = (i: number) => `${id}-opcion-${i}`;

    return (
        <div className="campo-formulario autocompletar-tienda" data-valido={valido || undefined}>
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
                    type="text"
                    role="combobox"
                    value={texto}
                    disabled={deshabilitado}
                    autoComplete={autocompletar ?? "off"}
                    aria-autocomplete="list"
                    aria-expanded={abierto}
                    aria-controls={idLista}
                    aria-activedescendant={abierto && activa >= 0 ? idOpcion(activa) : undefined}
                    aria-required={obligatorio || undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? idError : undefined}
                    onChange={(e) => abrir(e.target.value)}
                    onFocus={(e) => {
                        e.target.select();
                        abrir(texto);
                    }}
                    onBlur={salir}
                    onKeyDown={teclear}
                />
                {valido && !abierto && (
                    <span className="campo-formulario-ok" aria-hidden="true">
                        ✓
                    </span>
                )}
                <ul id={idLista} role="listbox" className="autocompletar-tienda-lista" hidden={!abierto}>
                    {sugerencias.length === 0 ? (
                        <li className="autocompletar-tienda-vacio">Sin resultados</li>
                    ) : (
                        sugerencias.map((opcion, i) => (
                            <li
                                key={opcion.valor}
                                id={idOpcion(i)}
                                role="option"
                                aria-selected={i === activa}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => elegir(opcion)}
                            >
                                {opcion.texto}
                            </li>
                        ))
                    )}
                </ul>
            </span>
            {error && (
                <span id={idError} className="campo-formulario-error">
                    {error}
                </span>
            )}
        </div>
    );
};
