import { useEffect, useState } from "react";

/**
 * Hook para manejar el focus y limpieza automática del QArticuloVbarbaMarcado
 * después de guardar una línea.
 *
 * @param {Object} linea - Estado de la línea actual
 * @param {boolean} inline - Si está en modo inline
 * @param {Function} dispatch - Función dispatch del estado
 * @returns {number} articuloKey - Key para forzar re-render del componente
 */
export const useArticuloFocus = (linea, inline, dispatch) => {
  const [articuloKey, setArticuloKey] = useState(0);

  useEffect(() => {
    if (inline && linea?.event?.event === "created" && linea.event.serial >= 1) {
      setTimeout(() => {
        // Forzar re-render completo del QArticuloVbarbaMarcado
        setArticuloKey(prev => prev + 1);

        // Limpiar el estado
        dispatch({
          type: "onLineaBufferChanged",
          payload: {
            field: "referencia",
            value: null,
            option: null,
          },
        });

        // Enfocar después del re-render
        setTimeout(() => {
          const selectors = [
            '#linea\\.buffer\\/referencia input[type="text"]',
            '[id*="referencia"] input[type="text"]',
            ".MuiAutocomplete-input",
            'input[placeholder*="Artículo"]',
            'input[placeholder*="rtículo"]',
          ];

          let input = null;
          for (const selector of selectors) {
            input = document.querySelector(selector);
            if (input) {
              break;
            }
          }

          if (input) {
            input.focus();
          }
        }, 50);
      }, 100);
    }
  }, [linea?.event?.serial, inline, dispatch]);

  return articuloKey;
};
