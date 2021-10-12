import { GOOGLE_OAUTH2 } from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOOGLE_OAUTH2:
      return state;
    default:
      return state;
  }
};