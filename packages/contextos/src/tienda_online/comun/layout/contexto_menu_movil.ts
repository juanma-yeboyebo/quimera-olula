import { createContext } from "react";

export const ContextoMenuMovil = createContext<{
    abierto: boolean;
    abrir: () => void;
    cerrar: () => void;
}>({ abierto: false, abrir: () => {}, cerrar: () => {} });
