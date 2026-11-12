import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useEffect, useState } from "react";
import { ListaRegalos } from "../diseño.ts";
import { AVISO_NO_PUBLICADA } from "../dominio.ts";

export const TabCompartir = ({ lista }: { lista: ListaRegalos }) => {
    const [copiado, setCopiado] = useState(false);
    const url = lista.url ?? "";

    useEffect(() => {
        setCopiado(false);
    }, [url]);

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiado(true);
        } catch {
            setCopiado(false);
        }
    };

    const abrir = () => window.open(url, "_blank", "noopener");

    return (
        <div className="TabCompartir">
            {!lista.publicada && <QAviso variante="advertencia">{AVISO_NO_PUBLICADA}</QAviso>}
            <quimera-formulario>
                <QInput label="Enlace público" nombre="url" valor={url} soloLectura />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={copiar} deshabilitado={url === ""}>
                    Copiar enlace
                </QBoton>
                <QBoton variante="borde" onClick={abrir} deshabilitado={url === ""}>
                    Abrir
                </QBoton>
            </div>
            {copiado && <p role="status">Enlace copiado</p>}
        </div>
    );
};
