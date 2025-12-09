import React, { useCallback } from "react";

function FieldConNavegacionEnter({ children, ...props }) {
  // Navegar al siguiente elemento focusable
  const navigateToNextElement = useCallback(currentElement => {
    const form = currentElement.closest("form") || document;
    const focusableElements = form.querySelectorAll(
      'input[type="text"]:not([disabled]), input[type="number"]:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [role="button"]:not([disabled])',
    );

    const currentIndex = Array.from(focusableElements).indexOf(currentElement);
    const nextElement = focusableElements[currentIndex + 1];

    if (nextElement) {
      // Forzar focus visible (simular navegación con teclado)
      nextElement.focus({ focusVisible: true });

      // Para elementos input, seleccionar el texto
      if (nextElement.type === "text" || nextElement.type === "number") {
        nextElement.select();
      }
    }
  }, []);

  // Manejar tecla Enter para navegación
  const handleKeyDown = useCallback(
    event => {
      if (event.key === "Enter" || event.keyCode === 13) {
        setTimeout(() => navigateToNextElement(event.target), 50);
      }
    },
    [navigateToNextElement],
  );

  // Clonar el children y añadir el onKeyDown
  return React.cloneElement(children, {
    ...children.props,
    ...props,
    onKeyDown: handleKeyDown,
  });
}

export default FieldConNavegacionEnter;
