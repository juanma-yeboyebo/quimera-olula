import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";
// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'

function SubviewTemplate({ useStyles }) {
  const [, dispatch] = useStateValue();
  // const classes = useStyles()

  return <Quimera.Template id="SubviewTemplate"></Quimera.Template>;
}

export default SubviewTemplate;
