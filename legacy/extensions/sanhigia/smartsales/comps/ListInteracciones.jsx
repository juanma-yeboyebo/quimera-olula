import { Box, Icon, QListItem, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { CircularProgress, InfiniteScroll, List } from "@quimera/thirdparty";
import { navigate, util } from "quimera";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
    height: "auto",
    overflow: "auto",
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    // borderBottom: `1px solid ${theme.palette.grey[400]}`,
    // border: `1px solid ${theme.palette.primary}`,
    border: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  chip: {
    borderRadius: 4,
    marginRight: theme.spacing(0.5),
    fontSize: "0.8rem",
    backgroundColor: `${theme.palette.warning.main}`,
    textTransform: "uppercase",
  },
  icon: {
    "color": theme.palette.grey,
    "transition": "all .2s ease-in-out",
    "&:hover": {
      color: theme.custom.menu.accent,
      transform: "scale(1.2)",
    },
  },
}));

export default function ListInteracciones({ contactos, onNext, maxHeight }) {
  const classes = useStyles();

  return (
    <Box d={`scrollableBoxListInteracciones`} className={classes.box} style={{ maxHeight }}>
      <InfiniteScroll
        dataLength={contactos?.list?.length}
        next={onNext}
        hasMore={contactos?.page?.next !== null}
        loader={<h4>Loading...</h4>}
        scrollableTarget={`scrollableBoxListInteracciones`}
      >
        <List disablePadding>
          {contactos?.list.map(contacto => (
            <QListItem
              key={contacto?.codContacto}
              onClick={() => navigate(`/ss/contacto/${contacto?.codContacto}`)}
              acciones={[
                <Box
                  className={classes.icon}
                  onClick={() => navigate(`/ss/evento/${contacto?.codUltimoEvento}`)}
                >
                  <Icon>arrow_forward</Icon>
                </Box>,
              ]}
              className={classes.card}
              style={{ borderBottom: "1px solid grey" }}
              alignActions="flex-end"
              // selected={true}
              tl={<Box display={"flex"}>{contacto?.nombre}</Box>}
              // tr={util.formatDate(contacto.ultimoEvento.fechaevento)}
              bl={`Curso: ${contacto?.nombreUltimoEvento ?? "Evento nombre"}`}
              br={<Box display={"flex"}>{util.formatDate(contacto?.fechaUltimoEvento)}</Box>}
            />
          ))}
        </List>
      </InfiniteScroll>
      {contactos?.loading && (
        <Box className={classes.centerBox}>
          <Typography variant="subtitle1">Cargando contactos</Typography>
          <CircularProgress />
        </Box>
      )}
      {!contactos?.loading && !contactos?.list?.length && (
        <Typography variant="subtitle1">No hay contactos</Typography>
      )}
    </Box>
  );
}
