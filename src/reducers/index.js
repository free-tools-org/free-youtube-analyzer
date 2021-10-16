import { combineReducers } from 'redux';


import GoogleOAuthReducer from './google-oauth2';
import { youtubeReducers } from './youtube-reducer';
import { progressReducer } from './progress-reducer';
export default combineReducers({
  GoogleAuth: GoogleOAuthReducer,
  youtube: youtubeReducers,
  progress: progressReducer
});