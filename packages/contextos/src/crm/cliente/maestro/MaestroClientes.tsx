import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useCallback, useEffect, useState } from "react";
import { Cliente } from "../diseño.ts";
import { DetalleCliente } from "../vistas/DetalleCliente/DetalleCliente.tsx";
import { metaTablaCliente } from "./maestro.ts";
import "./MaestroClientes.css";
import { getMaquina } from "./maquina.ts";

export const MaestroClientes = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    clientes: [],
    totalClientes: 0,
    activo: null,
  });

  const crear = useCallback(
    () => emitir("creacion_de_cliente_solicitada"),
    [emitir]
  );

  const setSeleccionado = useCallback(
    (payload: Cliente) => emitir("cliente_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_clientes_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="Cliente">
      <MaestroDetalleControlado<Cliente>
        Maestro={
          <>
            <h2>Clientes</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo</QBoton>
            </div>
            <ListadoControlado<Cliente>
              metaTabla={metaTablaCliente}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.clientes}
              totalEntidades={ctx.totalClientes}
              seleccionada={ctx.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleCliente clienteInicial={ctx.activo} publicar={emitir} />
        }
        seleccionada={ctx.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};
