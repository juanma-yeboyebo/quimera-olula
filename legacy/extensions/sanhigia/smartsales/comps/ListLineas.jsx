import { Box, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

import { SkewedListItem } from ".";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
  },
}));

export default function ListLineas({ lineas }) {
  const classes = useStyles();

  if (!lineas?.list?.length) {
    return <Typography variant="subtitle1">No hay líneas</Typography>;
  }

  return (
    <Box className={classes.box}>
      {lineas?.list?.map(linea => (
        <SkewedListItem
          key={linea?.referencia}
          text={linea?.descripcion}
          data1={["", `${linea?.referencia}`]}
          type="flex"
        />
      ))}
    </Box>
  );
}
