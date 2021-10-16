import * as React from "react";
import { connect } from 'react-redux';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { googleLoginResponse, googleLoadRestApi } from '../actions/google-oauth2';
import { getPlaylists, resetYoutubeStore } from '../actions/youtube';
import { Helmet } from 'react-helmet';
import ProgressBar from '../components/progress-bar';
const YoutubeLandingPage = ({
  GoogleAuth,
  GoogleClientLoaded,
  saveGoogleLoginResponse,
  loadGoogleRestApi,
  resetYoutubeData,
  getYoutubePlaylist,
  playlists,
  playlistItems,
  videos }) => {
  React.useEffect(() => {
    console.log('useEffect');
    // console.log(GoogleAuth);
    // console.log(GoogleClientLoaded);
    // console.log(window.gapi);
    // console.log(props);
    // console.log(window.gapi.client);
    if (GoogleAuth && !GoogleAuth.error && !GoogleClientLoaded) {
      loadGoogleRestApi();
    }

    if (GoogleAuth && !GoogleAuth.error && GoogleClientLoaded) {
      // dispatch(resetYoutubeStore());
      resetYoutubeData();
      // getYoutubePlaylist({
      //   channelId: "UCtFf0Mb7MaluoPuyYonfaPQ",
      //   part: [
      //     "snippet"
      //   ],
      // });
    }

    return () => {
      // cleanup;
    };
  }, [GoogleAuth, GoogleClientLoaded]);

  React.useEffect(() => {
    console.log("Playlists loaded");
    return () => {
      // cleanup;
    };
  }, [playlists]);

  console.log(`Client ID ${process.env.GATSBY_GOOGLE_CLIENT_ID}`);
  return (
    <div>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@200&display=swap" rel="stylesheet" />
        <style type="text/css">{`
          html,body {
            font-family: 'Kanit', sans-serif;
          }
          `}</style>
      </Helmet>
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
      <ProgressBar title="Loading playlist" current={70} max={100} color="bg-danger" />
    </div>);
};

const mapStateToProps = (state) => ({
  GoogleAuth: state.GoogleAuth.loginResponse,
  GoogleClientLoaded: state.GoogleAuth.clientLoaded,
  playlists: state.youtube.playlists,
  playlistItems: state.youtube.playlistItems,
  videos: state.youtube.videos,
  progress: state.progress
});

const mapDispatchToProps = dispatch => ({
  saveGoogleLoginResponse: (response) => dispatch(googleLoginResponse(response)),
  loadGoogleRestApi: () => dispatch(googleLoadRestApi()),
  resetYoutubeData: () => dispatch(resetYoutubeStore()),
  getYoutubePlaylist: (options) => dispatch(getPlaylists(options))
  // dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeLandingPage);;;