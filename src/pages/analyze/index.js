import * as React from 'react';
import { connect } from 'react-redux';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { navigate } from 'gatsby';
import Layout from '../../components/layouts/layout';

import { googleLoginResponse, googleLoadRestApi } from '../../actions/google-oauth2';

import {
  statusUpdateReadyToWork
} from '../../actions/youtube-status';

const AnalyzeStartPage = ({
  GoogleAuth,
  GoogleClientLoaded,
  saveGoogleLoginResponse,
  loadGoogleRestApi,
  setReadyToWork,
  readyToWork
}) => {

  React.useEffect(() => {
    if (GoogleAuth && !GoogleAuth.error) {
      loadGoogleRestApi();
    }
  }, [GoogleAuth]);

  React.useEffect(() => {
    setReadyToWork(GoogleClientLoaded);
  }, [GoogleClientLoaded]);

  React.useEffect(() => {
    navigate('./youtube');
  }, [readyToWork]);


  console.log('GoogleClientLoaded', GoogleClientLoaded);
  return (
    <Layout>
      {!GoogleAuth || GoogleAuth.error ? (
        <GoogleLogin
          clientId={process.env.GATSBY_GOOGLE_CLIENT_ID}
          scope="https://www.googleapis.com/auth/youtube.readonly"
          onSuccess={(response) => {
            saveGoogleLoginResponse(response);
          }}
          onFailure={() => {
            saveGoogleLoginResponse(null);
          }}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      ) : (
        <GoogleLogout
          clientId={process.env.GATSBY_GOOGLE_CLIENT_ID}
          onLogoutSuccess={(response) => { console.log(JSON.stringify(response, null, 2)); saveGoogleLoginResponse(response); setReadyToWork(false); }}
          onFailure={(response) => { console.log(response); saveGoogleLoginResponse(null); }}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      )
      }
    </Layout>
  );
};

const mapStateToProps = state => ({
  GoogleAuth: state.GoogleAuth.loginResponse,
  GoogleClientLoaded: state.GoogleAuth.clientLoaded,
  readyToWork: state.youtubeStatus.isReadyToWork
});

const mapDispatchToProps = dispatch => ({
  saveGoogleLoginResponse: (response) => dispatch(googleLoginResponse(response)),
  loadGoogleRestApi: () => dispatch(googleLoadRestApi()),
  setReadyToWork: (b) => dispatch(statusUpdateReadyToWork(b)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalyzeStartPage);