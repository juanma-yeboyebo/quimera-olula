import { Field, Schema } from "quimera/lib";

import Can from "./Can";

const schema = Schema("Can")
  .fields({
    rule: Field.Text("rule", "Regla").required(),
  })
  .extract();

const variants = {
  default: {
    name: "Default",
    rule: "Menu:botones-gerencia",
  },
};

const children =
  "El componente Can no tiene render, solamente renderiza sus hijos si el control de acceso lo permite";

export default {
  name: "Condicional",
  Component: Can,
  schema,
  events: [],
  variants,
  children,
  documentation: null,
};
