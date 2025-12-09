import { Box, Icon, IconButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    marginBottom: 4,
    display: "flex",
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  avatar: {
    backgroundColor: `${theme.palette.error.main}`,
  },
}));

function ListItemTramo({ linea, tareaIntermedia = false, selected = false, funSecondaryLeft, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const tramo = linea;

  return (
    <Box className={classes.card}>
      <IconButton
        id="deleteTramo"
        onClick={() => dispatch({ type: "onDeleteTramoClicked", payload: { item: tramo } })}
      >
        <Icon fontSize="large">delete_outlined</Icon>
      </IconButton>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{`${tramo.idUsuario}`}</Typography>
            {!tareaIntermedia && (
              <Typography variant="h6">{`Cantidad: ${tramo.cantidad}`}</Typography>
            )}
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography component="span" variant="body2" color="textPrimary">
              {`Inicio: ${util.formatDate(tramo.diaInicio) ?? "Sin registro"}, Hora: ${tramo.tiempoInicio ?? "Sin registro"
                }`}
            </Typography>
            <Typography component="span" variant="body2" color="textPrimary">
              {`Fin: ${util.formatDate(tramo.diaFin) ?? "Sin registro"}, Hora: ${tramo.tiempoFin ?? "Sin registro"
                }`}
            </Typography>
          </Box>
        }
      />
    </Box>
  );
}

export default ListItemTramo;
