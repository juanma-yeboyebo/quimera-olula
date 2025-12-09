import { Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

import { MainBox } from "./";

const useStyles = makeStyles(theme => ({
  box: {
    textAlign: "right",
  },
  text: {
    fontSize: "0.87rem",
    fontWeight: "bold",
    whiteSpace: "normal",
  },
  date: {
    fontSize: "0.75rem",
    opacity: "0.75",
  },
}));

export default function Note({ text, date, ...props }) {
  const classes = useStyles();

  return (
    <MainBox className={classes.box} {...props}>
      <Typography className={classes.text}>{text}</Typography>
      <Typography className={classes.date}>{date}</Typography>
    </MainBox>
  );
}
