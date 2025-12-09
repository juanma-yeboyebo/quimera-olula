import { makeStyles } from "@quimera/styles";

import { Box, Typography, Icon, IconButton } from "@quimera/comps";

const useStyles = makeStyles(theme => ({
  visible: {
    display: 'none',
    '&.activo': {
      display: 'block',
    },
  },
  repose: {
    display: 'block',
    '&.activo': {
      display: 'none',
    },
  },
}));

function QExpandButton({ children, titulo, repose, ...props }) {

  const classes = useStyles();

  let expand_icon = "expand_more";
  const handleExpandButtonClick = c => {
    document.getElementsByClassName(classes.visible)[0].classList.toggle('activo');
    if (repose) {
      document.getElementsByClassName(classes.repose)[0].classList.toggle('activo');
    }
  };

  return (
    <Box mb={1} {...props}>
      <Box className={classes.expandBlock}>
        <Typography variant="overline">{titulo}</Typography>
        <IconButton id="expandButton" onClick={() => handleExpandButtonClick()}>
          <Icon fontSize="medium" color="secondary">
            {expand_icon}
          </Icon>
        </IconButton>
      </Box>
      <Box className={classes.visible}>
        {children}
      </Box>
      <Box className={classes.repose}>
        {repose()}
      </Box>
    </Box>
  );
}

export default QExpandButton;
