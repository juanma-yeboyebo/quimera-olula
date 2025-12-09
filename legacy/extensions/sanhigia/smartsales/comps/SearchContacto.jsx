import { Field, Icon } from "@quimera/comps";
import { navigate, useStateValue } from "quimera";

export default function SearchContacto({ navigation, ...props }) {
  const [{ search }] = useStateValue();

  return (
    <Field.Text
      id="search"
      autoComplete="off"
      placeholder="Introduce nombre/e-mail/teléfono"
      onEnter={value => navigation && navigate(`/ss/contactos/${value}`)}
      endAdornment={
        <Icon
          onClick={() => navigation && navigate(`/ss/contactos/${search}`)}
          data-cy="search-button"
        >
          search
        </Icon>
      }
      fullWidth
    />
  );
}
