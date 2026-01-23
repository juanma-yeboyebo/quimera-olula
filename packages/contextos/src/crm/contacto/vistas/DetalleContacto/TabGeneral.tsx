import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Contacto } from "../../diseño.ts";
import "./TabGeneral.css";

interface TabGeneralProps {
  contacto: HookModelo<Contacto>;
}

export const TabGeneral = ({ contacto }: TabGeneralProps) => {
  const { uiProps } = contacto;

  return (
    <div className="TabGeneral">
      <quimera-formulario>
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="NIF" {...uiProps("nif")} />
        <QInput label="Email" {...uiProps("email")} />
        <QInput label="Teléfono" {...uiProps("telefono1")} />
      </quimera-formulario>
    </div>
  );
};
