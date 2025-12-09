import { Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";

import { TpvDb } from "../../lib";

function Login({ useStyles }) {
  const [{ error }] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="Login">
      <Quimera.Reference id="afterLogin" type="append">
        {!TpvDb.getPuntoVenta()?.puntoventa?.codigo && <Quimera.SubView id="Login/SeleccionPV" />}
        {
          <section className={classes.container}>
            <article className={classes.error}>
              <Typography variant="subtitle2" color="secondary">
                Error:
              </Typography>
              <Typography variant="subtitle1" color="primary">
                {error}
              </Typography>
            </article>
          </section>
        }
      </Quimera.Reference>
    </Quimera.Template>
  );
}

export default Login;
