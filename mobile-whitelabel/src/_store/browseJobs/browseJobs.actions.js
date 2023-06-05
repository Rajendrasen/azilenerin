import { createAction } from '../helpers';

export const RESET_FORM = 'ManageJobs/job/RESET_FORM';

export const actions = {
  resetAddJobForm: createAction(RESET_FORM),
};
