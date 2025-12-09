import { Backdrop, Box, CircularProgress, QBox, Typography } from "@quimera/comps";
import { List, ListItem, ListItemText } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React from "react";

function MontadoInternoMaster({ useStyles }) {
  const [{ cargandoDatos, contador, contadorPendientes, unidades }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  return (
    <Quimera.Template id="MontadoInternoMaster">
      <Backdrop open={cargandoDatos} style={{ zIndex: 999 }}>
        Cargando Datos&nbsp;&nbsp;
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <Box display='flex' width={1} justifyContent='flex-end'>
        <strong>Esqueletos mostrados: { count }</strong>
      </Box> */}
      <br />
      <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
        <QBox titulo={`${util.getUser().nombre} (${contador} / ${contador + contadorPendientes})`}>
          <List>
            {unidades.idList.map(idUnidad => (
              <ListItem
                key={unidades.dict[idUnidad].idUnidad}
                divider={true}
                className={
                  unidades.dict[idUnidad].pausada === "Si"
                    ? classes.pausada
                    : unidades.dict[idUnidad].estadotarea === "PTE"
                    ? classes.pendiente
                    : classes.encurso
                }
                onClick={() =>
                  dispatch({
                    type: "onUnidadesClicked",
                    payload: { item: unidades.dict[idUnidad] },
                  })
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex">
                      <Box flexGrow={1}>
                        <Typography>
                          <strong>{unidades.dict[idUnidad].idUnidad}</strong>{" "}
                          {`Modelo: ${unidades.dict[idUnidad].modelo} Conf: ${unidades.dict[idUnidad].configuracion} Tela: ${unidades.dict[idUnidad].idtela}`}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box display="flex">
                      <Box flexGrow={1}>
                        <Typography>
                          {`F. Prevista: ${util.formatDate(unidades.dict[idUnidad].fechaprevista)}`}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </QBox>
      </Box>
      {/* <Dialog open={abrirDialogoUP} maxWidth='md'>
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="form-dialog-description">
            <strong>Modelo</strong> - {dialogModelo}<br/>
            <strong>Configuración</strong> - {dialogConf}<br/>
            <strong>Tela</strong> - {dialogTela}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!iniciada ? 
            <IconButton disabled={pausada} title="Iniciar" onClick={() => dispatch({ type: 'onIniciarClicked', payload: { } })}>
              <Icon>play_circle_outline</Icon>
            </IconButton>
            : <IconButton disabled={pausada} title="Terminar" onClick={() => dispatch({ type: 'onTerminarClicked', payload: { } })}>
                <Icon>check_circle_outline</Icon>
              </IconButton>
          }
          {!pausada ? 
            <IconButton disabled={!iniciada} title="Pausar" onClick={() => dispatch({ type: 'onPausarClicked', payload: { } })}>
              <Icon>pause_circle_outline</Icon>
            </IconButton>
            : <IconButton title="Reanudar" onClick={() => dispatch({ type: 'onReanudarClicked', payload: { } })}>
                <Icon>not_started</Icon>
              </IconButton>
          }
          <Button id='volver' text='Volver' />
        </DialogActions>
      </Dialog> */}
    </Quimera.Template>
  );
}

export default MontadoInternoMaster;
