import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
// import {loadDevTools} from './reduxDevTools'

// const devtools = process.env.NODE_ENV === "development" && window && window.devToolsExtension
//   ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
//   window.__REDUX_DEVTOOLS_EXTENSION__()
//   : f => f;
const initialState = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);

const ProviderWrapper = ({ element }) => <Provider store={store}>{element}</Provider>;

export default ProviderWrapper;
