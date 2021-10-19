import {
  PROGRESS_RESET,
  PROGRESS_VIDEOS_SET,
  PROGRESS_VIDEO_INCREMENT,
} from './types';

export const resetAllProgress = () => (dispatch) => {
  dispatch({
    type: PROGRESS_RESET
  });
};

export const resetVideoProgress = (total) => (dispatch) => {
  dispatch({
    type: PROGRESS_VIDEOS_SET,
    payload: {
      total: total
    }
  });
};

export const incrementVideosProgress = (total, value) => (dispatch) => {
  dispatch({
    type: PROGRESS_VIDEO_INCREMENT,
    payload: {
      total: total,
      value: value
    }
  });
};