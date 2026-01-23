import { PaisSelector } from "#/comun/componentes/pais/pais.tsx";
import { Cliente } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { EstadoLead } from "#/crm/comun/componentes/estado_lead.tsx";
import { FuenteLead } from "#/crm/comun/componentes/fuente_lead.tsx";
import { TipoEntidadLead } from "#/crm/comun/componentes/tipo_entidad_lead.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Lead } from "../../diseño.ts";
import "./TabDatos.css";

export const TabDatos = ({ lead }: { lead: HookModelo<Lead> }) => {
  const { uiProps, modelo } = lead;

  return (
    <div className="TabMasDatos">
      <quimera-formulario>
        <EstadoLead {...uiProps("estado_id")} />
        <FuenteLead {...uiProps("fuente_id")} />
        {/* <MoleculaContacto
          contactoId={modelo.contacto_id as string | null}
          onChange={uiProps("contacto_id").onChange}
        /> */}
        <TipoEntidadLead {...uiProps("tipo")} />
        {modelo.tipo === "Cliente" && modelo.cliente_id ? (
          <Cliente {...uiProps("cliente_id", "nombre")} />
        ) : (
          // <Proveedor {...uiProps("proveedor_id", "nombre")} />
          <></>
        )}
        <QInput
          label="Nombre"
          {...uiProps("nombre")}
          deshabilitado={!!modelo.cliente_id}
        />
        <QInput label="CIF/NIF" {...uiProps("id_fiscal")} />
        <QInput label="Dirección" {...uiProps("direccion")} />
        <QInput label="Ciudad" {...uiProps("ciudad")} />
        <QInput label="Código Postal" {...uiProps("cod_postal")} />
        <QInput label="Provincia" {...uiProps("provincia")} />
        <PaisSelector label="País" {...uiProps("pais_id", "pais")} />
        <QInput label="Teléfono 1" {...uiProps("telefono_1")} />
        <QInput label="Teléfono 2" {...uiProps("telefono_2")} />
      </quimera-formulario>
    </div>
  );
};
