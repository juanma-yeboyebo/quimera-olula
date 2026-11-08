import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { LineaCarritoTienda } from "../../comun/diseño.ts";

export const BorrarLineaCarrito = ({
    linea,
    onBorrar,
    deshabilitado,
}: {
    linea: LineaCarritoTienda;
    deshabilitado: boolean;
    onBorrar: () => void;
}) => (
    <BotonTienda
        variante="enlace"
        etiqueta={`Quitar ${linea.descripcion} del carrito`}
        deshabilitado={deshabilitado}
        onClick={onBorrar}
    >
        Quitar
    </BotonTienda>
);
