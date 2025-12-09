import { useEffect, useState /* useCallback */ } from "react";

import { util } from "../..";
import { StateProvider, TemplateProvider } from "../../contexts";
import { getView, /* viewLoaded */ loadView } from "../../hooks/useManager";

/**
 *   Lets you create Template components for extension/mix system
 */
function View({ id, ...props }) {
  // const [{ environment }] = useAppValue()
  const environment = util.getEnvironment();
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState([[{}, {}], {}, [], {}]);
  // const [view, setView] = useState(getView(id))

  const visibleLoading = environment.inDevelopment();

  async function initView(nId) {
    await loadView(nId);
    setView(getView(nId));
    setLoaded(true);
  }

  // Replace initView func
  // const initView = useCallback(async (_id) => {
  //   setLoaded(false)
  //   await loadView(_id)
  //   setView(getView(_id))
  //   setLoaded(true)
  // }, [])

  useEffect(() => {
    setLoaded(false);
  }, [id]);

  useEffect(() => {
    !loaded && initView(id);
  }, [loaded]);

  // Replace 2 previous useEffects
  // useEffect(() => {
  //   if (viewLoaded(id)) {
  //     ['Container', 'Footer', 'Header'].includes(id) && setView(getView(id))
  //     setLoaded(true)
  //   } else {
  //     initView(id)
  //   }
  // }, [initView, id, setView, setLoaded])

  const [[reducer, initial], apiClient, [FirstView, ...parents], style] = view;

  return loaded && FirstView ? (
    <TemplateProvider
      value={{
        references: [],
        parents,
        style,
        templateProps: props,
      }}
    >
      <StateProvider reducer={reducer} apiClient={apiClient} initialState={initial}>
        <FirstView useStyles={style} {...props} />
      </StateProvider>
    </TemplateProvider>
  ) : (
    visibleLoading && <div>Loading view...</div>
  );
}

export default View;
