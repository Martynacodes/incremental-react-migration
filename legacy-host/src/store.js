import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { experimentsReducer } from "./reducers/experiments";
import { groupsReducer } from "./reducers/groups";

const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// One store for both apps. The legacy app owns it; the new app receives it as a property.
export const store = createStore(
  combineReducers({
    experiments: experimentsReducer,
    groups: groupsReducer,
  }),
  composeEnhancers(applyMiddleware(thunk))
);
