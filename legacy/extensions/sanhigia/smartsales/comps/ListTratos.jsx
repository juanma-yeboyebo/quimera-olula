import { Typography } from "@quimera/comps";
import { navigate, useStateValue } from "quimera";

import { List } from "./";

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const valorTrato = v => {
  if (v < 1_000) {
    return v;
  }
  if (v < 1_000_000) {
    return v / 1_000;
  }

  return v / 1_000_000;
};

const valorTratoFormatter = v => {
  return Number(valorTrato(v)).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
const udTratoFormatter = v => {
  if (v < 1_000) {
    return "€";
  }
  if (v < 1_000_000) {
    return "k.";
  }

  return "m.";
};

export default function ListTratos({ tratos }) {
  const [, dispatch] = useStateValue();

  if (!tratos?.list?.length) {
    return <Typography variant="subtitle1">No hay tratos pendientes</Typography>;
  }

  const tratoActions = _trato => [
    {
      name: "Perdido",
      trigger: () =>
        dispatch({
          type: "onTratoEstadoChanged",
          payload: { id: _trato.id, estado: "Perdido" },
        }),
      class: "error",
    },
    {
      name: "Ganado",
      trigger: () =>
        dispatch({
          type: "onTratoEstadoChanged",
          payload: { id: _trato.id, estado: "Ganado" },
        }),
      class: "success",
    },
  ];

  return (
    <List
      dark={true}
      data={tratos?.list?.map(_trato => ({
        id: _trato.idTrato,
        text: _trato.titulo,
        auxData1: _trato.fecha.split("-")[2],
        auxData1ud: meses[parseInt(_trato.fecha.split("-")[1]) - 1],
        auxData2: valorTratoFormatter(_trato.valor),
        auxData2ud: udTratoFormatter(_trato.valor),
        success: _trato.estado === "Ganado",
        error: _trato.estado === "Perdido",
      }))}
      actions={tratoActions}
      onClick={_trato => navigate(`/ss/trato/${_trato.id}`)}
    />
  );
}
