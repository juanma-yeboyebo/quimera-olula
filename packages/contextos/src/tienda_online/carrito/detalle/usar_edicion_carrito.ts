import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useRef, useState } from "react";
import { contextoCarritoInicial } from "./detalle.ts";
import { getMaquina } from "./maquina.ts";

export const useEdicionCarrito = () => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoCarritoInicial);
    const enCurso = useRef(false);
    const [bloqueado, setBloqueado] = useState(false);

    const publicar = async (evento: string, payload?: unknown) => {
        if (enCurso.current) return;
        enCurso.current = true;
        setBloqueado(true);
        try {
            await emitir(evento, payload);
        } finally {
            enCurso.current = false;
            setBloqueado(false);
        }
    };

    return { ctx, publicar, bloqueado };
};
