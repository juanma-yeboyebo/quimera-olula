import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue } from "quimera";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ListItemLineaInventario({ selected = false, model, modelName, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const linea = model;

  return (
    <QListItemModel modelName={modelName} model={linea} selected={selected}>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>{linea.cantidad}</Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{linea.desArticulo}</Typography>
            <Typography variant="body1">{linea.cantidad}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} mt={0.5} display="flex" justifyContent="space-between">
            <Typography component="span" variant="body2" color="textPrimary">
              {linea.referencia}
            </Typography>
            <Typography component="span" variant="body2" color="textPrimary">{`${linea.fecha} ${linea.hora || ""
              }`}</Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemLineaInventario;
