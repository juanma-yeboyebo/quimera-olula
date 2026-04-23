import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { boolAString, direccionCompleta } from "@olula/lib/dominio.ts";
import { DirCliente } from "../../diseño.ts";
import { puedoMarcarDireccionFacturacion } from "./dominio.ts";
import "./TabDirecciones.css";

const metaTablaDirecciones = [
  {
    id: "direccion",
    cabecera: "Dirección",
    render: (direccion: DirCliente) => direccionCompleta(direccion),
  },
  {
    id: "dir_facturacion",
    cabecera: "Facturación",
    render: (direccion: DirCliente) => boolAString(direccion.dir_facturacion),
  },
  {
    id: "dir_envio",
    cabecera: "Envío",
    render: (direccion: DirCliente) => boolAString(direccion.dir_envio),
  },
];

export const TabDireccionesLista = ({
  direcciones,
  seleccionada,
  emitir,
  cargando,
}: {
  clienteId: string;
  direcciones: DirCliente[];
  seleccionada: DirCliente | null;
  emitir: (evento: string, payload?: unknown) => void;
  cargando: boolean;
}) => {
  const acciones = [
    {
      texto: "Nueva",
      onClick: () => emitir("alta_solicitada"),
    },
    {
      texto: "Editar",
      onClick: () => seleccionada && emitir("edicion_solicitada"),
      deshabilitado: !seleccionada,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      advertencia: true,
      onClick: () => emitir("borrado_solicitado"),
      deshabilitado: !seleccionada,
    },
    {
      texto: "Facturación",
      onClick: () => emitir("facturacion_solicitada"),
      deshabilitado:
        !seleccionada || !puedoMarcarDireccionFacturacion(seleccionada),
    },
  ];

  return (
    <ListadoSemiControlado
      metaTabla={metaTablaDirecciones}
      entidades={direcciones}
      totalEntidades={direcciones.length}
      cargando={cargando}
      seleccionada={seleccionada}
      onSeleccion={(direccion) => emitir("direccion_seleccionada", direccion)}
      criteriaInicial={criteriaDefecto}
      onCriteriaChanged={() => null}
      renderAcciones={() => (
        <div className="TabDireccionesLista maestro-botones">
          <QuimeraAcciones acciones={acciones} />
        </div>
      )}
    />
  );
};
