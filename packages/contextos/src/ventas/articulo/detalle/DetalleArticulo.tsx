import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Articulo } from "../diseño.ts";
import "./DetalleArticulo.css";
import {
  contextoDetalleArticuloInicial,
  guardarArticulo,
  metaArticulo,
} from "./dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TabGeneral } from "./TabGeneral.tsx";
import { TabVentas } from "./TabVentas.tsx";

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
    contextoDetalleArticuloInicial,
    publicar
  );

  const autoGuardar = useCallback(
    async (articulo: Articulo) => {
      await guardarArticulo(ctx, articulo);
      await emitir("articulo_guardado");
    },
    [ctx, emitir]
  );

  const form = useModelo(metaArticulo, ctx.articulo, autoGuardar);

  useEffect(() => {
    emitir("articulo_id_cambiado", articuloId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articuloId]);

  const { articulo } = ctx;

  if (!articulo.id) return null;

  const acciones = [
    {
      texto: "Ver en almacén",
      onClick: () => navigate(`/almacen/articulo?id=${articulo.id}`),
    },
  ];

  return (
    <div className="DetalleArticulo">
      <Detalle
        id={articulo.id}
        obtenerTitulo={titulo}
        setEntidad={() => {}}
        entidad={articulo}
        cerrarDetalle={() => emitir("articulo_deseleccionado", null)}
      >
        <div className="maestro-botones">
          <QuimeraAcciones acciones={acciones} vertical />
        </div>
        <Tabs
          children={[
            <Tab
              key="tab-general"
              label="General"
              children={<TabGeneral form={form} articuloId={articulo.id} />}
            />,
            <Tab
              key="tab-ventas"
              label="Ventas"
              children={<TabVentas form={form} articulo={articulo} />}
            />,
          ]}
        />
      </Detalle>
    </div>
  );
};
