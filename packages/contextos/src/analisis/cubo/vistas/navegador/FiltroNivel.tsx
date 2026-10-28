import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QMultiCheckbox } from "@olula/componentes/atomos/qmulticheckbox.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { useEffect, useState } from "react";
import { CodigoMiembro, Miembros, Nivel } from "../../diseño.ts";
import { getMiembros } from "../../infraestructura.ts";

type FiltroNivelProps = {
    cuboId: string;
    nivel: Nivel;
    seleccion: CodigoMiembro[];
    onAceptar: (codigos: CodigoMiembro[]) => void;
    onCerrar: () => void;
};

const clave = (codigo: CodigoMiembro) => JSON.stringify(codigo);

export const FiltroNivel = ({ cuboId, nivel, seleccion, onAceptar, onCerrar }: FiltroNivelProps) => {
    const [buscar, setBuscar] = useState("");
    const [resultado, setResultado] = useState<Miembros>({ miembros: [], hayMas: false });
    const [elegidos, setElegidos] = useState<string[]>(seleccion.map(clave));

    useEffect(() => {
        const espera = setTimeout(() => {
            getMiembros(cuboId, nivel.ref, buscar || undefined).then(setResultado);
        }, 300);
        return () => clearTimeout(espera);
    }, [cuboId, nivel.ref, buscar]);

    return (
        <QModal nombre="filtro-nivel" titulo={`Filtrar ${nivel.descripcion}`} abierto onCerrar={onCerrar}>
            <div className="analisis-filtro-nivel">
                <QInput label="Buscar" nombre="buscar" valor={buscar} onChange={setBuscar} autoFocus />
                <QMultiCheckbox
                    label=""
                    nombre="miembros"
                    valor={elegidos as unknown as string}
                    opciones={resultado.miembros.map((m) => ({ valor: clave(m.codigo), descripcion: m.etiqueta }))}
                    onChange={(valor) => setElegidos(valor as unknown as string[])}
                />
                {resultado.hayMas && <p className="analisis-filtro-mas">Hay más valores: afina la búsqueda.</p>}
                <div className="analisis-filtro-botones">
                    <QBoton variante="texto" onClick={() => onAceptar([])}>
                        Quitar filtro
                    </QBoton>
                    <QBoton onClick={() => onAceptar(elegidos.map((e) => JSON.parse(e) as CodigoMiembro))}>
                        Aceptar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
