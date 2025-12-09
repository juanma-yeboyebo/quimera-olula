import { Button as ButtonMUI } from "@quimera/thirdparty";
function RawButton({ children, id, text, primary = false, onClick, data = null, ...props }) {
  return (
    <ButtonMUI id={id} onClick={e => onClick && onClick(e)} {...props}>
      {text}
      {children}
    </ButtonMUI>
  );
}

export default RawButton;
