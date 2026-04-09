import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { CrmContacto } from "../../diseño.ts";
import { metaTablaCrmContactos } from "./dominio.ts";

export const TabCrmContactosLista = ({
  contactos,
  seleccionado,
  emitir,
  cargando,
}: {
  contactos: CrmContacto[];
  seleccionado: CrmContacto | null;
  emitir: (evento: string, payload?: unknown) => void;
  cargando: boolean;
}) => {
  return (
    <div className="CrmContactos">
      <ListadoSemiControlado
        metaTabla={metaTablaCrmContactos}
        entidades={contactos}
        totalEntidades={contactos.length}
        cargando={cargando}
        seleccionada={seleccionado}
        onSeleccion={(contacto) => emitir("contacto_seleccionado", contacto)}
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
      />
    </div>
  );
};
