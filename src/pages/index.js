import * as React from "react";
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { parse as parseDuration, toSeconds } from 'iso8601-duration';

import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { googleLoginResponse, googleLoadRestApi } from '../actions/google-oauth2';

import { splitChunk } from '../lib/helpers';

import {
  statusReset,
  statusUpdateReadyToWork
} from '../actions/youtube-status';
import {
  resetYoutubeStore,
  getChannelData,
  addPlaylistIds,
  getChannelPlaylists,
  getPlaylistItemsBatch,
  getVideoListBatch,
} from '../actions/youtube';

import { batchResetPlaylist, batchResetVideo } from '../actions/batch-counter';
import { resetAllProgress, resetVideoProgress } from '../actions/progress-counter';

import ProgressBar from '../components/progress-bar';

// const CHANNEL_ID = "UCtFf0Mb7MaluoPuyYonfaPQ"; // ลงทุนแมน
const CHANNEL_ID = "UCGO2v4qXvUMzYQBwmi69t6Q"; // Space Stratagem with Shaling

const YoutubeLandingPage = (props) => {
  const {
    GoogleAuth,
    GoogleClientLoaded,
    saveGoogleLoginResponse,
    loadGoogleRestApi,

    // status,
    resetStatus,
    youtubeStatus,
    setReadyToWork,

    // progress
    progress,
    resetProgress,
    resetVideoProgress,

    // youtube
    channels,
    videos,
    playlistIds,
    playlistItems,
    resetYoutubeData,
    getYoutubeChannelData,
    addYoutubePlaylistIds,
    getYoutubeChannelPlaylists,
    getYoutubePlaylistItems,
    getYoutubeVideos,

    // batch counter
    batchCounter,
    resetPlaylistBatch,
    resetVideoBatch,
  } = props;
  React.useEffect(() => {
    // console.log('useEffect');
    if (GoogleAuth && !GoogleAuth.error && !GoogleClientLoaded) {
      loadGoogleRestApi();
    }

    if (GoogleAuth && !GoogleAuth.error && GoogleClientLoaded) {
      setReadyToWork(true);
    }

    return () => {
      // cleanup;
    };
  }, [GoogleAuth, GoogleClientLoaded]);

  React.useEffect(() => {
    if (youtubeStatus.isChannelLoaded) {
      resetVideoProgress(channels.reduce((t, v) => {
        return t + parseInt(v.statistics.videoCount, 10);
      }, 0));
      const uploadPlaylists = channels.map((channel) => channel.contentDetails?.relatedPlaylists?.uploads);
      addYoutubePlaylistIds(uploadPlaylists); // add UPLOAD playlist id

      // get channel's playlists
      getYoutubeChannelPlaylists({
        part: [
          "snippet",
          "contentDetails"
        ],
        channelId: CHANNEL_ID,
        maxResults: 50
      });
    }
  }, [youtubeStatus.isChannelLoaded]);

  React.useEffect(() => {
    if (youtubeStatus.isPlaylistLoaded) {
      // grap playlist items for each playlist
      // console.log('playlistIds size', playlistIds.length);
      resetPlaylistBatch(playlistIds.length);
      playlistIds.map(playlistId => {
        getYoutubePlaylistItems({
          playlistId: playlistId,
          part: [
            "snippet"
          ],
          maxResults: 50
        });
      });
    }
  }, [youtubeStatus.isPlaylistLoaded]);

  React.useEffect(() => {
    if (batchCounter.playlist.finished) {
      const uniqueVideoIds = Array.from(new Set(playlistItems));
      const videoIdChunks = splitChunk(uniqueVideoIds, 10);
      resetVideoBatch(videoIdChunks.length);
      videoIdChunks.forEach(videoIdChunk => {
        getYoutubeVideos({
          part: [
            "snippet",
            "contentDetails",
            "statistics",
            "status",
          ],
          id: videoIdChunk
        });
      });
    }
  }, [batchCounter.playlist.finished]);

  React.useEffect(() => {
    if (batchCounter.videos.finished) {
      // console.log('finished');

      const allVideos = videos.map(v => {
        v.contentDetails.durationSecs = toSeconds(parseDuration(v.contentDetails.duration));
        v.snippet.publishedYM = v.snippet.publishedAt.split("T")[0].split("-").slice(0, -1).join("-");
        return v;
      });
      const allActiveVideos = allVideos.filter((v) => v.status.uploadStatus === 'processed');


      // separate videos by publishedYM

      // separate videos by durationSecs

      // separate videos by publishedYM + durationSecs



      // console.log(videos.map(v => ({ duration: v.contentDetails.duration, durationSecs: toSeconds(parseDuration(v.contentDetails.duration)) })));
      // window['allVideos'] = allActiveVideos;
    }
  }, [batchCounter.videos.finished]);

  const start = () => {
    if (GoogleAuth && !GoogleAuth.error && GoogleClientLoaded) {
      resetStatus();
      resetProgress();
      resetYoutubeData();
      getYoutubeChannelData({
        id: CHANNEL_ID,
        part: [
          "snippet",
          "contentDetails",
          "statistics"
        ],
        maxResults: 50
      });
    }
  };

  return (
    <div>
      <Helmet>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
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
            // console.log('Success login');
            // console.log(JSON.stringify(response, null, 2));
            saveGoogleLoginResponse(response);
          }}
          onFailure={(response) => {
            // console.log(response);
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
      )}
      {
        youtubeStatus.isReadyToWork ? (
          <button className="btn btn-primary" onClick={() => { start(); }}>Start</button>
        ) : (
          <button className="btn btn-diusabled" disabled={true}>Login first</button>
        )
      }
      {
        youtubeStatus.isReadyToWork && (
          <div className="container">
            <div className="row">
              <div className="col">
                {/* <ProgressBar title="Loading page activities" current={progress.activities.current} max={progress.activities.total} color="bg-info" /> */}
              </div>
            </div>
          </div>
        )
      }
    </div>);

};


const mapStateToProps = (state) => ({
  GoogleAuth: state.GoogleAuth.loginResponse,
  GoogleClientLoaded: state.GoogleAuth.clientLoaded,

  youtubeStatus: state.youtubeStatus,

  // progress bar
  progress: state.progress,

  // youtube related
  channels: state.youtube.channels,
  videos: state.youtube.videos,
  playlistIds: state.youtube.playlistIds,
  playlistItems: state.youtube.playlistItems,

  // batch counter
  batchCounter: state.batchCounter,
});

const mapDispatchToProps = dispatch => ({
  saveGoogleLoginResponse: (response) => dispatch(googleLoginResponse(response)),
  loadGoogleRestApi: () => dispatch(googleLoadRestApi()),

  // status actions
  resetStatus: () => dispatch(statusReset()),
  setReadyToWork: (b) => dispatch(statusUpdateReadyToWork(b)),

  // progress bar actions
  resetProgress: () => dispatch(resetAllProgress()),
  resetVideoProgress: (total) => dispatch(resetVideoProgress(total)),

  // youtube actions
  resetYoutubeData: () => dispatch(resetYoutubeStore()),
  getYoutubeChannelData: (options) => dispatch(getChannelData(options)),
  addYoutubePlaylistIds: (playlistIds) => dispatch(addPlaylistIds(playlistIds)),
  getYoutubeChannelPlaylists: (options) => dispatch(getChannelPlaylists(options)),
  getYoutubePlaylistItems: (options) => dispatch(getPlaylistItemsBatch(options)),
  resetPlaylistBatch: (total) => dispatch(batchResetPlaylist(total)),
  getYoutubeVideos: (options) => dispatch(getVideoListBatch(options)),
  resetVideoBatch: (total) => dispatch(batchResetVideo(total)),
});

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeLandingPage);