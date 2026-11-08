import { SelectorCantidad } from "../../comun/componentes/selector_cantidad.tsx";
import { LineaCarritoTienda } from "../../comun/diseño.ts";

export const CambiarCantidadLinea = ({
    linea,
    deshabilitado,
    onCambiar,
}: {
    linea: LineaCarritoTienda;
    deshabilitado: boolean;
    onCambiar: (cantidad: number) => void;
}) => (
    <SelectorCantidad
        valor={linea.cantidad}
        deshabilitado={deshabilitado}
        onCambiar={(cantidad) => cantidad !== linea.cantidad && onCambiar(cantidad)}
    />
);
