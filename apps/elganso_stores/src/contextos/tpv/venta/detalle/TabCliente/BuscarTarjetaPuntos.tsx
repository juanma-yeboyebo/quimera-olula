import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useState } from "react";
import { buscarTarjetasPuntos, TarjetaPuntos } from "../../infraestructura.ts";
import "./BuscarTarjetaPuntos.scss";

export interface BuscarTarjetaPuntosProps {
  onSeleccionar: (tarjeta: TarjetaPuntos) => void;
  onCerrar: () => void;
}

// En Eneboo la tarjeta Gansociety solo se busca por email o por teléfono
// (las dos únicas opciones que ofrece su formulario real).
export const BuscarTarjetaPuntos = ({
  onSeleccionar,
  onCerrar,
}: BuscarTarjetaPuntosProps) => {
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [resultados, setResultados] = useState<TarjetaPuntos[] | null>(null);
  const [buscando, setBuscando] = useState(false);

  const buscar = async () => {
    if (!email && !telefono) return;
    setBuscando(true);
    try {
      const tarjetas = await buscarTarjetasPuntos({
        email: email || undefined,
        telefono: telefono || undefined,
      });
      setResultados(tarjetas);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="BuscarTarjetaPuntos">
      <quimera-formulario>
        <QInput
          label="Email"
          nombre="buscar_tarjeta_email"
          valor={email}
          onChange={(valor) => setEmail(String(valor ?? ""))}
        />
        <QInput
          label="Teléfono"
          nombre="buscar_tarjeta_telefono"
          valor={telefono}
          onChange={(valor) => setTelefono(String(valor ?? ""))}
        />
      </quimera-formulario>

      <div className="botones maestro-botones">
        <QBoton onClick={buscar} deshabilitado={buscando || (!email && !telefono)}>
          Buscar
        </QBoton>
        <QBoton onClick={onCerrar}>Cerrar</QBoton>
      </div>

      {resultados && resultados.length === 0 && (
        <p className="BuscarTarjetaPuntos-vacio">No se han encontrado tarjetas.</p>
      )}

      {resultados && resultados.length > 0 && (
        <ul className="BuscarTarjetaPuntos-resultados">
          {resultados.map((tarjeta) => (
            <li key={tarjeta.codtarjetapuntos}>
              <button type="button" onClick={() => onSeleccionar(tarjeta)}>
                <strong>{tarjeta.codtarjetapuntos}</strong> — {tarjeta.nombre}
                {" "}({tarjeta.email || tarjeta.telefono})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
