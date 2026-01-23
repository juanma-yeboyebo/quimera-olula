import { Cliente } from "#/crm/comun/componentes/cliente_con_nombre.tsx";
import { OportunidadVenta } from "#/crm/comun/componentes/oportunidad_venta.tsx";
import { ContactoSelector } from "#/ventas/comun/componentes/contacto.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Accion } from "../../diseño.ts";

export const TabDatos = ({ accion }: { accion: HookModelo<Accion> }) => {
  const { uiProps } = accion;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <Cliente {...uiProps("cliente_id", "nombre_cliente")} />
        <ContactoSelector {...uiProps("contacto_id", "nombre_contacto")} />
        <OportunidadVenta
          {...uiProps("oportunidad_id", "descripcion_oportunidad")}
        />
      </quimera-formulario>
    </div>
  );
};
