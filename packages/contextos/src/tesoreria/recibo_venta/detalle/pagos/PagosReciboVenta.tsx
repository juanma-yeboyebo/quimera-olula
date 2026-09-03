import { MetaTabla } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MovimientoRecibo } from "../../diseño.js";

const metaTablaPagos: MetaTabla<MovimientoRecibo> = [
  { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
  { id: "tipo", cabecera: "Tipo", tipo: "texto" },
  { id: "estado", cabecera: "Estado", tipo: "booleano" },
];

export const PagosReciboVenta = ({ pagos }: { pagos: MovimientoRecibo[] }) => {
  return (
    <div className="PagosReciboVenta">
      <h3>Pagos y devoluciones</h3>

      <ListadoSemiControlado
        metaTabla={metaTablaPagos}
        entidades={pagos}
        totalEntidades={pagos.length}
        cargando={false}
        seleccionada={null}
        onSeleccion={() => null}
        criteriaInicial={criteriaDefecto}
        onCriteriaChanged={() => null}
        modo="tabla"
      />
    </div>
  );
};
