import { Box, Field, Icon } from "@quimera/comps";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";

import { TpvArticulo } from "../../../comps";
import schemas from "../../../static/schemas";

function VentasNuevaLinea({ useStyles }) {
  const [{ nuevaLinea }, dispatch] = useStateValue();
  const classes = useStyles();

  const lineaCompleta = !!nuevaLinea.referencia && !!nuevaLinea.cantidad;

  return (
    <Quimera.Template id="VentasNuevaLinea">
      <Box tabIndex={0} mt={0} p={0}>
        <ListItem className={classes.card} disableGutters>
          <ListItemAvatar>
            <Avatar
              className={lineaCompleta ? classes.avatar : classes.avatarErroneo}
              onClick={() => dispatch({ type: "onNuevaLinea" })}
            >
              <Icon>add</Icon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <Box display="flex" justifyContent="space-between">
                <Box className={classes.articulo}>
                  <TpvArticulo
                    id="nuevaLinea.referencia"
                    label="Artículo"
                    fullWidth
                    margin="none"
                  />
                </Box>
                <Field.Schema
                  id="nuevaLinea.cantidad"
                  schema={schemas.lineas}
                  fullWidth
                  margin="none"
                />
              </Box>
            }
          />
        </ListItem>
      </Box>
    </Quimera.Template>
  );
}

export default VentasNuevaLinea;
