import { Box, Grid, Typography } from "@quimera/comps";
import { clsx, makeStyles } from "@quimera/styles";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "0px",
  },
  gridItems: {
    padding: "20px 40px 20px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imagenFondo: {
    height: "100vh",
    width: "100%",
  },
  header: {
    height: "8vh",
    width: "100%",
    color: "#FFF",
    position: "absolute",
    top: "0px",
  },
  body: {
    height: "86vh",
    width: "100%",
    position: "absolute",
    top: "8vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
  },
  bodyTextTittle: {
    color: "#FFF",
    letterSpacing: "12px",
    fontSize: "3em",
    width: "90%",
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "Geomanist",
  },
  bodyTextSubtittle1: {
    color: "#FFF",
    letterSpacing: "8px",
    fontSize: "2em",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "Geomanist",
  },
  bodyTextSubtittle2: {
    color: "#FFF",
    letterSpacing: "8px",
    fontSize: "1.5em",
    width: "90%",
    textTransform: "uppercase",
    fontFamily: "Geomanist",
  },
  bodyBoxTextSubtittle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "30px",
  },
  footer: {
    height: "6vh",
    width: "100%",
    color: "#FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    position: "absolute",
    bottom: "0px",
  },
  logo: {
    filter: "brightness(0) invert(1)",
    transform: "scale(0.7)",
  },
  login: {
    "color": "#FFF",
    "textDecoration": "none",
    "transform": "scale(1.25)",
    "transition": "all .4s ease-in-out",
    "border": "1px solid #FFF",
    "padding": "5px 10px",
    "borderRadius": "5px",
    "fontFamily": "Geomanist",
    "fontSize": "1.2em",
    "&:hover": {
      transform: "scale(1.35)",
      cursor: "pointer",
    },
  },
  link: {
    "color": "#FFF",
    "textDecoration": "none",
    "fontFamily": "Geomanist",
    "fontSize": "1.3em",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

function Welcome({ onLogin, ...props }) {
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

  const classes = useStyles();
  const environment = util.getEnvironment();
  const linkPoliticaPrivacidad = environment?.loginLinks?.politicaPrivacidad;
  const linkTerminosCondiciones = environment?.loginLinks?.terminosCondiciones;

  return (
    <Quimera.Template id="Welcome">
      <Box>
        <img
          src="/img/fondo_welcome.jpg"
          alt="Fondo pantalla welcome"
          className={classes.imagenFondo}
        />
      </Box>
      <Grid container item className={clsx(classes.gridItems, classes.header)}>
        <img
          width="150px"
          src="/img/logo.png"
          alt="SmartSales logo"
          className={classes.logo}
          style={{
            marginLeft: "-20px",
          }}
        />
        <Box onClick={() => dispatch({ type: "onLinkClicked", payload: { link: "/login" } })}>
          <Typography variant="h2" className={classes.login}>
            Inicio de sesión
          </Typography>
        </Box>
      </Grid>
      <Grid container item className={classes.body}>
        <Grid container item xs={11} className={classes.primaryBody}>
          <Typography variant="h1" className={classes.bodyTextTittle}>
            Gestión Comercial Sanhigia
          </Typography>
          <Box className={classes.bodyBoxTextSubtittle}>
            <Typography variant="h1" className={classes.bodyTextSubtittle1}>
              Esta aplicación permite al equipo comercial de Sanhigia:
            </Typography>
            <Typography variant="h2" className={classes.bodyTextSubtittle2}>
              - Crear tratos de ventas y realizar su seguimiento
            </Typography>
            <Typography variant="h2" className={classes.bodyTextSubtittle2}>
              - Crear y realizar el seguimiento de campañas de marketing
            </Typography>
            <Typography variant="h2" className={classes.bodyTextSubtittle2}>
              - Obtener recomendaciones de a qué clientes y qué productos ofertar
            </Typography>
            <Typography variant="h2" className={classes.bodyTextSubtittle2}>
              - Programar tareas para el seguimiento de tratos
            </Typography>
            <Typography variant="h2" className={classes.bodyTextSubtittle2}>
              - Comprobar el desempeño de ventas respecto a la pevisión de cada agente
            </Typography>
          </Box>
        </Grid>
        <Grid>
          <Typography variant="h2" className={classes.link}>
            Esta web requiere acceso a los calendarios de Google de los agentes con el objetivo de
            poder incluir en ellos las tareas generadas por la web
          </Typography>
        </Grid>
      </Grid>
      <Grid container item className={classes.footer}>
        {linkPoliticaPrivacidad && (
          <Grid item>
            <Box
              onClick={() =>
                dispatch({ type: "onLinkClicked", payload: { link: linkPoliticaPrivacidad } })
              }
            >
              <Typography variant="h2" className={classes.link}>
                Política de privacidad
              </Typography>
            </Box>
          </Grid>
        )}
        {linkTerminosCondiciones && (
          <Grid item>
            <Box
              onClick={() =>
                dispatch({
                  type: "onLinkClicked",
                  payload: { link: linkTerminosCondiciones },
                })
              }
            >
              <Typography variant="h2" className={classes.link}>
                Términos y condiciones
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Quimera.Template>
  );
}

export default Welcome;
