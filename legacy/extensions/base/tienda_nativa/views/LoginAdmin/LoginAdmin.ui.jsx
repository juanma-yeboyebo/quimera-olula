import { Alert, Button, Field, Grid, Icon, Paper, Snackbar, Typography } from "@quimera/comps";
import { clsx } from "@quimera/styles";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useEffect } from "react";

function LoginAdmin({ onLoginAdmin, useStyles }) {
  const classes = useStyles();

  const [{ autenticado, autenticando, error, loginUser }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        onLoginAdmin,
      },
    });
  }, []);

  const onKeyPressed = event => {
    event.key === "Enter" &&
      dispatch({
        type: "onEntrarLoginAdminClicked",
      });
  };

  return (
    <Quimera.Template id="LoginAdmin">
      <Grid className={classes.root}>
        <Grid item xs={11} sm={8} md={4} lg={3} xl={2}>
          <Paper>
            <Grid container direction="column">
              <Grid item xs className={clsx(classes.gridItems, classes.header)}>
                <Typography className={classes.typography} variant="h5">
                  Quimera&reg;
                </Typography>
                <Typography className={classes.typography} variant="h6">
                  Panel de administración
                </Typography>
              </Grid>
              <Grid item xs className={classes.gridItems}>
                <Field.Text
                  id="user"
                  label={loginUser.label}
                  fullWidth
                  startAdornment={<Icon>{loginUser.icon}</Icon>}
                  autoFocus={true}
                  onKeyPress={onKeyPressed}
                />
              </Grid>
              <Grid item xs className={classes.gridItems}>
                <Field.Password
                  id="pass"
                  label="Contraseña"
                  fullWidth
                  startAdornment={<Icon>lockrounded</Icon>}
                  onKeyPress={onKeyPressed}
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItems}>
                <Button
                  id="entrarLoginAdmin"
                  text="ENTRAR"
                  variant="text"
                  className={classes.loginButton}
                />
              </Grid>
            </Grid>
          </Paper>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={!!error}
            onClose={(event, reason) =>
              dispatch({ type: "onSnackbarAutoHide", payload: { event, reason } })
            }
            autoHideDuration={3000}
            style={{ zIndex: 9998 /* Para que si estamos en modal se muestre */ }}
          >
            <Alert elevation={6} variant="filled" severity="error">
              {error}
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default LoginAdmin;
