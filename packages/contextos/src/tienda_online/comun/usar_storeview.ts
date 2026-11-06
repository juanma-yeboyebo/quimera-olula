import { useEffect, useState } from "react";
import { StoreView } from "./diseño.ts";
import { codigoStoreViewDesdeEnv } from "./dominio.ts";
import { getStoreView } from "./infraestructura.ts";

export type EstadoStoreView =
    | { estado: "CARGANDO" }
    | { estado: "ERROR_CONFIGURACION" }
    | { estado: "NO_DISPONIBLE" }
    | { estado: "LISTO"; storeView: StoreView };

export const useStoreView = (): EstadoStoreView => {
    const codigo = codigoStoreViewDesdeEnv(import.meta.env.VITE_STORE_VIEW);
    const [estado, setEstado] = useState<EstadoStoreView>(
        codigo ? { estado: "CARGANDO" } : { estado: "ERROR_CONFIGURACION" }
    );

    useEffect(() => {
        if (!codigo) return;
        let activo = true;
        getStoreView(codigo)
            .then((storeView) => activo && setEstado({ estado: "LISTO", storeView }))
            .catch(() => activo && setEstado({ estado: "NO_DISPONIBLE" }));
        return () => {
            activo = false;
        };
    }, [codigo]);

    return estado;
};
