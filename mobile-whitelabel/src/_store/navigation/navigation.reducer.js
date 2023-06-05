import { state as initialState } from './navigation.state';
import { UPDATE_PATHNAME } from './navigation.actions';

export const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PATHNAME:
      return handleUpdatePathname(state, action);
    default:
      return state;
  }
};
const handleUpdatePathname = (state, action) => {
  const { payload } = action;
  const { pathname } = payload;
  return {
    ...state,
    currentLocation: pathname,
  };
};
