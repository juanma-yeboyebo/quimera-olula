import React, { useEffect, useState } from "react";

// import { useAppValue } from '../../hooks'
import { util } from "../..";
import { TemplateProvider } from "../../contexts";
import { loadSubView, useSubView } from "../../hooks/useManager";

/**
 *   Lets you create Template components for extension/mix system
 */
function SubView({ id, ...props }) {
  // const [{ environment }] = useAppValue()
  const environment = util.getEnvironment();

  const [loaded, setLoaded] = useState(false);
  const visibleLoading = environment.inDevelopment();

  async function initSubView(_id) {
    setLoaded(false);
    await loadSubView(_id);
    setLoaded(true);
  }

  useEffect(() => {
    initSubView(id);
  }, [id]);

  const [, , [FirstSubView, ...parents], style] = useSubView(id);

  return loaded && FirstSubView ? (
    <TemplateProvider
      value={{
        references: [],
        parents,
        style,
        templateProps: props,
      }}
    >
      <FirstSubView parents={parents} useStyles={style} {...props} />
    </TemplateProvider>
  ) : null;
  // // visibleLoading && (
  // //   <div>Loading SubView...</div>
  // )
}

export default SubView;
