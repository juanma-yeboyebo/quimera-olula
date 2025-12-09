import { Box, QBoxButton, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue } from "quimera";
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
  iconAdd: {
    "color": theme.palette.success.dark,
    "transition": "all .2s ease-in-out",
    "&:hover": {
      color: theme.palette.success.light,
      transform: "scale(1.2)",
    },
  },
  iconRemove: {
    "color": theme.palette.warning.dark,
    "transition": "all .2s ease-in-out",
    "&:hover": {
      color: theme.palette.warning.light,
      transform: "scale(1.2)",
    },
  },
}));

function ListItemComercioCampana({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, type, idCampana, avatar = "P", ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const comercio = model;

  const estilosQBoxButton = {
    add: { icon: classes.iconAdd },
    remove: { icon: classes.iconRemove },
  };

  return (
    <QListItemModel modelName={modelName} model={model} selected={false}>
      {/* <ListItemAvatar>
        <Avatar>{comercio?.nombre?.charAt(0)}</Avatar>
      </ListItemAvatar> */}
      {type === "add" && (
        <ListItemText
          disableTypography
          primary={
            <>
              <Box width={1} display="flex" justifyContent="flex-start" alignItems={"center"}>
                <QBoxButton
                  id="anadirComerciosCampana"
                  title="Añadir"
                  icon="add_circle"
                  estilos={estilosQBoxButton["add"]}
                  onClick={() => {
                    dispatch({
                      type: "onAnadirComercioClicked",
                      payload: {
                        idComercio: comercio.idComercio,
                        idCampana,
                      },
                    });
                  }}
                />
                <Typography variant="body1">{comercio.nombre || ""}</Typography>
              </Box>
            </>
          }
        />
      )}
      {type === "remove" && (
        <ListItemText
          disableTypography
          primary={
            <>
              <Box width={1} display="flex" justifyContent="flex-end" alignItems={"center"}>
                <Typography variant="body1">{comercio.nombre || ""}</Typography>
                <QBoxButton
                  id="quitarComerciosCampana"
                  title="Quitar"
                  icon="remove_circle"
                  estilos={estilosQBoxButton["remove"]}
                  onClick={() => {
                    dispatch({
                      type: "onQuitarComercioClicked",
                      payload: {
                        idComercio: comercio.idComercio,
                        idCampana,
                      },
                    });
                  }}
                />
              </Box>
            </>
          }
        />
      )}
    </QListItemModel>
  );
}

export default ListItemComercioCampana;
