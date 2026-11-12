import { KeyboardEvent, useEffect, useId, useRef } from "react";
import "#/tienda_online/comun/componentes/boton_tienda.css";
import "./dialogo_otra_lista.css";

export const DialogoCarritoOtraLista = ({
    onEmpezar,
    onCancelar,
}: {
    onEmpezar: () => void;
    onCancelar: () => void;
}) => {
    const id = useId();
    const dialogo = useRef<HTMLDivElement>(null);
    const principal = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previo = document.activeElement as HTMLElement | null;
        principal.current?.focus();
        return () => previo?.focus?.();
    }, []);

    const alPulsar = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            e.preventDefault();
            onCancelar();
            return;
        }
        if (e.key !== "Tab") return;
        const botones = Array.from(dialogo.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        if (botones.length === 0) return;
        const primero = botones[0];
        const ultimo = botones[botones.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
            e.preventDefault();
            ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primero.focus();
        }
    };

    return (
        <div className="dialogo-otra-lista-fondo" onClick={onCancelar}>
            <div
                ref={dialogo}
                className="dialogo-otra-lista"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-titulo`}
                aria-describedby={`${id}-texto`}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={alPulsar}
            >
                <h2 id={`${id}-titulo`}>Tu carrito tiene productos de otra lista</h2>
                <p id={`${id}-texto`}>¿Quieres empezar un carrito nuevo para esta lista?</p>
                <div className="dialogo-otra-lista-acciones">
                    <button type="button" className="boton-tienda boton-tienda-secundario" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button
                        ref={principal}
                        type="button"
                        className="boton-tienda boton-tienda-principal"
                        onClick={onEmpezar}
                    >
                        Empezar carrito nuevo
                    </button>
                </div>
            </div>
        </div>
    );
};
