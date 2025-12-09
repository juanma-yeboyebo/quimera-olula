import {
  Avatar,
  Box,
  Icon,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { util } from "quimera";

const useStyles = makeStyles(theme => ({
  cerrada: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  abierta: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ListItemArqueo({ arqueo, selected = false, ...props }) {
  const classes = useStyles();

  const avatarClassName =
    (!!arqueo.abierta && classes.abierta) || (!arqueo.abierta && classes.cerrada);

  const avatarIcon = (!!arqueo.abierta && "hourglass_empty") || (!arqueo.abierta && "done");

  return (
    <ListItem className={selected ? classes.cardSelected : classes.card} {...props} disableGutters>
      <ListItemAvatar>
        <Avatar className={avatarClassName}>
          <Icon>{avatarIcon}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${arqueo.id || "Arqueo"}`}</Box>
              <Box display="inline">{`${util.euros(arqueo.inicio)}`}</Box>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${arqueo.codtpv_agenteapertura}`}</Typography>
              </Box>
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(arqueo.diadesde)}`}</Typography>
              </Box>
            </Box>
          </>
        }
      />
    </ListItem>
  );
}

export default ListItemArqueo;
