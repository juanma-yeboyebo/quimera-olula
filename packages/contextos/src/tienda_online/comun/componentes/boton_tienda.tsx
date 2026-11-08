import { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router";
import "./boton_tienda.css";

export type VarianteBotonTienda = "principal" | "secundario" | "enlace";

export const BotonTienda = ({
    children,
    variante = "principal",
    ancho,
    a,
    tipo = "button",
    deshabilitado,
    etiqueta,
    onClick,
}: {
    children: ReactNode;
    variante?: VarianteBotonTienda;
    ancho?: boolean;
    a?: string;
    tipo?: "button" | "submit";
    deshabilitado?: boolean;
    etiqueta?: string;
    onClick?: MouseEventHandler<HTMLElement>;
}) => {
    const clase = `boton-tienda boton-tienda-${variante}${ancho ? " boton-tienda-ancho" : ""}`;

    if (a) {
        return (
            <Link to={a} className={clase} aria-label={etiqueta} onClick={onClick}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={tipo}
            className={clase}
            aria-label={etiqueta}
            disabled={deshabilitado}
            onClick={deshabilitado ? undefined : onClick}
        >
            {children}
        </button>
    );
};
