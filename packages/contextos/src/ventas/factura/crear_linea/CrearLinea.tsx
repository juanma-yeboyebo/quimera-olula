import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import "./CrearLinea.css";
import { metaNuevaLineaFactura, nuevaLineaFacturaVacia } from "./dominio.ts";

export const CrearLinea = ({
  publicar,
}: {
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaFactura,
    nuevaLineaFacturaVacia
  );
  const [creando, setCreando] = useState(false);
  const focus = useFocus();

  const crear = async () => {
    setCreando(true);
    publicar("linea_creada", modelo);
  };

  const cancelar = useCallback(() => {
    if (!creando) publicar("crear_linea_cancelado");
  }, [creando, publicar]);

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_factura"
      titulo="Crear línea"
      onCerrar={cancelar}
    >
      <div className="CrearLinea">
        <quimera-formulario>
          <Articulo
            {...uiProps("referencia", "descripcion")}
            nombre="referencia_nueva_linea_factura"
            ref={focus}
          />
          <QInput label="Cantidad" {...uiProps("cantidad")} />
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
