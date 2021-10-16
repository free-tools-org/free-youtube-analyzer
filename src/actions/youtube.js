import { YOUTUBE_RESET_DATA, YOUTUBE_GET_PLAYLISTS, YOUTUBE_GET_PLAYLIST_ITEMS, YOUTUBE_GET_VIDEO_LIST } from './types';
import { youtubeListApi } from '../lib/api';

export const resetYoutubeStore = () => (dispatch) => {
  dispatch({
    type: YOUTUBE_RESET_DATA
  });
};


export const getPlaylists = (options) => async (dispatch) => {
  /**
   *
   * document: https://developers.google.com/youtube/v3/docs/playlists/list
   *
   **/
  if (window.gapi?.client) {
    // let playlists = [];
    try {
      const playlists = await youtubeListApi(window.gapi.client.youtube.playlists.list, options);
      dispatch({ type: YOUTUBE_GET_PLAYLISTS, payload: playlists });
    } catch (e) {
      console.error(e.result.error.message);
      throw e;
    }
  }
};

export const getPlaylistItems = (option) => async (dispatch) => {
  /**
   *
   * document: https://developers.google.com/youtube/v3/docs/playlistItems/list
   *
   **/
  if (window.gapi?.client) {
    try {
      const playlistItems = await youtubeListApi(window.gapi.client.youtube.playlistItems.list, option);
      dispatch({ type: YOUTUBE_GET_PLAYLIST_ITEMS, payload: playlistItems });
    } catch (e) {
      console.error(e.result.error.message);
      throw e;
    }
  }
};

export const getVideoList = (option) => async (dispatch) => {
  /**
   *
   *  document: https://developers.google.com/youtube/v3/docs/videos/list
   *
   **/

  if (window.gapi?.client) {
    try {
      const videosList = await youtubeListApi(window.gapi.client.youtube.videos.list, option);
      dispatch({ type: YOUTUBE_GET_VIDEO_LIST, payload: videosList });
    } catch (e) {
      console.error(e.result.error.message);
      throw e;
    }
  }
};