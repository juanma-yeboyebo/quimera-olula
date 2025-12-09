import { Button, CircularProgress, Field, Grid, Icon, Paper, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Box, useTranslation } from "@quimera/thirdparty";
import Quimera, { getSchemas, navigate, useStateValue, util } from "quimera";
import { useEffect, useState } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "40px",
  },
  gridItems: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  header: {
    flexBasis: "100px",
    maxHeight: "85px",
    margin: theme.spacing(2),
    background: "linear-gradient(60deg, #ab47bc, #8e24aa)",
    marginTop: "-40px",
    color: "#FFF",
    boxShadow:
      "0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)",
    borderRadius: "3px",
    padding: "25px",
    paddingLeft: "65px",
  },
  typography: {
    fontWeight: "500",
    padding: theme.spacing(2),
  },
  botonPrimario: theme.botonGuardar,
  botonDisabled: theme.botonDisabled,
  botonLogin: {
    "backgroundColor": "#50d2ce",
    "fontSize": "14px",
    "color": "#fff",
    "borderRadius": "5px",
    "textTransform": "none",
    "textAlign": "center",
    "fontWeight": "bold",
    "padding": "8px 30px",
    "margin": "10px 1px",
    "letterSpacing": "0",
    "willChange": "box-shadow, transform",
    "width": "100%",
    "&:hover": {
      backgroundColor: "#50d2ce",
      opacity: "0.8",
    },
  },
}));

const MIN_PASS_LENGTH = 6;
const TR_PREFIX = "login.forgotPassword.";

function passwordOK(pass) {
  return pass && pass != "" && pass.length >= MIN_PASS_LENGTH;
}
function passwordsOK(pass1, pass2, t) {
  const result = {
    ok: true,
    pass1Msg: null,
    pass2Msg: null,
  };
  if (!passwordOK(pass1)) {
    result.ok = false;
    result.pass1Msg =
      pass1 &&
      util.translate(`${TR_PREFIX}formatoPasswordIncorrecto`, { minLength: MIN_PASS_LENGTH });
  }
  if (!passwordOK(pass2)) {
    result.ok = false;
    result.pass2Msg =
      pass2 &&
      util.translate(`${TR_PREFIX}formatoPasswordIncorrecto`, { minLength: MIN_PASS_LENGTH });
  }
  if (!result.ok) {
    return result;
  }
  if (pass1 != pass2) {
    result.ok = false;
    result.pass2Msg = util.translate(`${TR_PREFIX}passwordsDistintas`);
  }

  return result;
}

function ForgotPassword({ hash }) {
  const [{ smState, email, error, nuevaContrasena, nuevaContrasena2 }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().forgotPassword;
  const [passwordStatus, setPasswordStatus] = useState({ ok: false });
  const { t } = useTranslation();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { hash },
    });
  }, [dispatch, hash]);

  useEffect(() => {
    if (smState == "establecer_nueva_contrasena") {
      setPasswordStatus(passwordsOK(nuevaContrasena, nuevaContrasena2));
    }
  }, [smState, nuevaContrasena, nuevaContrasena2]);

  return (
    <Quimera.Template id="ForgotPassword">
      <Box display="flex" justifyContent="center" className={classes.root}>
        <Paper style={{ width: "330px" }}>
          <Box pt={1}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs></Grid>
              {smState === "send_email" && (
                <>
                  <Grid item xs>
                    <Typography className={classes.typography}>
                      ¿Has olvidado tu contraseña?
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className={classes.typography}>
                      Indícanos tu email y te enviaremos un mensaje para restablecerla.
                    </Typography>
                  </Grid>
                  <Grid item xs className={classes.gridItems}>
                    <Field.Schema
                      schema={schema}
                      id="email"
                      fullWidth
                      startAdornment={<Icon>emailrounded</Icon>}
                    // error={emailStatus?.error}
                    // helperText={emailStatus?.helperText}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.gridItems}>
                    <Button
                      id="enviarCorreo"
                      text="ENVIAR"
                      fullWidth
                      disabled={email === ""}
                      color="primary"
                      variant="contained"
                    />
                  </Grid>
                </>
              )}
              {smState === "email_sent" && (
                <>
                  <Grid item xs>
                    <Typography className={classes.typography}>Comprueba tu email</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className={classes.typography}>
                      Hemos enviado un correo a {email} con las instrucciones para recuperar tu
                      contraseña
                    </Typography>
                  </Grid>
                </>
              )}
              {smState === "hash_incorrecto" && (
                <Box m={2}>
                  <Typography variant="body1">{t(`${TR_PREFIX}enlaceIncorrecto`)}</Typography>
                  <Box display="flex" justifyContent="center" mt={1}>
                    <Button
                      id="aceptarIncorrecto"
                      text={t(`${TR_PREFIX}aceptar`)}
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/")}
                    />
                  </Box>
                </Box>
              )}
              {smState === "send_email_failed" && (
                <>
                  <Grid item xs>
                    <Typography className={classes.typography}>Error</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className={classes.typography}>{error}</Typography>
                  </Grid>
                </>
              )}
              {smState === "check_hash_link" && (
                <Box display="flex" justifyContent="center" alignItems="center" m={2}>
                  <Typography variant="body1" align="center">
                    {t(`${TR_PREFIX}comprobando`)}
                  </Typography>
                  <Box mx={1}></Box>
                  <CircularProgress />
                </Box>
              )}
              {smState === "establecer_nueva_contrasena" && (
                <Box m={2}>
                  <Typography variant="body1">{t(`${TR_PREFIX}tituloCambioContrasena`)}</Typography>
                  <Field.Password
                    id={"nuevaContrasena"}
                    label={t(`${TR_PREFIX}campoPass1`)}
                    fullWidth
                    startAdornment={<Icon>lockrounded</Icon>}
                    error={passwordStatus.pass1Msg}
                    helperText={passwordStatus.pass1Msg}
                  />
                  <Field.Password
                    id="nuevaContrasena2"
                    label={t(`${TR_PREFIX}campoPass2`)}
                    fullWidth
                    startAdornment={<Icon>lockrounded</Icon>}
                    error={passwordStatus.pass2Msg}
                    helperText={passwordStatus.pass2Msg}
                  />
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                      disabled={!passwordStatus.ok}
                      id="cambiarContrasena"
                      className={passwordStatus.ok ? classes.botonPrimario : classes.botonDisabled}
                      text={t(`${TR_PREFIX}botonCambiar`)}
                      variant="contained"
                      color="primary"
                    />
                  </Box>
                </Box>
              )}
              {smState === "contrasena_cambiada" && (
                <Box m={2}>
                  <Typography variant="body1" align="center">
                    {t(`${TR_PREFIX}confirmacionCambioPassword`)}
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={1}>
                    <Button
                      id="irALogin"
                      text={t(`${TR_PREFIX}irALogin`)}
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/")}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Quimera.Template>
  );
}

export default ForgotPassword;
