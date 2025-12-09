import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Icon, Link, Typography } from "@quimera/thirdparty";
import { util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  marco: {
    // marginTop: theme.spacing(0.5)
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

function Direccion({ documento = {}, inline = false, ...props }) {
  const classes = useStyles();
  const direccion = util.buildAddress(documento, inline);

  // const direccion = documento.direccion
  // const dirLinea1 = `${documento.dirTipoVia ?? ''} ${documento.direccion ?? ''} ${documento.dirNum ?? ''}`.trim()
  // const dirLinea2 = `${documento.codPostal ? `C.P. ${documento.codPostal}`: ''} ${documento.ciudad ?? ''} ${documento.provincia ?? ''}`.trim()

  const googleUrl = inline
    ? `https://www.google.es/maps/search/${direccion.split(" ").join("+")}`
    : `https://www.google.es/maps/search/${direccion[0].split(" ").join("+")}+${direccion[1]
        .split(" ")
        .join("+")}`;

  return (
    <Box display="flex" alignItems="center" className={classes.marco}>
      <Link href={googleUrl} target="_blank">
        <Icon fontSize="medium" className={classes.leftIcon}>
          room
        </Icon>
      </Link>
      <Box width={1} ml={0}>
        {inline ? (
          <Typography variant="body1">{direccion}</Typography>
        ) : (
          <Typography variant="body1">
            {direccion[0]}
            <br />
            {direccion[1]}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Direccion;
