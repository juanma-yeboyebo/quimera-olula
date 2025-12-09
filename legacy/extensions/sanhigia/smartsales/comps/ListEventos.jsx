import { Box, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { navigate } from "quimera";

import { SkewedListItem } from ".";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
  },
}));

export default function ListEventos({ eventos }) {
  const classes = useStyles();
  const listaEventos = eventos?.list
    ? eventos?.list
    : eventos?.idList
      ? Object.values(eventos.dict)
      : [];

  if (!listaEventos?.length) {
    return <Typography variant="subtitle1">No hay eventos</Typography>;
  }

  return (
    <Box className={classes.box}>
      {listaEventos?.map(evento => (
        <SkewedListItem
          key={evento?.codEvento}
          onClick={() => navigate(`/ss/evento/${evento?.codEvento}`)}
          dosGrid
          text={evento?.nombre}
          data1={["", `Fecha: ${evento.fechaIni}`]}
        />
      ))}
    </Box>
  );
}
