import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useMemo, useState } from "react";
import { NodoCategoria } from "../diseño.ts";
import { buscarNodo, padresPosibles } from "../dominio.ts";

export const MoverCategoria = ({
    arbol,
    id,
    publicar,
}: {
    arbol: NodoCategoria[];
    id: string;
    publicar: EmitirEvento;
}) => {
    const opciones = useMemo(() => padresPosibles(arbol, id), [arbol, id]);
    const [padre, setPadre] = useState<string | null>(null);
    const nodo = buscarNodo(arbol, id);

    return (
        <QModal
            abierto={true}
            nombre="moverCategoria"
            titulo={`Mover ${nodo?.nombre ?? "categoría"} a…`}
            onCerrar={() => publicar("movimiento_cancelado")}
        >
            <quimera-formulario>
                <QSelect
                    label="Nuevo padre"
                    nombre="padre"
                    valor={padre ?? ""}
                    opciones={opciones}
                    onChange={(opcion) => setPadre(opcion ? opcion.valor : null)}
                />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton
                    deshabilitado={padre === null}
                    onClick={() => publicar("movimiento_confirmado", padre)}
                >
                    Mover
                </QBoton>
            </div>
        </QModal>
    );
};
