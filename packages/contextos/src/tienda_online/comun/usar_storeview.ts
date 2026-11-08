import { useEffect, useState } from "react";
import { StoreView } from "./diseño.ts";
import { codigoStoreViewDesdeEnv } from "./dominio.ts";
import { getStoreView } from "./infraestructura.ts";

export type EstadoStoreView =
    | { estado: "CARGANDO" }
    | { estado: "ERROR_CONFIGURACION" }
    | { estado: "NO_DISPONIBLE" }
    | { estado: "LISTO"; storeView: StoreView };

const cargados = new Map<string, StoreView>();
const pendientes = new Map<string, Promise<StoreView>>();

export const cargarStoreView = (codigo: string): Promise<StoreView> => {
    const cargado = cargados.get(codigo);
    if (cargado) return Promise.resolve(cargado);
    const pendiente = pendientes.get(codigo);
    if (pendiente) return pendiente;
    const pedido = getStoreView(codigo)
        .then((storeView) => {
            cargados.set(codigo, storeView);
            return storeView;
        })
        .finally(() => {
            pendientes.delete(codigo);
        });
    pendientes.set(codigo, pedido);
    return pedido;
};

export const reiniciarStoreViews = () => {
    cargados.clear();
    pendientes.clear();
};

const estadoInicial = (codigo: string | null): EstadoStoreView => {
    if (!codigo) return { estado: "ERROR_CONFIGURACION" };
    const storeView = cargados.get(codigo);
    return storeView ? { estado: "LISTO", storeView } : { estado: "CARGANDO" };
};

export const useStoreView = (): EstadoStoreView => {
    const codigo = codigoStoreViewDesdeEnv(import.meta.env.VITE_STORE_VIEW);
    const [estado, setEstado] = useState<EstadoStoreView>(() => estadoInicial(codigo));

    useEffect(() => {
        if (!codigo || cargados.has(codigo)) return;
        let activo = true;
        cargarStoreView(codigo)
            .then((storeView) => activo && setEstado({ estado: "LISTO", storeView }))
            .catch(() => activo && setEstado({ estado: "NO_DISPONIBLE" }));
        return () => {
            activo = false;
        };
    }, [codigo]);

    return estado;
};
