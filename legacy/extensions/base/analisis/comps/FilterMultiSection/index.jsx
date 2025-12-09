import { Box, Icon, IconButton, Typography, QSection, Chip } from "@quimera/comps";
import { useStateValue, util } from "quimera";
// import { useCallback, useEffect, useState } from "react";
import { FilterMultiSelectBase } from "../";

function FilterMultiSection({ id, label, ApiName, ApiSelect, ApiKey, ApiKeyValue, ApiFilterKey, ...props }) {
  if (!ApiName || !ApiSelect || !ApiKey || !ApiKeyValue) {
    return <>No valido, faltan parametros</>
  }
  const [{ ventasFilter }, dispatch] = useStateValue();

  return (
    <>
      <FilterMultiSelectBase id={id} label={label} ApiName={ApiName} ApiSelect={ApiSelect} ApiKey={ApiKey} ApiKeyValue={ApiKeyValue} ApiFilterKey={ApiFilterKey} fullWidth />
      {(ventasFilter[ApiFilterKey] ?? []).map((item, idx) => (
        <div key={item?.index ?? item}>
          {/* <IconButton
            id={`onDelete${ApiFilterKey}`}
            size="small"
            onClick={() =>
              dispatch({
                type: `onDelete${ApiFilterKey}`,
                payload: { index: idx },
              })
            }
          >
            <Icon>close</Icon>
          </IconButton>
          <span>{item?.value}</span> */}
          <Chip label={item?.value} variant="outlined" onDelete={() =>
            dispatch({
              type: `onDelete${ApiFilterKey}`,
              payload: { index: idx },
            })
          } />
        </div>
      ))}
    </>
  );
}

export default FilterMultiSection;
