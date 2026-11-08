import { Link } from "react-router";
import { useStoreView } from "../usar_storeview.ts";
import "./logo_tienda.css";

export const LogoTienda = () => {
    const sv = useStoreView();
    const nombre = sv.estado === "LISTO" ? sv.storeView.website.nombre : "";

    return (
        <Link to="/" className="logo-tienda">
            {nombre}
        </Link>
    );
};
