import { Box, Field, Icon, QBox, QListItem } from "@quimera/comps";
import { InfiniteScroll, List } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useCallback, useState } from "react";

const avatares = {
  "Cerrado": {
    icon: "",
    color: "#ef5350",
  },
  "En Preparacion": {
    icon: "",
    color: "#eb910c",
  },
  "En Curso": {
    icon: "",
    color: "#4caf50",
  },
};

function MasterContactosMD({ codContacto }) {
  const [{ contactos, externalFilter }, dispatch] = useStateValue();
  const [timer, setTimer] = useState();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const altura = `calc(100vh - ${200}px)`;
  const anchoDetalle = mobile ? 1 : 0.5;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [
    { icon: "add_circle", id: "nuevoContacto", text: "Nuevo contacto" },
    {
      icon: "filter_alt", id: "showFilter", text: "Mostrar filtro", badgeVisible: Object.keys(contactos.filter?.and ?? {}).length - externalFilter?.length,
      badgeContent: Object.keys(contactos.filter?.and ?? {}).length - externalFilter?.length
    },
  ];

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

  const updateTime = 1000;
  const handleDelay = event => {
    clearTimeout(timer);
    const value = event.target.value;
    dispatch({ type: "onBuscaContactoChanged", payload: { value } });
    setTimer(setTimeout(() => dispatch({ type: "checkBusqueda", payload: { value } }), updateTime));
  };

  const callbackNewContactoChanged = useCallback(
    payload => dispatch({ type: "onNewContactoChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="MasterContactosMD">
      <Box width={anchoDetalle}>
        <QBox
          titulo={codContacto === "nuevo" ? "Nuevo contacto" : "Contactos"}
          botones={botones}
          botonesCabecera={botonesCabecera}
        >
          {codContacto === "nuevo" && (
            <Quimera.View id="NuevoContactoMD" callbackCerrado={callbackNewContactoChanged} />
          )}
          <Quimera.SubView id="ContactosMD/FilterContactosMD" />
          <Box id="filtroRapido">
            <Field.Text
              id="buscaContacto"
              autoComplete="off"
              placeholder="Introduce nombre/e-mail/teléfono"
              endAdornment={<Icon data-cy="search-button">search</Icon>}
              fullWidth
              onChange={event => handleDelay(event)}
            />
          </Box>
          <Box id="scrollableBoxListContactosMD" style={{ height: altura, overflow: "auto" }}>
            <InfiniteScroll
              dataLength={contactos?.idList?.length}
              next={() => dispatch({ type: `onNextContactos` })}
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
                        // onClick={() => navigate(`/ss/contacto/${contacto?.codContacto}`)}
                        onClick={() =>
                          dispatch({
                            type: "onContactosClicked",
                            payload: { item: contacto },
                          })
                        }
                        // className={classes.card}
                        selected={contacto?.codContacto === contacto.current}
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
          </Box>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterContactosMD;
