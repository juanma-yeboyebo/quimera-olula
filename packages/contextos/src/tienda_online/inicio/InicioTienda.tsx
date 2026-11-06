import { useStoreView } from "../comun/usar_storeview.ts";

export const InicioTienda = () => {
    const sv = useStoreView();

    if (sv.estado === "CARGANDO") return <p>Cargando...</p>;
    if (sv.estado === "ERROR_CONFIGURACION")
        return <p>Error de configuración: falta VITE_STORE_VIEW.</p>;
    if (sv.estado === "NO_DISPONIBLE") return <p>Tienda no disponible</p>;

    return <h1>{sv.storeView.nombre}</h1>;
};
