import { almacenLocal } from "#/almacen/almacen/infraestructura.ts";
import { MaestroDetalle, QBoton } from "@olula/componentes/index.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
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
import { useCallback } from "react";
import { Caja } from "../diseño.ts";
import { metaTablaCaja } from "../dominio.ts";
import { getCajas } from "../infraestructura.ts";
import { CrearCaja } from "./CrearCaja.tsx";
import { DetalleCaja } from "./DetalleCaja/DetalleCaja.tsx";

type Estado = "Inactivo" | "Creando";

type Contexto = {
  cajas: ListaSeleccionable<Caja>;
};

const setCajas =
  (aplicable: (cajas: ListaSeleccionable<Caja>) => ListaSeleccionable<Caja>) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        cajas: aplicable(maquina.contexto.cajas),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      cajas: listaSeleccionableVacia<Caja>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      caja_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setCajas(cambiarItem(payload as Caja))),
      caja_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setCajas(seleccionarItem(payload as Caja))),
      caja_borrada: ({ maquina }) => {
        const { cajas } = maquina.contexto;
        if (!cajas.idActivo) {
          return maquina;
        }
        return pipe(maquina, setCajas(quitarItem(cajas.idActivo)));
      },
      cajas_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setCajas(cargar(payload as Caja[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setCajas((cajas) => ({
            ...cajas,
            idActivo: null,
          }))
        ),
    },
    Creando: {
      caja_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setCajas(incluirItem(payload as Caja, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleCaja = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { cajas } = contexto;
  const almacenActual = almacenLocal.obtener();
  console.log("Almacén actual en MaestroConDetalleCaja:", almacenActual);

  const setEntidades = useCallback(
    (payload: Caja[]) => emitir("cajas_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Caja) => emitir("caja_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(cajas);

  if (!almacenActual) {
    console.log("No hay almacén seleccionado");
    return (
      <div>
        Seleccione un almacén para ver las cajas.
        <a href="./almacenes">Ir a Almacenes</a>
      </div>
    );
  }

  return (
    <div className="Caja">
      <MaestroDetalle<Caja>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Cajas: {almacenActual}</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaCaja}
        modoDisposicion="maestro-50"
        entidades={cajas.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getCajas}
        Detalle={
          <DetalleCaja
            key={seleccionada?.id}
            cajaInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearCaja publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
