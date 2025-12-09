import { Box, Button, QListItemModel, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import { useState } from "react";

// import { noImage } from "../../static/local";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ItemLineaCarritoCheckout({ model, modelName, selected = false, avatar = "C", ...props }) {
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const [_, dispatch] = useStateValue();

  const eliminarLinea = () => {
    dispatch({
      type: "onCambiarCantidadLineaClicked",
      payload: {
        referencia: model.referencia,
        cantidad: 0,
        idLinea: model.idLinea,
      },
    });
  };

  const linea = model;
  const baseImageSrc = util.getEnvironment().getUrlImages();
  linea.urlImagen = `${baseImageSrc}/modelos/${linea.idModelo.toUpperCase()}.jpg`;
  const noImage = `${baseImageSrc}/noimage.png`;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      {/* <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        <IconButton id="saveLinea" size="small">
          <Icon color="primary" fontSize="large">
            delete
          </Icon>
        </IconButton>
      </Box> */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        style={{ gap: "1rem", width: "100%" }}
      >
        <Box display="flex" flexDirection="column" alignItems={"center"}>
          <img
            src={linea.urlImagen}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = noImage;
            }}
            // height={100}
            width={120}
            alt={linea.descripcion}
            loading="lazy"
          />
          <Typography variant="caption">Imagen ejemplo del modelo</Typography>
        </Box>
        <Box style={{ width: "100%" }}>
          <ListItemText
            disableTypography
            primary={
              <Box flexGrow={1}>
                <Box>
                  <Typography variant="body1">
                    Modelo: <b>{linea.idModelo}</b>, Tela: <b>{linea.idTela}</b>
                  </Typography>
                  {linea.config.map(conf => (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      style={{
                        gap: "1rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      <Typography variant="body1">{`${conf.desc}`}</Typography>
                      <Typography variant="body1">{`${util.euros(conf.pvp)}`}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box mt={1}>
                  <Typography align="right" variant="body1">
                    TOTAL: <b>{util.euros(linea.pvpTotal)}</b>
                  </Typography>
                </Box>
                <Box mt={1} display="flex" alignItems="flex-start" justifyContent={"flex-end"}>
                  <Button
                    id="volverCatalogo"
                    text="Eliminar"
                    variant="outlined"
                    color="primary"
                    onClick={eliminarLinea}
                  />
                </Box>
              </Box>
            }
          />
        </Box>
      </Box>
    </QListItemModel>
  );
}

export default ItemLineaCarritoCheckout;
