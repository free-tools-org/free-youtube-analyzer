import {
  PROGRESS_PLAYLIST_RESET,
  PROGRESS_PLAYLIST_INCREMENT,
  PROGRESS_PLAYLIST_ITEM_INCREMENT,
  PROGRESS_VIDEO_INCREMENT
} from '../actions/types';

const INITIAL_STATE = {
  playlist: {
    current: 0,
    total: 100
  },
  playlistItems: {
    current: 0,
    total: 100,
  },
  videos: {
    current: 0,
    total: 100
  }
};

export const progressReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROGRESS_PLAYLIST_RESET:
      return {
        playlist: {
          current: 0,
          total: action.payload.playlistsTotal
        },
        playlistItems: {
          current: 0,
          total: action.payload.playlistItemsTotal
        },
        videos: {
          current: 0,
          total: action.payload.videosTotal
        }
      };
    case PROGRESS_PLAYLIST_INCREMENT:
      return {
        ...state, playlist: {
          current: action.payload.current,
          total: action.payload.total
        }
      };
    case PROGRESS_PLAYLIST_ITEM_INCREMENT:
      return {
        ...state, playlistItems: {
          current: action.payload.current,
          total: action.payload.total
        }
      };
    case PROGRESS_VIDEO_INCREMENT:
      return {
        ...state, videos: {
          current: action.payload.current,
          total: action.payload.total
        }
      };
    default:
      return state;
  }
};