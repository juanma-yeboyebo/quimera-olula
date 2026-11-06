import { ReactNode } from "react";
import { StoreView } from "../diseño.ts";
import { useStoreView } from "../usar_storeview.ts";

export const ConStoreView = ({ children }: { children: (storeView: StoreView) => ReactNode }) => {
    const sv = useStoreView();

    if (sv.estado === "CARGANDO") return <p>Cargando...</p>;
    if (sv.estado === "ERROR_CONFIGURACION")
        return <p>Error de configuración: falta VITE_STORE_VIEW.</p>;
    if (sv.estado === "NO_DISPONIBLE") return <p>Tienda no disponible</p>;

    return <>{children(sv.storeView)}</>;
};
