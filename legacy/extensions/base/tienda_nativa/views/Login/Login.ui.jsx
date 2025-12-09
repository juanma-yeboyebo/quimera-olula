import { Alert, Box, Button, Field, Grid, Icon, Paper, Snackbar, Typography } from "@quimera/comps";
import { clsx } from "@quimera/styles";
import Quimera, { useStateValue } from "quimera";
import { useEffect } from "react";

function Login({ onLogin, useStyles, ...props }) {
  const classes = useStyles();

  const [{ autenticado, autenticando, error, loginUser }, dispatch] = useStateValue();
  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        onLogin,
        ...props,
      },
    });
  }, []);

  useEffect(() => {
    autenticado && !!onLogin && onLogin();
  }, [autenticado]);

  const onKeyPressed = event => {
    event.key === "Enter" &&
      dispatch({
        type: "onEntrarLoginClicked",
      });
  };

  return (
    <Quimera.Template id="Login">
      {!!autenticando && <div>{"Autenticando..."}</div>}
      {!autenticando && !autenticado && (
        <Grid className={classes.root}>
          <Grid item xs={11} sm={8} md={4} lg={3} xl={2}>
            <Paper>
              <Grid container direction="column">
                <Grid item xs className={clsx(classes.gridItems, classes.header)}>
                  <Typography className={classes.typography} variant="h6">
                    Iniciar sesión
                  </Typography>
                </Grid>
                {/* <Grid item xs className={classes.gridItems}>
                  <Field.Text
                    id='user'
                    label='Usuario'
                    fullWidth
                    startAdornment={<Icon>personrounded</Icon>}/>
                </Grid> */}
                <Grid item xs className={classes.gridItems}>
                  <Field.Text
                    id="email"
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
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      id="entrarLogin"
                      text="ENTRAR"
                      variant="text"
                      className={classes.loginButton}
                    />
                    <Button
                      id="guest"
                      text="Continuar como invitado"
                      variant="text"
                      color="secondary"
                    />
                  </Box>
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
      )}
      {!autenticando && !!autenticado && <Quimera.Block id="afterLogin" />}
    </Quimera.Template>
  );
}

export default Login;
