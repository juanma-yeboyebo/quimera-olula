import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { Articulo } from "../diseño.ts";
import {
  contextoDetalleArticuloInicial,
  guardarArticulo,
  metaArticulo,
} from "./dominio.ts";
import { getMaquina } from "./maquina.ts";
import { TabVentas } from "./TabVentas.tsx";

export const PanelVentasArticulo = ({ articuloId }: { articuloId: string }) => {
  const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleArticuloInicial);

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

  if (!ctx.articulo.id) return null;

  return <TabVentas form={form} articulo={ctx.articulo} />;
};
