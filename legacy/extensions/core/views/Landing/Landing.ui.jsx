import { Container, Grid, Typography } from "@quimera/comps";
import Quimera, { PropValidation } from "quimera";
import React from "react";

function Landing({ useStyles }) {
  const classes = useStyles();

  return (
    <Quimera.Template id="Landing">
      <Container maxWidth="md" className={classes.container}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h2">¡Bienvenido a Quimera!</Typography>
          <Typography variant="h5">
            Esta aplicación todavía no tiene una página principal.
            <br />
            Usa el menú para navegar{" "}
          </Typography>
          {/* <img src='/img/quimera.png' className={ classes.logo }/> */}
          <Quimera.Block id="links">
            {/* <Typography variant='h6'>Navega a <A href='/dev'>/dev</A> para cambiar de proyecto</Typography> */}
          </Quimera.Block>
        </Grid>
      </Container>
    </Quimera.Template>
  );
}

export default Landing;
