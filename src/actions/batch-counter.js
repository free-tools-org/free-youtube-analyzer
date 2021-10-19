import {
  BATCH_RESET_PLAYLIST_COUNT,
  BATCH_PLAYLIST_INCREMENT,
  BATCH_RESET_VIDEO_COUNT,
  BATCH_VIDEO_INCREMENT
} from './types';

export const batchResetPlaylist = (total) => (dispatch) => {
  dispatch({
    type: BATCH_RESET_PLAYLIST_COUNT,
    payload: {
      total: total || 0
    }
  });
};

export const batchIncrementPlaylist = () => (dispatch) => {
  dispatch({
    type: BATCH_PLAYLIST_INCREMENT,
  });
};

export const batchResetVideo = (total) => (dispatch) => {
  dispatch({
    type: BATCH_RESET_VIDEO_COUNT,
    payload: {
      total: total || 0
    }
  });
};

export const batchIncrementVideo = () => (dispatch) => {
  dispatch({
    type: BATCH_VIDEO_INCREMENT,
  });
};