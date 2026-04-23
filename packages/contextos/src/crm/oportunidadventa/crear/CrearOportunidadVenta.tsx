import { ClienteConNombre } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import {
  getOportunidadVenta,
  postOportunidadVenta,
} from "../infraestructura.ts";
import "./CrearOportunidadVenta.css";
import {
  metaNuevaOportunidadVenta,
  nuevaOportunidadVentaVacia,
} from "./crear.ts";
import { NuevaOportunidadVenta } from "./diseño.ts";

export const CrearOportunidadVenta = ({
  publicar,
  modeloVacio = nuevaOportunidadVentaVacia,
}: {
  publicar: ProcesarEvento;
  modeloVacio?: NuevaOportunidadVenta;
}) => {
  const { intentar } = useContext(ContextoError);

  const [creando, setCreando] = useState(false);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaOportunidadVenta,
    modeloVacio
  );

  const crear = useCallback(async () => {
    setCreando(true);
    const id = await intentar(() => postOportunidadVenta(modelo));
    const oportunidad = await intentar(() => getOportunidadVenta(id));
    publicar("oportunidad_creada", oportunidad);
  }, [modelo, publicar, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("creacion_oportunidad_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearOportunidadVenta">
        <h2>Nueva Oportunidad de Venta</h2>

        <quimera-formulario>
          <QInput label="Descripción" {...uiProps("descripcion")} />
          <ClienteConNombre
            {...uiProps("cliente_id", "nombre_cliente")}
            label="Seleccionar cliente"
          />
          <QInput label="Total" {...uiProps("importe")} />
        </quimera-formulario>

        <div className="botones">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Guardar
          </QBoton>
          <QBoton onClick={cancelar} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
