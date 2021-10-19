import {
  PROGRESS_RESET,
  PROGRESS_CHANNELS_SET,
  PROGRESS_CHANNELS_INCREMENT,
  PROGRESS_VIDEOS_SET,
  PROGRESS_VIDEO_INCREMENT,
} from '../actions/types';

const INITIAL_STATE = {
  channels: {
    current: 0,
    total: 0,
  },
  videos: {
    current: 0,
    total: 0,
  }
};

export const progressReducer = (state = INITIAL_STATE, action) => {
  let newState = {};
  switch (action.type) {

    case PROGRESS_RESET:
      return INITIAL_STATE;

    case PROGRESS_CHANNELS_SET:
      newState = {
        ...state,
        channels: {
          current: action.payload.current || state.channels.current,
          total: action.payload.total || state.channels.total
        }
      };
      return newState;

    case PROGRESS_CHANNELS_INCREMENT:
      newState = {
        ...state,
        channels: {
          total: state.channels.total + (action.payload.total || 0),
          current: state.channels.current + (action.payload.value || 0),
        }
      };
      return newState;

    case PROGRESS_VIDEOS_SET:
      console.log("PROGRESS_VIDEOS_SET", action.payload)
      newState = {
        ...state,
        videos: {
          current: action.payload.current || 0,
          total: action.payload.total || 0
        }
      };
      return newState;

    case PROGRESS_VIDEO_INCREMENT:
      newState = {
        ...state,
        videos: {
          total: state.videos.total + (action.payload.total || 0),
          current: state.videos.current + (action.payload.value || 0),
        }
      };
      return newState;

    default:
      return state;
  }
};