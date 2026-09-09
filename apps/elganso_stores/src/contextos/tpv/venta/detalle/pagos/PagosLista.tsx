import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QIcono } from "@olula/componentes/index.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { PagoVentaTpv } from "../../diseño.ts";

export const PagosLista = ({
  pagos,
  pagoActivo,
  acciones,
  publicar,
}: {
  pagos: PagoVentaTpv[];
  pagoActivo: PagoVentaTpv | null;
  acciones?: Parameters<typeof QuimeraAcciones>[0]["acciones"];
  publicar: EmitirEvento;
}) => {
  const esMovil = useEsMovil();

  const setSeleccionado = (pago: PagoVentaTpv) => {
    publicar("pago_seleccionado", pago);
  };

  return (
    <ListadoSemiControlado
      metaTabla={getMetaTablaPagos()}
      entidades={pagos}
      totalEntidades={pagos.length}
      cargando={false}
      seleccionada={pagoActivo}
      onSeleccion={setSeleccionado}
      criteriaInicial={criteriaDefecto}
      onCriteriaChanged={() => null}
      modoInicial={esMovil ? "tarjetas" : "tabla"}
      renderAcciones={() =>
        acciones && acciones.length > 0 ? (
          <div className="botones maestro-botones ">
            <QuimeraAcciones acciones={acciones} />
          </div>
        ) : null
      }
    />
  );
};

const getMetaTablaPagos = () => {
  const meta: MetaTabla<PagoVentaTpv> = [
    {
      id: "arqueoAbierto",
      cabecera: "",
      render: (pago: PagoVentaTpv) => (
        <ColumnaEstadoTabla
          estados={{ abierto, cerrado }}
          estadoActual={pago.arqueoAbierto ? "abierto" : "cerrado"}
        />
      ),
    },
    {
      id: "fecha",
      cabecera: "Fecha",
      tipo: "fecha",
    },
    {
      id: "formaPago",
      cabecera: "Forma de pago",
      render: (pago: PagoVentaTpv) =>
        pago.idTipoTarjeta ? `${pago.formaPago} ${pago.idTipoTarjeta}` : pago.formaPago,
    },
    { id: "importe", cabecera: "Importe", tipo: "moneda" },
    { id: "idArqueo", cabecera: "Arqueo" },
  ];

  return meta;
};

const abierto = (
  <QIcono nombre={"circulo_relleno"} tamaño="sm" color="var(--color-exito-oscuro)" />
);

const cerrado = (
  <QIcono nombre={"circulo_relleno"} tamaño="sm" color="var(--color-deshabilitado-oscuro)" />
);
