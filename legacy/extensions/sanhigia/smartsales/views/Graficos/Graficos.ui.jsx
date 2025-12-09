import { Box, Button, Field } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import { useEffect } from "react";

function Graficos({ withForm = true }) {
  const [{ data, filter, descFamilia }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  const schema = getSchemas().graficoHistoricoPrevision;

  const form = withForm ? (
    <>
      <Field.Schema schema={schema} id="filter.fechaInicio" />
      <Field.Schema schema={schema} id="filter.fechaFin" />
    </>
  ) : null;

  return (
    <Quimera.Template id="Graficos">
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontWeight: "bold",
          gap: "2rem",
        }}
      >
        <Box>{form}</Box>
        <Box>{filter.codFamilia && <Button color="secondary" text="<< Volver" id="goBack" />}</Box>
        <Box style={{ fontSize: "1.3rem" }}>
          {filter.codFamilia ? `Familia: ${descFamilia}` : "Todas las familias"}
        </Box>
        {data?.map(item => (
          <Box
            key={item.codigo}
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{
              minHeight: "325px",
              gap: "1rem",
            }}
          >
            {item.descripcion}
            <Quimera.View
              id="HistoricoPrevision"
              {...{
                ...filter,
                [filter.codFamilia ? "codSubfamilia" : "codFamilia"]: item.codigo,
              }}
            />
            {!filter.codFamilia && (
              <Button
                color="secondary"
                text=">> Ver histórico por subfamilias"
                onClick={() =>
                  dispatch({
                    type: "onFamiliaChanged",
                    payload: { item },
                  })
                }
              />
            )}
          </Box>
        ))}
      </Box>
    </Quimera.Template>
  );
}

export default Graficos;
