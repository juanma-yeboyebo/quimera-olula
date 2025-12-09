import { QSection } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

const useStyles = makeStyles(theme => ({
  cancel: {
    backgroundColor: "transparent",
    color: "#505050",
  },
  save: {
    backgroundColor: "#505050",
    color: "white",
    padding: "6px 15px",
  },
}));

export default function ConfirmButton({ children, ...props }) {
  const classes = useStyles();

  return (
    <QSection
      title=""
      focusStyle="none"
      cancel={{
        className: classes.cancel,
      }}
      save={{
        className: classes.save,
      }}
      {...props}
    >
      {children}
    </QSection>
  );
}
