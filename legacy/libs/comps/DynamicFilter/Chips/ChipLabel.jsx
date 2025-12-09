import React from "react";

// To do: Chip en quimera-comps con propiedades maxWidth y tooltip
function ChipLabel({ children, maxWidth = 200 }) {
  return (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth,
      }}
    >
      {children}
    </div>
  );
}

export { ChipLabel };
