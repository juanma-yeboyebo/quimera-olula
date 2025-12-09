import { Box, QListItem, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { CircularProgress, InfiniteScroll, List } from "@quimera/thirdparty";
import { navigate } from "quimera";

const valorTrato = v => {
  if (v < 1_000) {
    return v;
  }
  if (v < 1_000_000) {
    return v / 1_000;
  }

  return v / 1_000_000;
};

const valorTratoFormatter = v => {
  return Number(valorTrato(v)).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
const udTratoFormatter = v => {
  if (v < 1_000) {
    return "€";
  }
  if (v < 1_000_000) {
    return "k.";
  }

  return "m.";
};

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
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function ListContactos({ contactos, onNext, maxHeight }) {
  const classes = useStyles();

  return (
    <Box id={`scrollableBoxListContactos`} className={classes.box} style={{ maxHeight }}>
      <InfiniteScroll
        dataLength={contactos?.idList?.length}
        next={onNext}
        hasMore={contactos?.page?.next !== null}
        // loader={<h4>Loading...</h4>}
        scrollableTarget={`scrollableBoxListContactosMD`}
      >
        <List disablePadding>
          {Object.values(contactos?.dict ?? {})
            // ?.sort((a, b) => new Date(b.fechaIni) - new Date(a.fechaIni))
            ?.map(contacto => {
              return (
                <QListItem
                  key={contacto?.codContacto}
                  onClick={() => navigate(`/ss/contacto/${contacto?.codContacto}`)}
                  className={classes.card}
                  // selected={contacto?.codContacto === contacto.current}
                  style={{ borderBottom: "1px solid grey" }}
                  alignActions="flex-end"
                  tl={<Box display={"flex"}>{contacto?.nombre}</Box>}
                  bl={`${contacto?.numTratos?.toString()?.padStart(2, "0")}  tratos`}
                  br={
                    <Box display={"flex"}>
                      {valorTratoFormatter(contacto?.sumValor)}
                      {udTratoFormatter(contacto?.sumValor)}
                    </Box>
                  }
                />
              );
            })}
        </List>
      </InfiniteScroll>
      {contactos?.loading && (
        <Box className={classes.centerBox}>
          <Typography variant="subtitle1">Cargando contactos</Typography>
          <CircularProgress />
        </Box>
      )}
      {!contactos?.loading && !contactos?.idList?.length && (
        <Typography variant="subtitle1">No hay contactos</Typography>
      )}
    </Box>
  );
}
