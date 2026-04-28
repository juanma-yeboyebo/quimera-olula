import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { VentaTpv } from "../diseño.ts";
import { postLinea } from "../infraestructura.ts";
import "./CrearLineaVentaTpv.css";
import {
  metaNuevaLineaFactura,
  nuevaLineaFacturaVacia,
} from "./crear_linea.ts";

export const CrearLineaVentaTpv = ({
  venta,
  publicar,
}: {
  venta: VentaTpv;
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaFactura,
    nuevaLineaFacturaVacia
  );
  const [creando, setCreando] = useState(false);

  const crear = useCallback(
    async () => {
      const idLinea = await intentar(() => postLinea(venta.id, modelo));
      setCreando(true);
      publicar("linea_creada", idLinea);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelo, publicar, venta.id]
  );

  const cancelar = useCallback(() => {
    if (!creando) publicar("alta_de_linea_cancelada");
  }, [creando, publicar]);

  const focus = useFocus();

  return (
    <QModal
      abierto={true}
      nombre="mostrar"
      titulo="Crear línea"
      onCerrar={cancelar}
    >
      <div className="CrearLineaVentaTpv">
        <quimera-formulario>
          <Articulo
            {...uiProps("referencia", "descripcion")}
            nombre="referencia_nueva_linea_pedido"
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
