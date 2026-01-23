import { BorrarOportunidadVenta } from "#/crm/oportunidadventa/borrar/BorrarOportunidadVenta.tsx";
import { nuevaOportunidadVentaVacia } from "#/crm/oportunidadventa/crear/crear.ts";
import { CrearOportunidadVenta } from "#/crm/oportunidadventa/crear/CrearOportunidadVenta.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cargar,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { useContext, useEffect } from "react";
import { OportunidadVenta } from "../../../oportunidadventa/diseño.ts";
import { metaTablaOportunidadVenta } from "../../../oportunidadventa/maestro/maestro.ts";
import { Lead } from "../../diseño.ts";
import { getOportunidadesVentaLead } from "../../infraestructura.ts";

type Estado = "Inactivo" | "Creando" | "Borrando" | "Cargando";

type Contexto = {
  oportunidades: ListaSeleccionable<OportunidadVenta>;
};

const setAcciones =
  (
    aplicable: (
      oportunidades: ListaSeleccionable<OportunidadVenta>
    ) => ListaSeleccionable<OportunidadVenta>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        oportunidades: aplicable(maquina.contexto.oportunidades),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      oportunidades: listaSeleccionableVacia<OportunidadVenta>(),
    },
  },
  estados: {
    Cargando: {
      oportunidades_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo"),
          setAcciones(cargar(payload as OportunidadVenta[]))
        ),
    },
    Inactivo: {
      crear: "Creando",
      borrar: "Borrando",
      oportunidad_seleccionada: ({ maquina, payload }) =>
        pipe(
          maquina,
          setAcciones(seleccionarItem(payload as OportunidadVenta))
        ),
      cargar: "Cargando",
    },
    Creando: {
      oportunidad_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo"),
          setAcciones(incluirItem(payload as OportunidadVenta, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
    Borrando: {
      oportunidad_borrada: ({ maquina, setEstado }) => {
        const idActivo = maquina.contexto.oportunidades.idActivo;
        if (!idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setEstado("Inactivo"),
          setAcciones(quitarItem(idActivo))
        );
      },
      borrado_cancelado: "Inactivo",
    },
  },
};

export const TabOportunidades = ({ lead }: { lead: HookModelo<Lead> }) => {
  const { intentar } = useContext(ContextoError);

  const idLead = lead.modelo.id;

  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { oportunidades } = contexto;

  useEffect(() => {
    const cargarOportunidades = async () => {
      const nuevasOportunidades = await intentar(() =>
        getOportunidadesVentaLead(idLead)
      );
      emitir("oportunidades_cargadas", nuevasOportunidades);
    };
    emitir("cargar");
    cargarOportunidades();
  }, [emitir, idLead, intentar]);

  return (
    <div className="TabOportunidades">
      <div className="TabOportunidadesOportunidades maestro-botones">
        <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>

        <QBoton
          onClick={() => emitir("borrar")}
          deshabilitado={!oportunidades.idActivo}
        >
          Borrar
        </QBoton>
      </div>

      {estado === "Creando" && (
        <CrearOportunidadVenta
          publicar={emitir}
          modeloVacio={{
            ...nuevaOportunidadVentaVacia,
            tarjeta_id: lead.modelo.id,
          }}
        />
      )}

      {estado === "Borrando" && (
        <BorrarOportunidadVenta
          oportunidad={
            oportunidades.lista.find(
              (oportunidad) => oportunidad.id === oportunidades.idActivo
            )!
          }
          publicar={emitir}
        />
      )}

      <QTabla
        metaTabla={metaTablaOportunidadVenta}
        datos={oportunidades.lista}
        cargando={estado === "Cargando"}
        seleccionadaId={oportunidades.idActivo || undefined}
        onSeleccion={(oportunidadventa) =>
          emitir("oportunidad_seleccionada", oportunidadventa)
        }
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
