import { Box, Field, Grid } from "@quimera/comps";
import { AppBar } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";

function FiltroMaster({ useStyles }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="FiltroMaster">
      <AppBar position="sticky" className={classes.appBar}>
        <Box px={1}>
          <Box>
            <Grid container spacing={1} direction="column" >
              <Grid size={6}>
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
