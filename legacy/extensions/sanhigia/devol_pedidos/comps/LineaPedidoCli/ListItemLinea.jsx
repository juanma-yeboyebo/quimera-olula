import { Box, Chip, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";

const useStyles = makeStyles(theme => ({
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  avatarServido: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  avatarNoServido: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
  avatarServidoParcial: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  chipServidoParcial: {
    borderRadius: 4,
    marginLeft: theme.spacing(0.5),
    fontSize: "0.8rem",
    backgroundColor: `${theme.palette.warning.main} !important`,
    color: `${theme.palette.common.white} !important`,
    textTransform: "uppercase",
  },
}));

function dameEstadoServido(linea) {
  return linea.canServida >= linea.cantidad ? "S" : linea.canServida === 0 ? "N" : "P";
}

const colorServido = {
  S: "avatarServido",
  N: "avatarNoServido",
  P: "avatarServidoParcial",
};

const iconoServido = {
  S: "radio_button_unchecked",
  N: "radio_button_unchecked",
  P: "brightness_2",
};

function ListItemLinea({ selected = false, funPrimaryLeft, funPrimaryRight, hideSecondary = false, model, modelName, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const linea = model;
  const servida = dameEstadoServido(linea);

  return (
    <QListItemModel modelName={modelName} model={linea} selected={selected}>
      <ListItemAvatar>
        <Avatar className={classes[colorServido[servida]]}>{linea.cantidad}</Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              {funPrimaryLeft ? (
                funPrimaryLeft(linea)
              ) : (
                <Box>
                  <Typography variant="body1">{linea.descripcion}</Typography>
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
            <Box width={1} mt={0.5} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${linea.referencia}`}</Typography>
                {linea.canServida < linea.cantidad && <Chip label={`${linea.canServida}/${linea.cantidad}`} size="small" className={classes.chipServidoParcial} />}
              </Box>
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">{`${linea.cantidad
                  } x ${util.euros(linea.pvpUnitario)}`}</Typography>
              </Box>
            </Box>
          )
        }
      />
    </QListItemModel>
  );
}

export default ListItemLinea;
