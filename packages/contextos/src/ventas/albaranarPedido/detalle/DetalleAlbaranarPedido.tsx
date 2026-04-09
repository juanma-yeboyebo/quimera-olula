import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import "./DetalleAlbaranarPedido.css";
import { contextoVacio } from "./dominio.ts";
import { Lineas } from "./Lineas/Lineas.tsx";
import { getMaquina } from "./maquina.ts";

export const DetalleAlbaranarPedido = () => {
  const params = useParams();
  const pedidoId = params.id;
  const pedidoIdCargadoRef = useRef<string | null>(null);

  const { ctx, emitir } = useMaquina(getMaquina, contextoVacio, async () => {});

  const { pedido, lineas } = ctx;

  useEffect(() => {
    if (pedidoId && pedidoId !== pedidoIdCargadoRef.current) {
      pedidoIdCargadoRef.current = pedidoId;
      emitir("cargar", pedidoId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoId]);

  if (
    ctx.estado === "INICIAL" ||
    ctx.estado === "VACIO" ||
    ctx.estado === "CARGANDO"
  ) {
    return <div className="AlbaranarPedido">Cargando...</div>;
  }

  return (
    <div className="AlbaranarPedido">
      <div className="DetalleAlbaranarPedido">
        <h2>
          Albaranar Pedido: {pedido.cliente.nombre_cliente} - {pedido.codigo}
        </h2>
        <Lineas
          pedido={pedido}
          lineas={lineas}
          estado={ctx.estado}
          publicar={emitir}
        />
      </div>
    </div>
  );
};
