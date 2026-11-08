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
    onClick,
}: {
    children: ReactNode;
    variante?: VarianteBotonTienda;
    ancho?: boolean;
    a?: string;
    tipo?: "button" | "submit";
    deshabilitado?: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
}) => {
    const clase = `boton-tienda boton-tienda-${variante}${ancho ? " boton-tienda-ancho" : ""}`;

    if (a) {
        return (
            <Link to={a} className={clase} onClick={onClick}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={tipo}
            className={clase}
            disabled={deshabilitado}
            onClick={deshabilitado ? undefined : onClick}
        >
            {children}
        </button>
    );
};
