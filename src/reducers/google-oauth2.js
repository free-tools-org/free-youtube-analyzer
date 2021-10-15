import { GOOGLE_OAUTH2, GOOGLE_CLIENT_LOADED } from '../actions/types';

const INITIAL_STATE = {
  loginResponse: null,
  clientLoaded: false
};

const GoogleOAuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOOGLE_OAUTH2:
      return { ...state, loginResponse: action.payload };
    case GOOGLE_CLIENT_LOADED:
      return { ...state, clientLoaded: action.payload };
    default:
      return state;
  }
};

export default GoogleOAuthReducer;
