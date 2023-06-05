import { createAction } from '../../helpers';

export const FETCH_REFERRALS = 'Referral/FETCH_REFERRALS';
export const SET_CURRENT_REFERRAL = 'Referral/SET_CURRENT_REFERRAL';
export const UPDATE_REFERRAL = 'Referral/UPDATE_REFERRAL';
export const UPDATE_REFFERALS_NOT_HIRED = 'Referral/UPDATE_REFFERALS_NOT_HIRED';

export const actions = {
  fetchReferrals: createAction(FETCH_REFERRALS),
  selectReferral: createAction(SET_CURRENT_REFERRAL),
  updateReferral: createAction(UPDATE_REFERRAL),
  updateReferralsNotHired: createAction(UPDATE_REFFERALS_NOT_HIRED),
};
