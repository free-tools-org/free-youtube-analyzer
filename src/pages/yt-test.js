import * as React from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const YoutubeLandingPage = () => {


  console.log(`Client ID ${process.env.GATSBY_GOOGLE_CLIENT_ID}`);
  return (
    <div>
      <GoogleLogin
        clientId={process.env.GATSBY_GOOGLE_CLIENT_ID}
        onSuccess={(response) => { console.log(JSON.stringify(response,null,2)); }}
        onFailure={(response) => { console.log(response); }}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default YoutubeLandingPage;