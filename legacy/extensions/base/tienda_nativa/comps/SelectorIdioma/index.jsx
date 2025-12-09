import { Box, Button, Menu, MenuItem } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useTranslation } from "@quimera/thirdparty";
import { getLanguages } from "quimera";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  botonIdiomaActual: {
    color: "white",
  },
}));

function SelectorIdioma({ estilos, ...props }) {
  const classes = useStyles();
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const lngs = getLanguages();
  const { i18n } = useTranslation();

  if (!lngs) {
    return null;
  }
  const handleClickLang = event => {
    setAnchorEl(event.currentTarget);
    setDialogoAbierto(true);
  };

  const cambiaIdioma = lng => {
    i18n.changeLanguage(lng);
    setDialogoAbierto(false);
  };

  return (
    <>
      <Box mx={1}>
        <Button
          id="lang"
          className={estilos ? estilos.botonIdiomaActual : classes.botonIdiomaActual}
          onClick={handleClickLang}
          text={i18n.resolvedLanguage}
          variant="text"
        />
      </Box>

      <Menu
        id="menuIdiomas"
        open={dialogoAbierto}
        anchorEl={anchorEl}
        onClose={() => setDialogoAbierto(false)}
      >
        {Object.keys(lngs).map(lng => (
          <MenuItem key={lng}>
            <Button
              key={lng}
              color="primary"
              variant={i18n.resolvedLanguage === lng ? "contained" : "text"}
              onClick={() => cambiaIdioma(lng)}
            >
              {lngs[lng].nativeName}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default SelectorIdioma;
