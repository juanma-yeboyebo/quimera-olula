import { Box, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { navigate } from "quimera";

const useStyles = makeStyles(theme => ({
  mainBox: {
    color: "#505050",
    width: "100%",
    backgroundColor: "#e1e1e1",
    margin: "15px 5px 0px",
    padding: "5px 20px",
    boxSizing: "border-box",
  },
  mainBoxTitle: {
    textTransform: "uppercase",
    fontSize: "2rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  arrows: {
    fontSize: "1.3rem",
    flexShrink: "1",
    flexGrow: "0",
  },
  text: {
    flexShrink: "0",
    flexGrow: "1",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxWidth: "85%",
  },
  mainBoxTitleAft: {
    flexDirection: "row-reverse",
  },
  arrowBfr: {
    transform: "rotate(180deg)",
  },
  pointer: {
    cursor: "pointer",
  },
}));

export default function MainBox({
  className,
  title,
  before = false,
  url = false,
  children,
  callbackCerrado,
  historyBack = -1,
  ...props
}) {
  const classes = useStyles();

  const handleTitleClick = () => {
    before && !callbackCerrado && window.history.go(historyBack);
    before && !!callbackCerrado && callbackCerrado();
    url && navigate(url);
  };

  return (
    <Box className={`${className ?? ""} ${classes.mainBox}`} {...props}>
      {title && (
        <Typography
          variant="h1"
          className={`${classes.mainBoxTitle} ${before ? classes.mainBoxTitleBfr : classes.mainBoxTitleAft
            }`}
          data-cy={`boxtitle-${title}`}
        >
          <span
            className={`${classes.arrows} ${before ? classes.arrowBfr : ""} ${before || url ? classes.pointer : ""
              }`}
            onClick={handleTitleClick}
          >
            ❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯
            {/* <IconButton
              key={"atras"}
              fontSize="large"
              disabled={false}
              title={"Atras"}
              {...b.props}
            >
              <Icon
                fontSize="large"
                className={classes.iconoCabecera}
                style={{
                  color: "#505050",
                }}
              >
                arrow_back
              </Icon>
            </IconButton> */}
          </span>
          <span className={`SmartSalesMainBoxText ${classes.text}`}>{title}</span>
        </Typography>
      )}
      {children}
    </Box>
  );
}
