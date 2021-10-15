import { combineReducers } from 'redux';


import GoogleOAuthReducer from './google-oauth2';

export default combineReducers({
  GoogleAuth: GoogleOAuthReducer
});