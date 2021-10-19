import {
  YOUTUBE_RESET_DATA,
  YOUTUBE_ADD_CHANNELS,
  YOUTUBE_ADD_PLAYLIST_IDS,
  YOUTUBE_ADD_PLAYLIST_ITEM_IDS,
  YOUTUBE_ADD_VIDEOS,
} from '../actions/types';

const INITIAL_STATE = {
  channels: [],
  playlistIds: [],
  playlistItems: [],
  videos: []
};

export const youtubeReducers = (state = INITIAL_STATE, action) => {
  let newState = {};
  switch (action.type) {

    case YOUTUBE_RESET_DATA:
      return INITIAL_STATE;

    case YOUTUBE_ADD_CHANNELS:
      newState = {
        ...state,
        channels: [...state.channels, ...action.payload]
      };
      return newState;

    case YOUTUBE_ADD_PLAYLIST_IDS:
      newState = {
        ...state,
        playlistIds: [...state.playlistIds, ...action.payload]
      };
      return newState;

    case YOUTUBE_ADD_PLAYLIST_ITEM_IDS:
      newState = {
        ...state,
        playlistItems: [...state.playlistItems, ...action.payload]
      };
      return newState;

    case YOUTUBE_ADD_VIDEOS:
      newState = {
        ...state,
        videos: [...state.videos, ...action.payload]
      };
      return newState;

    default:
      return state;
  }
};