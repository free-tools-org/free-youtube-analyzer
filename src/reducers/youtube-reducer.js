import { YOUTUBE_GET_PLAYLISTS, YOUTUBE_GET_PLAYLIST_ITEMS, YOUTUBE_GET_VIDEO_LIST } from '../actions/types';

const INITIAL_STATE = {
  playlists: [],
  playlistItems: [],
  videos: []
};

export const youtubeReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case YOUTUBE_GET_PLAYLISTS:
      return { ...state, playlists: action.payload };
    case YOUTUBE_GET_PLAYLIST_ITEMS:
      return { ...state, playlistItems: action.payload };
    case YOUTUBE_GET_VIDEO_LIST:
      return { ...state, videos: action.videos };
    default:
      return state;
  }
};