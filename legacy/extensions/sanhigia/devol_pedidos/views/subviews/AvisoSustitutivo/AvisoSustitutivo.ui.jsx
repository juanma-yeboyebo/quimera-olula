import { Box, Button, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";

function AvisoSustitutivo({ useStyles }) {
  const [{ sustitutivo }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="AvisoSustitutivo">
      {sustitutivo.referencia && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" color="secondary">
            {`Este artículo tiene un sustitutivo asociado:`} <br />{" "}
            {`${sustitutivo.referencia} ${sustitutivo.descripcion} ${
              sustitutivo.factorSustitucion && sustitutivo.factorSustitucion !== 1
                ? sustitutivo.factorSustitucion
                : ""
            }`}
          </Typography>
          <Button id="sustituir" text="Sustituir" variant="outlined" color="secondary"></Button>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default AvisoSustitutivo;
