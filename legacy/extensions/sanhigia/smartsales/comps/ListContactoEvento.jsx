import { Box, QListItem, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { navigate } from "quimera";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
  },
  card: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function ListContactos({ contactos }) {
  const classes = useStyles();

  if (!contactos?.list?.length) {
    return <Typography variant="subtitle1">No hay contactos</Typography>;
  }

  return (
    <Box className={classes.box}>
      {contactos?.list?.map(contacto => (
        <QListItem
          key={contacto?.codContacto}
          // onClick={() => navigate(`/ss/contacto/${contacto?.codContacto}`)}
          // className={classes.card}
          style={{ borderBottom: "1px solid grey" }}
          alignActions="flex-end"
          tl={<Box display={"flex"}>{contacto?.nombreContacto}</Box>}
          tr={<span className={classes.card} onClick={() => navigate(`/ss/contacto/${contacto?.codContacto}`)}> ❯❯❯ </span>}
          bl={<Box display={"flex"}>{contacto?.emailContacto}</Box>}
          br={<Box display={"flex"}>{contacto?.telefonoContacto}</Box>}
        />
      ))}
    </Box>
  );
}