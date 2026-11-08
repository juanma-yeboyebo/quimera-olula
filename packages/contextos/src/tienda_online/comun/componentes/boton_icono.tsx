import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { MouseEventHandler } from "react";
import { Link } from "react-router";
import { textoContador } from "../dominio.ts";
import "./boton_icono.css";

export const BotonIcono = ({
    icono,
    etiqueta,
    contador,
    a,
    expandido,
    onClick,
}: {
    icono: string;
    etiqueta: string;
    contador?: number;
    a?: string;
    expandido?: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
}) => {
    const texto = textoContador(contador ?? 0);
    const contenido = (
        <>
            <QIcono nombre={icono} tamaño="md" />
            {texto && <span className="boton-icono-contador">{texto}</span>}
        </>
    );

    if (a) {
        return (
            <Link to={a} className="boton-icono" aria-label={etiqueta} onClick={onClick}>
                {contenido}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className="boton-icono"
            aria-label={etiqueta}
            aria-expanded={expandido}
            onClick={onClick}
        >
            {contenido}
        </button>
    );
};
