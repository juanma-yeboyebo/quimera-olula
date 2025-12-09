import { Box, Field, Grid, Icon, IconButton } from "@quimera/comps";
import { Direccion } from "@quimera-extension/base-area_clientes";
import { DirCliente as QDirCliente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

import schemas from "../../static/schemas";

function DirCliente({ callbackGuardada, codCliente, docDireccion, useStyles }) {
  const [{ bloqueada, direccion, direccionValida, focused, modo }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        docDireccion,
        callbackGuardada,
      },
    });
  }, [dispatch, docDireccion, callbackGuardada]);

  return (
    <Quimera.Template id="DirCliente">
      {/* <Box className={modo === 'ver' ? classes.seccion : classes.seccionActivada} tabIndex={0}
        onKeyPress={(event) => dispatch({ type: 'onKeyPressed', payload: { event } })}
        onFocus={() => dispatch({ type: 'onFocus', payload: { focused: true } })}
        onBlur={() => dispatch({ type: 'onFocus', payload: { focused: false } })}
        onClick={() => modo === 'ver' && dispatch({ type: 'onEditarClicked' })}
        
      >
        <Typography variant='overline'>Dirección de envío</Typography>
        {modo === 'ver'
          ? <Box display='flex' justifyContent='space-between'>
            <Box >
              <Direccion documento={direccion} inline />
            </Box>
            {focused && <IconButton id='editar' ><Icon style={{ position: 'absolute', top: -20 }}>edit</Icon></IconButton>}
          </Box>
          :  */}
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Box width={1}>
                {bloqueada ? (
                  <QDirCliente id="direccion.codDir" codCliente={codCliente} fullWidth autoFocus />
                ) : (
                  <Direccion documento={direccion} inline />
                )}
              </Box>
              <IconButton id="bloquear">
                <Icon>{bloqueada ? "lock" : "lock_open"}</Icon>
              </IconButton>
            </Box>
          </Grid>
          {!bloqueada && (
            <>
              <Grid item xs={2}>
                <Field.Schema
                  id="direccion/dirTipoVia"
                  schema={schemas.dirClientes}
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={8}>
                <Field.Schema id="direccion/direccion" schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={1}>
                <Field.Schema id="direccion/dirNum" schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={1}>
                <Field.Schema id="direccion/dirOtros" schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={10}>
                <Field.Schema id="direccion/ciudad" schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <Field.Schema id="direccion/codPostal" schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={10}>
                <Field.Schema id="direccion/provincia" schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <Field.Schema id="direccion/codPais" schema={schemas.dirClientes} fullWidth />
              </Grid>
            </>
          )}
          {/* <Grid item xs={12}>
                <Box display='flex' justifyContent='space-around	' >
                  <Button id='cerrar' variant='text' color='secondary' text='Cancelar'
                    startIcon={<Icon>close</Icon>}
                  />
                  <Button id='guardar' variant='text' color='primary' text='Guardar dirección'
                    startIcon={<Icon>save_alt</Icon>}
                    disabled={!direccionValida}
                  />
                </Box>
              </Grid> */}
        </Grid>
      </Box>
      {/* }
      </Box> */}
    </Quimera.Template>
  );
}

export default DirCliente;
