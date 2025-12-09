import React, { createContext, useCallback, useReducer } from "react";

export const AppContext = createContext();

function AppProviderFunc({ reducer, apiClient, initialState, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const apiMiddleware = next => action => {
    // apiClient(action, apiDispatch)
    return next({
      ...action,
      payload: {
        ...action.payload,
        dispatch: apiDispatch,
      },
    });
  };

  const apiDispatch = useCallback(apiMiddleware(dispatch), []);

  const dispatcher = useCallback(action => {
    const myAction = {
      ...action,
      payload: {
        ...action.payload,
        dispatch: dispatcher,
      },
    };
    dispatch(myAction);
  }, []);

  return <AppContext.Provider value={[state, dispatcher]}>{children}</AppContext.Provider>;
}

export const AppProvider = AppProviderFunc;
