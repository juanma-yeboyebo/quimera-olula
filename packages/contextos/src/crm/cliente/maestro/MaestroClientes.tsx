import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QAvatar, QBoton, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useCallback, useEffect, useState } from "react";
import { DetalleCliente } from "../detalle/DetalleCliente.tsx";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "./maestro.ts";
import "./MaestroClientes.css";
import { getMaquina } from "./maquina.ts";

type Layout = "TABLA" | "TARJETA";

export const MaestroClientes = () => {
  const { id, criteria } = getUrlParams();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    clientes: listaActivaEntidadesInicial<Cliente>(id, criteria),
  });

  useUrlParams(ctx.clientes.activo, ctx.clientes.criteria);

  useEffect(() => {
    emitir("recarga_de_clientes_solicitada", ctx.clientes.criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const esMovil = useEsMovil();
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout(layout === "TARJETA" ? "TABLA" : "TARJETA"),
    [layout, setLayout]
  );

  return (
    <div className="Cliente">
      <MaestroDetalle<Cliente>
        Maestro={
          <>
            <h2>Clientes</h2>
            {!esMovil && (
              <div className="maestro-botones">
                <QBoton
                  texto={
                    layout === "TARJETA"
                      ? "Cambiar a TABLA"
                      : "Cambiar a TARJETA"
                  }
                  onClick={cambiarLayout}
                />
              </div>
            )}

            <Listado<Cliente>
              metaTabla={metaTablaCliente}
              criteria={ctx.clientes.criteria}
              modo={esMovil || layout === "TARJETA" ? "tarjetas" : "tabla"}
              tarjeta={TarjetaCliente}
              entidades={ctx.clientes.lista}
              totalEntidades={ctx.clientes.total}
              seleccionada={ctx.clientes.activo}
              onSeleccion={(payload) => emitir("cliente_seleccionado", payload)}
              onCriteriaChanged={(payload) =>
                emitir("criteria_cambiado", payload)
              }
            />
          </>
        }
        Detalle={<DetalleCliente id={ctx.clientes.activo} publicar={emitir} />}
        seleccionada={ctx.clientes.activo}
        modoDisposicion="maestro-50"
      />
    </div>
  );
};

const TarjetaCliente = (cliente: Cliente) => {
  return (
    <QTarjetaGenerica
      avatar={<QAvatar nombre={cliente.nombre} />}
      arribaIzquierda={cliente.nombre}
      abajoIzquierda={cliente.email}
      abajoDerecha={cliente.telefono1}
    />
  );
};
