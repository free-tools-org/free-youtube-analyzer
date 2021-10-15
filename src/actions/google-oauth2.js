import { GOOGLE_OAUTH2, GOOGLE_CLIENT_LOADED } from "./types";

export const googleLoginResponse = (googleResponse) => dispatch => {
  if (typeof googleResponse === 'undefined') {
    googleResponse = null;
  }
  // console.log('action google auth', googleResponse);
  dispatch({ type: GOOGLE_OAUTH2, payload: googleResponse });
};

export const googleLoadRestApi = () => dispatch => {
  if (window.gapi) {
    // let loadClientPromise = null;
    if (!window.gapi.client) {
      window.gapi.load('client', () => {
        window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
          .then(() => {
            dispatch({ type: GOOGLE_CLIENT_LOADED, payload: true });
          });
      });
    }
  }
};