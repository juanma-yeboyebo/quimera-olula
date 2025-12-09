import { Box, Icon, ListItem } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import React from "react";
import { noImage } from "../../static/local";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.success.main}`,
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    marginLeft: '-15px',
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ListItemMiLineaCarrito({ selected = false, funPrimaryLeft, funPrimaryRight, hideSecondary = false, model, modelName, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const linea = model;

  return (
    <ListItem
      className={selected ? classes.cardSelected : classes.card}
    >
      <ListItemAvatar>
        <Box minWidth={100}>
          <img
            src={linea.urlImagen}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = noImage;
            }}
            height={100}
            alt={linea.descripcion}
            loading="lazy"
          />
        </Box>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              {funPrimaryLeft ? (
                funPrimaryLeft(linea)
              ) : (
                <Box display="inline">
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >{`${linea.referencia}`}</Typography>
                </Box>
              )}
            </Box>
            <Box display="inline">
              {funPrimaryRight ? (
                funPrimaryRight(linea)
              ) : (
                <Typography variant="body1">{util.euros(linea.pvpTotal)}</Typography>
              )}
            </Box>
          </Box>
        }
        secondary={
          !hideSecondary && (
            <Box>
              <Box width={1} mt={0.5} display="flex" justifyContent="space-between">
                <Box display="inline">
                  <Typography variant="body1">{linea.descripcion}</Typography>
                </Box>
                <Box display="inline">
                  <Typography component="span" variant="body2" color="textPrimary">{`${linea.cantidad
                    } x ${util.euros(linea.pvpUnitario)}`}</Typography>
                </Box>

              </Box>

              <Box display="flex" alignItems="flex-start">
                <Icon fontSize="small">open_in_full</Icon>
                <Box pl={1}></Box>
                <Typography component="span" variant="body2" color="textPrimary">
                  {`${linea.litraje || ""}`}
                </Typography>
                {!model.disponible && (
                  <Box pl={1}>
                    <ChipNoDisponible />
                  </Box>
                )}
              </Box>
              <Box display="block">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${linea.litraje}`}</Typography>
              </Box>
            </Box>
          )
        }
      />
    </ListItem>
  );
}

export default ListItemMiLineaCarrito;
