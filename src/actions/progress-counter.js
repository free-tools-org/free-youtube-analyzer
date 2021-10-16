import {
  PROGRESS_PLAYLIST_RESET,
  PROGRESS_PLAYLIST_INCREMENT,
  PROGRESS_PLAYLIST_ITEM_INCREMENT,
  PROGRESS_VIDEO_INCREMENT
} from './types';

export const resetPlaylistProgress = () => (dispatch) => {
  dispatch({
    type: PROGRESS_PLAYLIST_RESET
  });
};
