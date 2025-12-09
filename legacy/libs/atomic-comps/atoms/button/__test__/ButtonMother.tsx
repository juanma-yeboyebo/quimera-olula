import { ReactElement } from "react";
import { Button, ButtonProps } from "../Button";

export class ButtonMother {
  static create(params?: Partial<ButtonProps>): ReactElement {
    const props = {
      children: "Test Button",
      ...params,
    };

    return <Button {...props} />;
  }
}
