import { Field, Schema } from "quimera/lib";

import Avatar from "./Avatar";

const schema = Schema("Avatar")
  .fields({
    size: Field.Text("size", "Tamaño (px)").required().default("50px"),
  })
  .extract();

const variants = {
  large: {
    name: "Grande",
    size: "150px",
  },
  mid: {
    name: "Mediano",
    size: "50px",
  },
  small: {
    name: "Pequeño",
    size: "20px",
  },
};

export default {
  name: "Avatar",
  Component: Avatar,
  schema,
  events: [],
  variants,
  children: null,
  documentation: null,
};
