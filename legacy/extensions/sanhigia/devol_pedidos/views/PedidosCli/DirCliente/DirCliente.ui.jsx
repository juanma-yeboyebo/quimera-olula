import { Box, Field, Grid, Icon, IconButton } from "@quimera/comps";
import { Direccion } from "@quimera-extension/base-area_clientes";
import { DirCliente as QDirCliente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";

import schemas from "../../../static/schemas";

function DirCliente({ modelName, useStyles }) {
  const [state, dispatch] = useStateValue();
  const [bloqueada, setBloqueada] = useState(true);

  const model = util.getStateValue(`${modelName}`, state);
  const codDir = model.codDir;

  useEffect(() => {
    setBloqueada(!!codDir);
  }, [codDir]);

  return (
    <Quimera.Template id="DirCliente">
      <Box>
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Box width={1}>
                {bloqueada ? (
                  <QDirCliente
                    id={`${modelName}/codDir`}
                    codCliente={model.codCliente}
                    soloDirEnvio={true}
                    fullWidth
                    autoFocus
                  />
                ) : (
                  <Direccion documento={model} inline />
                )}
              </Box>
              <IconButton
                id="bloquear"
                onClick={() => {
                  bloqueada &&
                    dispatch({ type: `on${util.camelId(modelName)}CodDirChanged`, value: null });
                  setBloqueada(!bloqueada);
                }}
              >
                <Icon>{bloqueada ? "lock" : "lock_open"}</Icon>
              </IconButton>
            </Box>
          </Grid>
          {!bloqueada && (
            <>
              <Grid item xs={2}>
                <Field.Schema
                  id={`${modelName}/dirTipoVia`}
                  schema={schemas.dirClientes}
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={8}>
                <Field.Schema
                  id={`${modelName}/direccion`}
                  schema={schemas.dirClientes}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <Field.Schema id={`${modelName}/dirNum`} schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={1}>
                <Field.Schema id={`${modelName}/dirOtros`} schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={10}>
                <Field.Schema id={`${modelName}/ciudad`} schema={schemas.dirClientes} fullWidth />
              </Grid>
              <Grid item xs={2}>
                <Field.Schema
                  id={`${modelName}/codPostal`}
                  schema={schemas.dirClientes}
                  fullWidth
                />
              </Grid>
              <Grid item xs={10}>
                <Field.Schema
                  id={`${modelName}/provincia`}
                  schema={schemas.dirClientes}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <Field.Schema id={`${modelName}/codPais`} schema={schemas.dirClientes} fullWidth />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Quimera.Template>
  );
}

export default DirCliente;
