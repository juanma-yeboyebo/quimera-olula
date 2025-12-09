import { Field, Schema } from "quimera/lib";

import Button from "./Button";

const schema = Schema("Button")
  .fields({
    id: Field.Text("id", "ID").required(),
    text: Field.Text("text", "Texto").required(),
    color: Field.Options("color", "Color").options([
      { key: "primary", value: "Primario" },
      { key: "secondary", value: "Secundario" },
      { key: null, value: "No especificado" },
    ]),
    variant: Field.Options("variant", "Variante").options([
      { key: "contained", value: "Contenido" },
      { key: "outlined", value: "Delineado" },
      { key: "text", value: "Texto" },
    ]),
  })
  .extract();

const events = [{ builtin: "onClick()", custom: "onXxxxClicked()" }];

const variants = {
  main: {
    name: "Principal",
    id: "main",
    text: "Principal",
    color: "primary",
    variant: "contained",
  },
  alternative: {
    name: "Secundario",
    id: "secondary",
    text: "Secundario",
    color: "secondary",
    variant: "outlined",
  },
};

const documentation = "Aquí va la documentación del Botón, puesta aquí como ejemplo";

export default {
  name: "Botón",
  Component: Button,
  schema,
  events,
  variants,
  children: null,
  documentation,
};
