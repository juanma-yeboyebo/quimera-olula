import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { BorrarArticulo } from "../borrar/BorrarArticulo.tsx";
import { Articulo } from "../diseño.ts";
import "./DetalleArticulo.css";
import { contextoArticuloInicial } from "./dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TabGeneral } from "./TabGeneral.tsx";

const titulo = (articulo: Articulo) => articulo.descripcion;

export const DetalleArticulo = ({
  id,
  publicar = async () => {},
}: {
  id?: string;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const articuloId = id ?? params.id;
  const navigate = useNavigate();

  const { ctx, emitir } = useMaquina(
    getMaquina,
    contextoArticuloInicial,
    publicar
  );

  useEffect(() => {
    emitir("articulo_id_cambiado", articuloId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articuloId]);

  const { estado, articulo } = ctx;

  if (!articulo.id) return null;

  const acciones = [
    {
      texto: "Editar en ventas",
      onClick: () => navigate(`/ventas/articulo?id=${articulo.id}`),
    },
    {
      texto: "Editar en compras",
      onClick: () => navigate(`/compras/articulo?id=${articulo.id}`),
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrado_solicitado"),
      advertencia: true,
    },
  ];

  return (
    <Detalle
      id={articulo.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={articulo}
      cerrarDetalle={() => emitir("articulo_deseleccionado", null)}
    >
      <div className="DetalleArticulo">
        <div className="maestro-botones">
          <QuimeraAcciones acciones={acciones} vertical />
        </div>
        <Tabs
          children={[
            <Tab
              key="tab-general"
              label="General"
              children={<TabGeneral articulo={articulo} />}
            />,
          ]}
        />
        {estado === "BORRANDO_ARTICULO" && (
          <BorrarArticulo
            articuloId={articulo.id}
            publicar={emitir}
            onCancelar={() => emitir("borrado_cancelado")}
          />
        )}
      </div>
    </Detalle>
  );
};
