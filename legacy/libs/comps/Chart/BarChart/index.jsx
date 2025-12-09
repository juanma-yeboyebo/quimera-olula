import React from "react";

import BaseChart from "../BaseChart";

export default function BarChart({ ...props }) {
  return <BaseChart type="bar" {...props} />;
}
