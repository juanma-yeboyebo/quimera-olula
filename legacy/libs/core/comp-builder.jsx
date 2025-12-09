import { Icon, IconButton } from "@quimera/comps";

import { conditionChecks } from "./base/staticApi";

const compTypes = {
  Icon: ({ value, ...props }) => {
    return () => <Icon {...props}>{value}</Icon>;
  },
  IconButton:
    ({ value, children, ...props }) =>
    state => {
      console.log("ICONBUTTON", state);
      const p = Object.keys(props).reduce(
        (previo, nuevo) => ({
          ...previo,
          [nuevo]: isObject(props[nuevo])
            ? conditionChecks({ state, condition: props[nuevo].condition })
            : props[nuevo],
        }),
        {},
      );
      const c = children.map(child => build(child)());

      return <IconButton {...p}>{c}</IconButton>;
    },
};

function isObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

function build(data) {
  if ("type" in data) {
    const c = buildComponent(data);

    return c;
  }
}

function buildComponent({ type, ...props }) {
  return compTypes[type](props);
}

export default build;
