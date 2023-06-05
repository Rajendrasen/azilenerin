import { createAction } from '../helpers';

export const FETCH_JOBS = 'ManageJobs/FETCH_JOBS';
export const UPDATE_ADD_JOB_FORM = 'ManageJobs/job/UPDATE_ADD_JOB_FORM';
export const RESET_FORM = 'ManageJobs/job/RESET_FORM';
export const SET_CURRENT_JOB = 'ManageJobs/SET_CURRENT_JOB';
export const CLOSE_JOB = 'ManageJobs/CLOSE_JOB';

export const actions = {
  fetchJobs: createAction(FETCH_JOBS),
  updateAddJobForm: createAction(UPDATE_ADD_JOB_FORM),
  resetAddJobForm: createAction(RESET_FORM),
  setCurrentJob: createAction(SET_CURRENT_JOB),
  closeJob: createAction(CLOSE_JOB),
};
