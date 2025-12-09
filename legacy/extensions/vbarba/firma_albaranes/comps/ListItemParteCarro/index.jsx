import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Icon, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  avatarFirmado: {
    color: theme.palette.success.main,
  },
  avatarNoFirmado: {
    color: theme.palette.error.main,
  },
  // avatarEnBorrador: {
  //   color: theme.palette.info.main,
  // },
  // avatarServidoParcial: {
  //   color: theme.palette.warning.main,
  // },
}));

function calculaColorAvatar(model) {
  if (model.firmado) {
    return "avatarFirmado";
  }

  return "avatarNoFirmado";
}

function calculaNombre(model) {
  let nombre = "";
  if (model.porCliente) {
    nombre = model.aplicadoA === "Cliente" ? model.nombreCliente : model.nombreTrans;
  } else {
    nombre = model.nombreProv;
  }

  return nombre;
}

function calculaTipoCodigo(model) {
  let codigo = "";
  if (model.porCliente) {
    codigo = model.aplicadoA === "Cliente" ? model.codCliente : model.codTransportista;
  } else {
    codigo = model.codProveedor;
  }
  // `${parte.codCliente ? parte.codCliente : ""}`;

  return codigo;
}

function ListItemParteCarro({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const parte = model;

  return (
    <QListItemModel modelName={modelName} model={parte} selected={selected}>
      <ListItemAvatar>
        <Icon color="primary" fontSize="large" className={classes[calculaColorAvatar(parte)]}>
          radio_button_unchecked
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{calculaNombre(parte)}</Typography>
            <Typography variant="body1">{parte.codigoParte}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {funSecondaryLeft ? funSecondaryLeft(parte) : calculaTipoCodigo(parte)}
              </Typography>
            </Box>
            {parte.idDocumentoCli && parte.tipoDocCli === "Albarán" && (
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {parte.codDocumentoCli}
                </Typography>
              </Box>
            )}
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">{`${util.formatDate(
                parte.fecha,
              )}`}</Typography>
            </Box>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemParteCarro;
