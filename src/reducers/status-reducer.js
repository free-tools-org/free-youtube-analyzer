import {
  STATUS_RESET,
  STATUS_UPDATE_READY_TO_START,
  STATUS_CHANNEL_LOADED,
  STATUS_PLAYLIST_LOADED,
  STATUS_PLAYLIST_ITEMS_LOADED
} from '../actions/types';

const INITIAL_STATE = {
  isReadyToWork: false,
  isChannelLoaded: false,
  isPlaylistLoaded: false,
  isPlaylistItemLoaded: false,
};

export const statusReducer = (state = INITIAL_STATE, action) => {
  let newState = {};
  switch (action.type) {

    case STATUS_RESET:
      newState = {
        ...INITIAL_STATE,
        isReadyToWork: state.isReadyToWork // preserved for login button to manipulate
      };
      return newState;

    case STATUS_CHANNEL_LOADED:
      newState = {
        ...state,
        isChannelLoaded: action.payload
      };
      return newState;

    case STATUS_UPDATE_READY_TO_START:
      newState = {
        ...state,
        isReadyToWork: action.payload
      };
      return newState;

    case STATUS_PLAYLIST_LOADED:
      newState = {
        ...state,
        isPlaylistLoaded: action.payload
      };
      return newState;

    case STATUS_PLAYLIST_ITEMS_LOADED:
      newState = {
        ...state,
        isPlaylistItemLoaded: action.payload
      }
      return newState;

    default:
      return state;
  }
};