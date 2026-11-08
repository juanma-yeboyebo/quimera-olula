import { ReactNode } from "react";
import "./distintivo_tienda.css";

export const DistintivoTienda = ({
    children,
    variante = "neutro",
}: {
    children: ReactNode;
    variante?: "neutro" | "oferta" | "agotado";
}) => <span className={`distintivo-tienda distintivo-tienda-${variante}`}>{children}</span>;
