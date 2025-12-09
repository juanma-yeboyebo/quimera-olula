import { useTheme } from "@quimera/styles";
import { Tab as TabMUI, Tabs as TabsMUI } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";

import { AppBar } from "../../";
import TabPanel from "../TabPanel";

function TabWidget({ id, field, value, children, appBarProps, tabProps, tabPanelProps, ...props }) {
  const panels = React.Children.toArray(children).filter(child => child.type === "Tab");

  const [state, dispatch] = useStateValue();
  const stateField = field || id;
  const [stateValue, setStateValue] = useState(
    value || util.getStateValue(stateField, state, value) || 0,
  );
  const theme = useTheme();

  useEffect(() => {
    stateField && setStateValue(util.getStateValue(stateField, state, value));
  }, [state]);
  // const stateValue = value || util.getStateValue(stateField, state, value) // vinculamos el id a que sea variable de nuestro padre

  const handleChange = (...[, idx]) => {
    if (stateField) {
      dispatch({
        type: `on${util.camelId(id)}Changed`,
        payload: { field: stateField, value: idx },
      });
    } else {
      setStateValue(idx);
    }
  };

  return (
    <React.Fragment>
      <AppBar
        position="static"
        {...appBarProps}
        style={{
          ...(appBarProps?.style ?? {}),
          color: theme.palette.primary.main,
          border: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
      >
        <TabsMUI
          variant="fullWidth"
          value={stateValue}
          onChange={handleChange}
          aria-label="tab widget"
          {...props}
        >
          {panels.map((panel, idx) => (
            <TabMUI
              key={`TabTitle${util.camelId(panel.props.title)}-${idx}`}
              label={panel.props.title}
              id={`tab-${idx}`}
              aria-controls={`tabpanel-${idx}`}
              disabled={panel.props.disabled}
              {...tabProps}
            />
          ))}
        </TabsMUI>
      </AppBar>
      {panels.map((panel, idx) => {
        const { title, ...panelProps } = panel.props;

        return (
          <TabPanel
            key={`TabPanel${util.camelId(title)}-${idx}`}
            index={idx}
            value={stateValue}
            {...tabPanelProps}
            {...panelProps}
          >
            {panelProps.children}
          </TabPanel>
        );
      })}
    </React.Fragment>
  );
}

export default TabWidget;
