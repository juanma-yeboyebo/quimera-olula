import { Usuario } from "#/comun/componentes/usuario.tsx";
import { ClienteConNombre } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { EstadoOportunidad } from "#/crm/comun/componentes/estado_oportunidad_venta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
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
  publicar: EmitirEvento;
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
          <EstadoOportunidad label="Estado" {...uiProps("estado_id")} />
          <QInput label="Probabilidad (%)" {...uiProps("probabilidad")} />
          <QInput {...uiProps("fecha_cierre")} label="Fecha Cierre" />
          <QInput label="Total" {...uiProps("importe")} />
          <Usuario {...uiProps("responsable_id")} label="Responsable" />
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
