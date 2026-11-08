import { formatearPrecio } from "../dominio.ts";
import { useStoreView } from "../usar_storeview.ts";
import "./precio_tienda.css";

export const PrecioTienda = ({
    importe,
    divisa,
    grande,
}: {
    importe: number;
    divisa: string;
    grande?: boolean;
}) => {
    const sv = useStoreView();
    const idioma = sv.estado === "LISTO" ? sv.storeView.idioma : "es";

    return (
        <span className={`precio-tienda${grande ? " precio-tienda-grande" : ""}`}>
            {formatearPrecio(importe, divisa, idioma)}
        </span>
    );
};
