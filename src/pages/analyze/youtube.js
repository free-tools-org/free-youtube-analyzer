import * as React from "react";
import { connect } from 'react-redux';
// import { parse as parseDuration, toSeconds } from 'iso8601-duration';
import { navigate } from 'gatsby';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { googleLoginResponse, googleLoadRestApi } from '../../actions/google-oauth2';

import { splitChunk } from '../../lib/helpers';
import Layout from '../../components/layouts/layout';

import {
  statusReset,
  statusUpdateIsWorking,
  statusUpdateReadyToWork
} from '../../actions/youtube-status';
import {
  resetYoutubeStore,
  getChannelData,
  addPlaylistIds,
  getChannelPlaylists,
  getPlaylistItemsBatch,
  getVideoListBatch,
} from '../../actions/youtube';

import { batchResetPlaylist, batchResetVideo } from '../../actions/batch-counter';
import { resetAllProgress, resetVideoProgress } from '../../actions/progress-counter';

import ProgressBar from '../../components/progress-bar';

const CHANNEL_ID = "UCtFf0Mb7MaluoPuyYonfaPQ"; // ลงทุนแมน
// const CHANNEL_ID = "UCGO2v4qXvUMzYQBwmi69t6Q"; // Space Stratagem with Shaling
// const CHANNEL_ID = "UC-ILIvzKEsf6u_ZUFrnoRMg"; // คุณครูพอใจ

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
    setIsWorking,

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
      setIsWorking(false);
    }

    return () => {
      // cleanup;
    };
  }, [GoogleAuth, GoogleClientLoaded]);

  React.useEffect(() => {
    if (youtubeStatus.isChannelLoaded && youtubeStatus.isWorking) {
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
    if (youtubeStatus.isPlaylistLoaded && youtubeStatus.isWorking) {
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
    if (batchCounter.playlist.finished && youtubeStatus.isWorking) {
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
    if (batchCounter.videos.finished && youtubeStatus.isWorking) {
      console.log('finished');
      setIsWorking(false);
      navigate('/analyze/reports', {
        replace: true
      });
    }
  }, [batchCounter.videos.finished]);

  const start = () => {
    if (GoogleAuth && !GoogleAuth.error && GoogleClientLoaded) {
      resetStatus();
      resetProgress();
      resetYoutubeData();
      setIsWorking(true);
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
    <Layout>
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
          <button className={`btn btn-primary ${youtubeStatus.isWorking && "btn-disabled"}`} onClick={() => { start(); }} disabled={youtubeStatus.isWorking}>Start</button>
        ) : (
          <button className="btn btn-diusabled" disabled={true}>Login first</button>
        )
      }
      {
        youtubeStatus.isWorking && (
          <div className="container">
            <div className="row">
              <div className="col">
                <ProgressBar title="Loading video data" current={progress.videos.current} max={progress.videos.total} color="bg-info" />
              </div>
            </div>
          </div>
        )
      }
    </Layout>);

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
  setIsWorking: (b) => dispatch(statusUpdateIsWorking(b)),

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