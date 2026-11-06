import { useEffect, useRef } from "react";
// import { redirect } from "react-router";
import { comprobarToken } from "./login/dominio.ts";
import { esRutaPublica } from "./middlewares.ts";

const SIN_RUTAS_PUBLICAS: string[] = [];

export const useTimerRefresco = ({ segundos_refresco = 60, rutas_publicas = SIN_RUTAS_PUBLICAS }: { segundos_refresco?: number, rutas_publicas?: string[] } = {}) => {
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(async () => {
            await comprobarToken().catch((_e) => {
                const ruta = window.location.pathname;
                if (ruta !== "/login" && !esRutaPublica(ruta, rutas_publicas)) window.location.href = "/login";
            })
        }, segundos_refresco * 1000);

        return () => {
            clearInterval(timerRef.current!);
        }
    }, [segundos_refresco, rutas_publicas])
};