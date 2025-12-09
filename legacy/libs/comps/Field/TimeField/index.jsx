import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@quimera/thirdparty";

import BaseField from "../BaseField";
import TimeField from "./TimeField";

function TimeBase({ timePickerProps = {}, ...props }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <BaseField Component={<TimeField {...timePickerProps} />} {...props} />
    </MuiPickersUtilsProvider>
  );
}

export default TimeBase;
