import {
  YOUTUBE_RESET_DATA,
  YOUTUBE_ADD_CHANNELS,
  YOUTUBE_ADD_PLAYLIST_IDS,
  YOUTUBE_ADD_PLAYLIST_ITEM_IDS,
  YOUTUBE_ADD_VIDEOS,


  PROGRESS_CHANNELS_SET,
  PROGRESS_CHANNELS_INCREMENT,

  STATUS_CHANNEL_LOADED,
  STATUS_PLAYLIST_LOADED,

  BATCH_PLAYLIST_INCREMENT,
  BATCH_VIDEO_INCREMENT,
} from './types';

import { incrementVideosProgress } from './progress-counter';

import { youtubeListApi } from '../lib/api';

export const resetYoutubeStore = () => (dispatch) => {
  dispatch({
    type: YOUTUBE_RESET_DATA
  });
};

export const getChannelData = (options) => async (dispatch) => {
  if (window.gapi?.client) {
    try {
      const channels = await youtubeListApi(window.gapi.client.youtube.channels.list, options, (total, value) => {
        dispatch({
          type: PROGRESS_CHANNELS_SET,
          payload: {
            total: total
          }
        });
        dispatch({
          type: PROGRESS_CHANNELS_INCREMENT,
          payload: {
            value: value
          }
        });
      });
      dispatch({
        type: YOUTUBE_ADD_CHANNELS,
        payload: channels
      });
      dispatch({
        type: STATUS_CHANNEL_LOADED,
        payload: true
      });
    } catch (e) {
      console.error(e.result.error.message);
      throw e;
    }
  }
};

export const addPlaylistIds = (playlistIds) => dispatch => {
  dispatch({
    type: YOUTUBE_ADD_PLAYLIST_IDS,
    payload: playlistIds
  });

};

export const getChannelPlaylists = (option) => async (dispatch) => {
  /**
   *
   *  document: https://developers.google.com/youtube/v3/docs/playlists/list
   *
   **/

  if (window.gapi?.client) {
    try {
      const playlists = await youtubeListApi(window.gapi.client.youtube.playlists.list, option);

      dispatch({
        type: YOUTUBE_ADD_PLAYLIST_IDS,
        payload: playlists.map(playlist => playlist.id)
      });

      dispatch({
        type: STATUS_PLAYLIST_LOADED,
        payload: true
      });
    } catch (e) {
      console.error(e.result.error.message);
      throw e;
    }
  }
};

export const getPlaylistItemsBatch = (option) => async (dispatch) => {
  /**
   *
   *  document: https://developers.google.com/youtube/v3/docs/playlistItems/list
   *
   **/

  if (window.gapi?.client) {
    try {
      const playlistItems = await youtubeListApi(window.gapi.client.youtube.playlistItems.list, option);
      // console.log('playlistItems', playlistItems.length);

      dispatch({
        type: YOUTUBE_ADD_PLAYLIST_ITEM_IDS,
        payload: playlistItems.map(item => item.snippet.resourceId.videoId)
      });
      dispatch({
        type: BATCH_PLAYLIST_INCREMENT
      });
    } catch (e) {
      console.error(e.result.error.message);
      throw e;
    }
  }
};

export const getVideoListBatch = (option) => async (dispatch) => {
  /**
   *
   *  document: https://developers.google.com/youtube/v3/docs/videos/list
   *
   **/

  if (window.gapi?.client) {
    try {
      const videosList = await youtubeListApi(window.gapi.client.youtube.videos.list, option, (_total, incrementValue) => {
        // console.log("getVideoListBatch", _total, incrementValue);
        dispatch(incrementVideosProgress(null, incrementValue));
      });

      dispatch({
        type: YOUTUBE_ADD_VIDEOS,
        payload: videosList
      });
      dispatch({
        type: BATCH_VIDEO_INCREMENT
      });
      // dispatch({ type: YOUTUBE_GET_VIDEO_LIST, payload: videosList });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};