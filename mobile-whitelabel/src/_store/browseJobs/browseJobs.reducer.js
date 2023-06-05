import { state as initialState } from './browseJobs.state';
import * as Actions from './browseJobs.actions';

export const browseJobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.RESET_FORM:
      return handleFormReset(state, action);
    default:
      return state;
  }
};

const handleFormReset = state => {
  return { ...state, currentJob: { ...initialState.currentJob } };
};
