import {
  STATUS_RESET,
  STATUS_UPDATE_READY_TO_START,
  STATUS_PLAYLIST_LOADED,
  STATUS_PLAYLIST_ITEMS_LOADED
} from './types';


export const statusReset = () => (dispatch) => {
  dispatch({
    type: STATUS_RESET
  });
};

export const statusUpdateReadyToWork = (status) => (dispatch) => {
  dispatch({
    type: STATUS_UPDATE_READY_TO_START,
    payload: status
  });
};

export const statusPlaylistLoaded = (status) => (dispatch) => {
  dispatch({
    type: STATUS_PLAYLIST_LOADED,
    payload: status
  });
};

export const statusPlaylistItemsLoaded = (status) => (dispatch) => {
  dispatch({
    type: STATUS_PLAYLIST_ITEMS_LOADED,
    payload: status
  });
};