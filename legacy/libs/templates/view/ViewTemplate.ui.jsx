import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";
// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'

function ViewTemplate({ useStyles }) {
  const [, dispatch] = useStateValue();
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "init",
    });
  }, [dispatch]);

  return <Quimera.Template id="ViewTemplate"></Quimera.Template>;
}

export default ViewTemplate;
