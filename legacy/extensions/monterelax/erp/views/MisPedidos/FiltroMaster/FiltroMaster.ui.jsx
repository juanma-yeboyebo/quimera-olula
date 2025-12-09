import { Box, Field, Grid } from "@quimera/comps";
import { AppBar } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function FiltroMaster({ useStyles }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="FiltroMaster">
      <AppBar position="sticky" className={classes.appBar}>
        <Box px={1}>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" className={classes.texto}>
                  <Field.Switch
                    id="pendientes"
                    label="Solo pendientes"
                    defaultChecked
                    color="primary"
                    onClick={e =>
                      dispatch({ type: "onSwitchClicked", payload: { item: e.target.checked } })
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </AppBar>
    </Quimera.Template>
  );
}

export default FiltroMaster;
