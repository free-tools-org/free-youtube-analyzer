import { combineReducers } from 'redux';


import GoogleOAuthReducer from './google-oauth2';
import { statusReducer } from './status-reducer';
import { youtubeReducers } from './youtube-reducer';
import { progressReducer } from './progress-reducer';
import { batchReducer } from './batch-counter-reducer';


export default combineReducers({
  GoogleAuth: GoogleOAuthReducer,
  youtubeStatus: statusReducer,
  youtube: youtubeReducers,
  progress: progressReducer,
  batchCounter: batchReducer,
});