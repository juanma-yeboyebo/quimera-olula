import { Box, Button } from "@quimera/comps";
import React from "react";

import styles from "./SlidingBorder.module.css";

function SlidingBorder({ enlaces, urlBase, ...props }) {
  return (
    <Box className={styles.wrapper}>
      <Box className={styles.menuEnlaces}>
        {enlaces.map((enlace, index) => (
          <Box className={`${styles.lista} ${styles[`menuItem${index}`]}`}>
            <Button className={styles.enlace} href={`${urlBase}${enlace.url}`}>
              {enlace.titulo}
            </Button>
          </Box>
        ))}

        <hr className={styles.hscroll} />
      </Box>
    </Box>
  );
}

export default SlidingBorder;
