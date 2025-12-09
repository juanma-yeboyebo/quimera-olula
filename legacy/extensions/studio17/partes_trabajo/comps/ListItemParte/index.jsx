import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  firmado: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  borrador: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
}));

function ListItemParte({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const parte = model;
  const editable = parte.estadoParte === "Borrador";

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        {renderAvatar ? (
          <Avatar className={editable ? classes.borrador : classes.firmado}>
            {parte?.trabajador.toString().charAt(0).toUpperCase()}
          </Avatar>
        ) : null}
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography variant="body1">{parte.codParte}</Typography>
              <Typography variant="body1">{util.horasToHorasMins(parte.horas)}</Typography>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography component="span" variant="body2" color="textPrimary">{`${util.formatDate(
                parte.fecha,
              )}`}</Typography>
            </Box>
          </>
        }
      />
    </QListItemModel>
  );
}

export default ListItemParte;
