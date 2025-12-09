import { Box, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { navigate, useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

const useStyles = makeStyles(theme => ({
  hoverPointer: { ...theme.hoverPointer },
}));

function ClienteContacto({ id, codCliente, estatico, filterField = false, refrescar = false, disabled = false, StaticComp, ...props }) {
  const [state] = useStateValue();
  const classes = useStyles();
  const [nombre, setNombre] = useState("");
  const [codcliente, setCodCliente] = useState("");
  const [options, setOptions] = useState([]);

  const schemaName = util.lastStateField(id).split(".").pop();

  const contacto = util.getStateValue(id, state, null);
  const gotocliente = () => console.log("hola mundo");

  useEffect(() => {
    API("contactos")
      .get(contacto, "get_cliente_contacto")
      .select("codcontacto,nombre")
      .filter(["codcontacto", "eq", contacto])
      .success(
        response => (setNombre(response.data?.nombre), setCodCliente(response.data?.codcliente)),
      )
      .error(error => console.log("Error", error))
      .go();
  }, [contacto, refrescar]);
  console.log(codcliente);
  if (!nombre || nombre == "") {
    return <StaticComp>No hay cliente asociado</StaticComp>;
  }
  if (StaticComp) {
    return (
      <Box
        className={classes.hoverPointer}
        onClick={() => !disabled && navigate(`/ss/clientes/${codcliente}`)}
      >
        <StaticComp>{nombre}</StaticComp>
      </Box>
    );
  }

  return <Typography>{nombre}</Typography>;
}

export default ClienteContacto;
