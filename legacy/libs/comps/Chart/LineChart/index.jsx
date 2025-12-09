import React from "react";

import BaseChart from "../BaseChart";

export default function LineChart({ ...props }) {
  return <BaseChart type="line" {...props} />;
}
