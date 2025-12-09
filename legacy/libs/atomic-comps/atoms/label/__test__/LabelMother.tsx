import { ReactElement } from "react";
import { Label, LabelProps } from "../Label";

export class LabelMother {
  static create(params?: Partial<LabelProps>): ReactElement {
    const props = {
      children: "Test Label",
      ...params,
    };
    return <Label {...props} />;
  }
}
