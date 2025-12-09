import { Box, Collapse, Icon, IconButton, QBoxButton, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText, Typography } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";
import { useState } from "react";
import './ListItemLineaInventario.style.scss';

const useStyles = makeStyles(theme => ({
  conCantidad: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  sinCantidad: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cPrimary: {
    backgroundColor: "#2D95C1 !important",
  },
  cSuccess: {
    backgroundColor: "#449D44 !important",
  },
  cWarning: {
    backgroundColor: "#EC971F !important",
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function dameColorLinea(linea) {
  let colorLinea = "";

  if (linea.sh_estado == "Cerrada") {
    colorLinea = "cSuccess";
  } else if (linea.cantidadIni != linea.cantidad) {
    colorLinea = "cPrimary";
  } else {
    colorLinea = "cWarning";
  }

  return colorLinea;
}

function ListItemLineaInventario({ selected = false, linea, modelName, callbackCambiada, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  // const linea = model;
  const claseLinea = dameColorLinea(linea);
  const [open, setOpen] = useState(false);

  const handleToggleOpenClicked = () => {
    setOpen(!open);
    // open && callbackFocus();
  };

  const handleChangeLinea = e => {
    callbackCambiada();
    // setAEnviar(e.item.shCantAlbaran || 0);
    // callbackFocus();
  };

  const IconoLock = linea.sh_estado === "Cerrada" ? "lock_open" : "lock";
  const TituloLock = linea.sh_estado === "Cerrada" ? "Abrir línea" : "Cerrar línea";

  if (linea.sh_estado === "Inventariada") {
    return <></>;
  }

  return (
    <>
      <QListItemModel modelName={modelName} model={linea} selected={selected}>
        {/* <ListItemAvatar>
          <Avatar className={classes[claseLinea]}>{linea.cantidad}</Avatar>
        </ListItemAvatar> */}
        <QBoxButton
          id="cerrarLinea"
          title={TituloLock}
          icon={IconoLock}
          className="CerrarLineaInventario"
          onClick={() => {
            dispatch({
              type: "onCerrarLineaClicked",
              payload: { idLineaCerrar: linea.idLinea },
            });
          }}
        />
        <ListItemText
          disableTypography
          primary={
            <Box width={1} display="flex" flexDirection="column">
              <Typography variant="body1" style={{ maxWidth: "400px", fontSize: "1rem" }}>
                {linea.desArticulo}

              </Typography>
              <Typography component="span" variant="body2" color="textPrimary">
                {`Ref. ${linea.referencia}`}
              </Typography>
              {linea.codigolote && (
                <Typography variant="body1">{`Lote: ${linea.codigolote}`}</Typography>
              )}
            </Box>
          }
          secondary={
            <Box width={1} mt={0.5} display="flex" flexDirection="column">

              <Typography component="span" variant="body2" color="textPrimary">
                {`Ref.Prov. ${linea.referenciaProv}`}
              </Typography>

              <Typography component="span" className="CantidadesLineaInventario" variant="body2" color="textPrimary">{`Cant. Ini. ${linea.cantidadIni} / Cant. Fin ${linea.cantidad}`}</Typography>
            </Box>
          }
        />
        <Box display="flex" justifyContent="flex-end" alignItems="center" className="ToogleOpenLineaInventario">
          <IconButton id="toggleOpen" onClick={handleToggleOpenClicked}>
            <Icon fontSize="large">{open ? "expand_less" : "expand_more"}</Icon>
          </IconButton>
        </Box>
      </QListItemModel>
      <Collapse in={open}>
        <Quimera.View
          key={linea.idLinea}
          id="LineaInventario"
          idLinea={linea.idLinea}
          lineaInicial={linea}
          callbackCambiada={handleChangeLinea}
          callbackCerrarLinea={handleToggleOpenClicked}
          open={open}
        />
      </Collapse>
    </>
  );
}

export default ListItemLineaInventario;
