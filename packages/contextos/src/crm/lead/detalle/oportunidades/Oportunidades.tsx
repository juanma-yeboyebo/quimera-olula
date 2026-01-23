import { BorrarOportunidadVenta } from "#/crm/oportunidadventa/borrar/BorrarOportunidadVenta.tsx";
import { nuevaOportunidadVentaVacia } from "#/crm/oportunidadventa/crear/crear.ts";
import { CrearOportunidadVenta } from "#/crm/oportunidadventa/crear/CrearOportunidadVenta.tsx";
import { OportunidadVenta } from "#/crm/oportunidadventa/diseño.ts";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { Lead } from "../../diseño.ts";
import { EstadoDetalleLead } from "../diseño.ts";

export const Oportunidades = ({
  lead,
  oportunidadActiva,
  estadoLead,
  publicar,
}: {
  lead: Lead;
  oportunidadActiva: OportunidadVenta;
  estadoLead: EstadoDetalleLead;
  publicar: EmitirEvento;
}) => {
  return (
    <>
      <div className="botones maestro-botones ">
        <QBoton onClick={() => publicar("creacion_oportunidad_solicitada")}>
          Nueva
        </QBoton>

        <QBoton
          deshabilitado={!oportunidadActiva}
          onClick={() => publicar("borrado_oportunidad_solicitado")}
        >
          Borrar
        </QBoton>
      </div>

      {/* <OportunidadesLista
        oportunidades={[]}
        seleccionada={oportunidadActiva?.id}
        publicar={publicar}
      /> */}

      {estadoLead === "CREANDO_OPORTUNIDAD" && (
        <CrearOportunidadVenta
          publicar={publicar}
          modeloVacio={{
            ...nuevaOportunidadVentaVacia,
            tarjeta_id: lead.id,
          }}
        />
      )}

      {oportunidadActiva && estadoLead === "BORRANDO_OPORTUNIDAD" && (
        <BorrarOportunidadVenta
          oportunidad={oportunidadActiva}
          publicar={publicar}
        />
      )}
    </>
  );
};
