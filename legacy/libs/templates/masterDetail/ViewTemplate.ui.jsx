import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function TemplateName({ templatePK, useStyles }) {
  const [{ templateName }, dispatch] = useStateValue();
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdTemplateNameProp",
      payload: { id: templatePK ? parseInt(templatePK) : "" },
    });
  }, [templatePK]);

  const callbacTemplateNameCambiado = useCallback(
    payload => dispatch({ type: "onTemplateNameItemChanged", payload }),
    [],
  );
  console.log(templateName);

  return (
    <Quimera.Template id="TemplateName">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="TemplateName/TemplateNameMasterSubView" templatePK={templatePK} />}
        DetailComponent={
          <Quimera.View
            id="TemplateName"
            initAlbaran={templateName.dict[templateName.current]}
            callbackChanged={callbacTemplateNameCambiado}
          />
        }
        current={templateName.current}
      />
    </Quimera.Template>
  );
}

export default TemplateName;
