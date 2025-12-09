import { Box, QTitleBox, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  columna: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: theme.spacing(2),
  },
  titulo: {
    display: "flex",
    justifyContent: "flex-end",
  },
  cuerpo: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
function Totales({ totales = {}, ...props }) {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="flex-end" flexWrap="wrap">
      {totales.map((d, index) => (
        <QTitleBox key={d.name} titulo={d.name} className={classes.columna}>
          {index === totales.length - 1 ? (
            <Typography variant="h5">{util.euros(d.value)}</Typography>
          ) : (
            <Box display="flex" alignItems="flex-end" height="1.9rem">
              <Typography variant="body1">{util.euros(d.value)}</Typography>
            </Box>
          )}
        </QTitleBox>
      ))}
    </Box>
  );
}

export default Totales;
