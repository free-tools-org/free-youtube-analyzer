import * as React from "react";
import { connect } from 'react-redux';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { googleLoginResponse, googleLoadRestApi } from '../actions/google-oauth2';
import { getVideoList } from '../actions/youtube';
const YoutubeLandingPage = ({ GoogleAuth, GoogleClientLoaded, saveGoogleLoginResponse, loadGoogleRestApi, getYoutubeVideoList }) => {

  React.useEffect(() => {
    console.log('useEffect');
    console.log(GoogleAuth);
    console.log(GoogleClientLoaded);
    console.log(window.gapi);
    // console.log(window.gapi.client);
    if (GoogleAuth && !GoogleAuth.error && !GoogleClientLoaded) {
      loadGoogleRestApi();
    }

    if (GoogleAuth && !GoogleAuth.error && GoogleClientLoaded) {
      // getYoutubeVideoList({channelId:'UCtFf0Mb7MaluoPuyYonfaPQ'});
      // window.gapi.client.youtube.search.list({
      //   "part": [
      //     "snippet"
      //   ],
      //   channelId: "UCtFf0Mb7MaluoPuyYonfaPQ"
      // })
      //   .then(response => {
      //     console.log('search list', JSON.parse(response.body));
      //   });
    }

    return () => {
      // cleanup;
    };
  }, [GoogleAuth, GoogleClientLoaded]);

  console.log(`Client ID ${process.env.GATSBY_GOOGLE_CLIENT_ID}`);
  return (
    <div>
      {!GoogleAuth || GoogleAuth.error ? (
        <GoogleLogin
          clientId={process.env.GATSBY_GOOGLE_CLIENT_ID}
          scope="https://www.googleapis.com/auth/youtube.readonly"
          onSuccess={(response) => {
            console.log('Success login');
            console.log(JSON.stringify(response, null, 2));
            saveGoogleLoginResponse(response);
          }}
          onFailure={(response) => {
            console.log(response);
            saveGoogleLoginResponse(null);
          }}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      ) : (
        <GoogleLogout
          clientId={process.env.GATSBY_GOOGLE_CLIENT_ID}
          onLogoutSuccess={(response) => { console.log(JSON.stringify(response, null, 2)); saveGoogleLoginResponse(response); }}
          onFailure={(response) => { console.log(response); saveGoogleLoginResponse(null); }}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      )}
    </div>);
};

const mapStateToProps = (state) => ({
  GoogleAuth: state.GoogleAuth.loginResponse,
  GoogleClientLoaded: state.GoogleAuth.clientLoaded
});

const mapDispatchToProps = dispatch => ({
  saveGoogleLoginResponse: (response) => dispatch(googleLoginResponse(response)),
  loadGoogleRestApi: () => dispatch(googleLoadRestApi()),
  getYoutubeVideoList: (channelId) => dispatch(getVideoList(channelId))
});

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeLandingPage);;