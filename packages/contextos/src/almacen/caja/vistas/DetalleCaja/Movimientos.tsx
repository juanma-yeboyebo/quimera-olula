import { Articulo } from "#/almacen/articulo/diseño.ts";
import { leerCodBarras } from "#/almacen/articulo/infraestructura.ts";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QBoton, QInput } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { cargar, listaSeleccionableVacia } from "@olula/lib/entidad.js";
import { pipe } from "@olula/lib/funcional.js";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.js";
import { useContext, useEffect, useRef, useState } from "react";
import { Caja, MovimientoCaja } from "../../diseño.ts";
import { metaTablaMovimientosCaja } from "../../dominio.ts";
import { getMovimientosCaja, postLineaCaja } from "../../infraestructura.ts";

type Estado = "Inactivo";
type Contexto = {
  movimientos: ListaSeleccionable<MovimientoCaja>;
};

const setMovimientos =
  (
    aplicable: (
      movimientos: ListaSeleccionable<MovimientoCaja>
    ) => ListaSeleccionable<MovimientoCaja>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => ({
    ...maquina,
    contexto: {
      ...maquina.contexto,
      movimientos: aplicable(maquina.contexto.movimientos),
    },
  });

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      movimientos: listaSeleccionableVacia<MovimientoCaja>(),
    },
  },
  estados: {
    Inactivo: {
      movimientos_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setMovimientos(cargar(payload as MovimientoCaja[]))
        ),
    },
  },
};

export const MovimientoCajaLista = ({
  idCaja,
  modelo,
}: {
  publicar: EmitirEvento;
  idCaja: string;
  modelo: Caja;
}) => {
  const { intentar } = useContext(ContextoError);
  const [codBarras, setCodBarras] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const codBarrasRef = useRef<HTMLInputElement>(null);

  const [emitir, { contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });

  const { movimientos } = contexto;

  const leerCodBarrasFunc = async (codigo: string): Promise<Articulo> => {
    const articulo = await intentar(() => leerCodBarras(codigo));
    return articulo;
  };

  const onChangeCodBarras = (nuevoValor: string): void => {
    setCodBarras(nuevoValor);
  };

  const manejarKeyDown = (evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === "Enter" || evento.key === "Tab") {
      evento.preventDefault();
      if (codBarras.trim()) {
        crear();
      }
    }
  };

  const onChangeCantidad = (nuevoValor: string): void => {
    setCantidad(nuevoValor);
  };

  const crear = async () => {
    const articulo = await leerCodBarrasFunc(codBarras);
    await intentar(() => postLineaCaja(modelo, articulo.id, cantidad));
    refrescarMovimientos();
    setCodBarras("");
    setCantidad("1");
    setTimeout(() => {
      codBarrasRef.current?.focus();
    }, 0);
  };

  const refrescarMovimientos = async () => {
    getMovimientosCaja(idCaja).then(({ datos }) => {
      if (datos.length > 0) {
        emitir("movimientos_cargados", datos);
      }
    });
  };

  useEffect(() => {
    const cargarMovimientos = async () => {
      getMovimientosCaja(idCaja).then(({ datos }) => {
        if (datos.length > 0) {
          emitir("movimientos_cargados", datos);
        }
      });
    };
    cargarMovimientos();
  }, [idCaja, emitir]);

  useEffect(() => {
    const timer = setTimeout(() => {
      codBarrasRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <quimera-formulario>
        <QInput
          ref={codBarrasRef}
          label="Codigo de barras"
          tipo="texto"
          valor={codBarras}
          onChange={onChangeCodBarras}
          onKeyDown={manejarKeyDown}
          nombre="codigo_barras"
        />
        <QInput
          label="Cantidad"
          tipo="numero"
          valor={cantidad}
          onChange={onChangeCantidad}
          nombre="cantidad_transferencia"
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton onClick={crear} deshabilitado={false}>
          Guardar
        </QBoton>
      </div>
      <QTabla
        metaTabla={metaTablaMovimientosCaja}
        datos={movimientos.lista}
        cargando={false}
        // seleccionadaId={seleccionada}
        // onSeleccion={setSeleccionada}
        orden={["id", "ASC"]}
        onOrdenar={(_: string) => null}
      />
    </>
  );
};
