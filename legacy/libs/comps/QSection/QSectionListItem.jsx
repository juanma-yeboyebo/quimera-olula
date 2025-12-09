import { useState } from "react";

import { QSection } from "..";

function QSectionListItem({ selected, ...props }) {
  const [open, setOpen] = useState(true);

  return (
    <QSection
      activation={{
        active: selected && open,
        setActive: value => setOpen(value),
      }}
      readOnly
      mt={0}
      p={0}
      ensureVisible
      focusStyle="listItem"
      {...props}
    />
  );
}

export default QSectionListItem;
