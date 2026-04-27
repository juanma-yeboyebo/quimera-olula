import { LineaParaTiqueRegalo } from "#/tpv/venta/diseño";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useEffect, useState } from "react";

const validacion = (cantidadRaw: string) => {
  const cantidad = parseInt(cantidadRaw);

  return isNaN(cantidad) || cantidad < 0
    ? "Debe tener una cantidad mayor que cero."
    : "";
};

export const CantidadATiqueRegalo = (
    {
        linea,
        onCantidadEditada,
    }: {
        linea: LineaParaTiqueRegalo;
        onCantidadEditada: (linea: LineaParaTiqueRegalo, cantidad: number) => void;
    }
) => {

    const [estado, setEstado] = useState("");
    const [valor, setValor] = useState(linea.aTiqueRegalo.toString());

    useEffect(() => {
        setValor(linea.aTiqueRegalo.toString());
    }, [linea.aTiqueRegalo]);

    const handleChange = (v: string) => {
        const valor = Number(v);
        if (valor < 0 || valor > linea.cantidad) {
            return;
        }
        const nuevoEstado = validacion(v);
        setEstado(nuevoEstado);
        setValor(v);
        onCantidadEditada(linea, valor);
    };

    return (
        <QInput
            label="A incluir"
            nombre="a_tique_regalo"
            valor={valor}
            erroneo={!!estado && estado.length > 0}
            textoValidacion={estado}
            condensado
            tipo="numero"
            onChange={handleChange}
            autoSeleccion
        />
    );
};
