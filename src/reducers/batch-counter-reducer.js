import {
  BATCH_RESET_PLAYLIST_COUNT,
  BATCH_PLAYLIST_INCREMENT,
  BATCH_RESET_VIDEO_COUNT,
  BATCH_VIDEO_INCREMENT
} from '../actions/types';
const INITIAL_STATE = {
  playlist: {
    total: 0,
    current: 0,
    finished: false
  },
  videos: {
    total: 0,
    current: 0,
    finished: false
  }
};

export const batchReducer = (state = INITIAL_STATE, action) => {
  let newState = {};
  switch (action.type) {

    case BATCH_RESET_PLAYLIST_COUNT:
      newState = {
        ...state,
        playlist: {
          total: action.payload.total || state.playlist.total,
          current: 0,
          finished: false
        }
      };
      return newState;

    case BATCH_PLAYLIST_INCREMENT:
      newState = {
        ...state,
        playlist: {
          current: state.playlist.current + 1,
          finished: state.playlist.current + 1 >= state.playlist.total,
          total: state.playlist.total,
        }
      };
      return newState;

    case BATCH_RESET_VIDEO_COUNT:
      newState = {
        ...state,
        videos: {
          total: action.payload.total || state.videos.total,
          current: 0,
          finished: false
        }
      };
      return newState;

    case BATCH_VIDEO_INCREMENT:
      newState = {
        ...state,
        videos: {
          current: state.videos.current + 1,
          finished: state.videos.current + 1 >= state.videos.total,
          total: state.videos.total,
        }
      };
      return newState;

    default:
      return state;
  }
};