import { state as initialState } from './manageJobs.state';
import * as Actions from './manageJobs.actions';
import { jobData } from '../../../test/data';
// import { jobData } from '../../../../test/data';

export const manageJobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.FETCH_JOBS:
      return handleFetchJobs(state, action);
    case Actions.SET_CURRENT_JOB:
      return handleSetJob(state, action);
    case Actions.UPDATE_ADD_JOB_FORM:
      return handleFormUpdates(state, action);
    case Actions.RESET_FORM:
      return handleFormReset(state, action);
    default:
      return state;
  }
};

const handleFetchJobs = state => {
  return {
    ...state,
    jobs: jobData, // TODO: replace with the real payload
  };
};

const handleFormUpdates = (state, { payload }) => {
  let newItems = {};
  Object.keys(payload).forEach(key => {
    newItems[key] = payload[key];
  });

  return {
    ...state,
    currentJob: { ...state.currentJob, ...newItems },
  };
};

const handleFormReset = state => {
  return { ...state, currentJob: { ...initialState.currentJob } };
};

const handleSetJob = (state, { payload }) => {
  return {
    ...state,
    currentJob: payload,
  };
};
