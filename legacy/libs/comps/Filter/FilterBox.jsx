import { FilterProvider, useStateValue, util } from "quimera";
import { useEffect, useState } from "react";

import { Box, ClearFilterButton, FilterButton, QSection } from "..";

/*
Funcionamiento:
*/

function FilterBox({
  id,
  initialFilter = {},
  externalFilter = null,
  schema,
  auto = false,
  children,
  open,
  title,
  lastFilter = false,
  ...props
}) {
  const lastFilterValue = util.getLastFilter(util.camelId(id));
  const lastExternalFilter = sessionStorage.getItem(`${util.camelId(id)}External`);
  const filtroGuardado = lastFilter && lastFilterValue ? lastFilterValue : initialFilter;
  const externalFilterGuardado =
    lastFilter && lastExternalFilter ? JSON.parse(lastExternalFilter) : externalFilter;
  const [filter, setFilter] = useState(filtroGuardado);
  const [externalFilterState, setExternalFilter] = useState(externalFilterGuardado);
  const [, dispatch] = useStateValue();

  const hacerYAplicarFiltro = opciones => {
    const filterNew = [];
    if (opciones && Object.keys(opciones).length !== 0 && lastFilter) {
      // Object.entries(opciones).forEach(([key, value]) => {
      //   filterNew.push(value.filter);
      // });
      // dispatch({
      //   type: `on${util.camelId(id)}Changed`,
      //   payload: {
      //     field: util.camelId(id),
      //     value: { "and": filterNew },
      //     type: "publishFilter",
      //     cantFilter: 1
      //   },

      // });
    } else if (lastFilter) {
      dispatch({
        type: `get${util.camelId(id.split(".")[0])}`,
      });
    }
  };

  const publishFilter = () => {
    util.setLastFilter(util.camelId(id), filter);
    sessionStorage.setItem(
      `${util.camelId(id)}External`,
      externalFilterState ? JSON.stringify(externalFilterState) : null,
    );
    const valoresFiltro = [...Object.values(filter)];

    externalFilterState?.length && externalFilterState.map(filtro => valoresFiltro.push(filtro));
    dispatch({
      type: `on${util.camelId(id)}Changed`,
      payload: {
        field: util.lastStateField(id),
        value: valoresFiltro.length
          ? {
            and: valoresFiltro?.reduce(
              (accum, item) => [
                ...accum,
                ...(item.filter.or !== undefined || typeof item.value !== "object"
                  ? [item.filter]
                  : item.filter),
              ],
              [],
            ),
          }
          : null,
        cantFilter:
          (Object.values(filter).length || 0) -
          (Object.values(initialFilter).length || 0) -
          (externalFilterState?.length || 0),
        type: "publishFilter",
      },
    });
  };

  const clearFilter = () => {
    util.setLastFilter(util.camelId(id), {});
    const valoresFiltro = [];
    externalFilterState?.length && externalFilterState.map(filtro => valoresFiltro.push(filtro));
    setFilter({});
    dispatch({
      type: `on${util.camelId(id)}Changed`,
      payload: {
        field: util.lastStateField(id),
        // value: {},
        value: valoresFiltro.length
          ? {
            and: valoresFiltro?.reduce(
              (accum, item) => [
                ...accum,
                ...(item.filter.or !== undefined || typeof item.value !== "object"
                  ? [item.filter]
                  : item.filter),
              ],
              [],
            ),
          }
          : {},
        type: "clearFilter",
      },
    });
  };

  const addFilter = (id, newFilter) => {
    setFilter(filter => ({
      ...filter,
      [id]: newFilter,
    }));
  };

  const removeFilter = id => {
    setFilter(filter => {
      const myFilter = { ...filter };
      delete myFilter[id];

      return myFilter;
    });
  };

  // useEffect(() => {
  //   !!auto || !!externalFilter && publishFilter();
  // }, [auto, filter, externalFilterState, dispatch]);

  useEffect(() => {
    !!auto && publishFilter();
  }, [auto, filter, dispatch]);

  useEffect(() => {
    !!externalFilter && publishFilter();
  }, [auto, externalFilterState, dispatch]);

  useEffect(() => {
    const filtroGuardado = util.getLastFilter(util.camelId(id));
    Object.keys(filter).length && publishFilter();
    // hacerYAplicarFiltro(filtroGuardado);
  }, []);

  useEffect(() => {
    setExternalFilter(externalFilter);
    // !!externalFilter && publishFilter();
  }, [externalFilter]);

  return (
    <QSection
      actionPrefix={util.camelId(id)}
      title={title && title}
      focusStyle="button"
      activation={{
        active: open,
      }}
      p={2}
      dynamicComp={() => (
        <>
          <FilterProvider
            value={[
              {
                filter,
                schema,
              },
              addFilter,
              removeFilter,
            ]}
          >
            {children}
          </FilterProvider>
          <Box
            display="flex"
            justifyContent="flex-end"
            style={{ gap: "1em", margin: "20px 0px 0px" }}
          >
            <ClearFilterButton onClick={clearFilter} variant="outlined" />
            {!auto && <FilterButton id="filterBoxfilterButton" onClick={publishFilter} />}
          </Box>
        </>
      )}
      cancel={{
        display: "none",
      }}
      save={{
        display: "none",
      }}
      {...props}
    />
  );
}

export default FilterBox;
