import { Divider, List as ListMUI, ListItem } from "@quimera/thirdparty";
import React from "react";

/**
 * Default data list for Quimera applications
 */
function List({ id, data, item, idField, ...props }) {
  return (
    <ListMUI style={{ width: "100%" }} {...props}>
      <Divider />
      {data.map((row, idx) => (
        <React.Fragment key={row[idField]}>
          <ListItem>{item(row, idx)}</ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </ListMUI>
  );
}

export default List;
