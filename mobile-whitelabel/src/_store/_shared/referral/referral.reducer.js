import { state as initialState } from './referral.state';
import * as Actions from './referral.actions';
import { referralData } from '../../../../test/data';

const findInArray = (array, key, value) => {
  // use old loop style to allow short-circuiting
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][key] === value) {
      return i;
    }
  }
  return -1;
};

export const referralReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.FETCH_REFERRALS:
      return handleFetchReferrals(state, action);
    case Actions.UPDATE_REFERRAL:
      return handleReferralUpdates(state, action);
    case Actions.SET_CURRENT_REFERRAL:
      return handleSelectReferral(state, action);
    case Actions.UPDATE_REFFERALS_NOT_HIRED:
      return handleUpdateAllReferralsFor('status', state, action);
    default:
      return state;
  }
};

const handleFetchReferrals = state => {
  return {
    ...state,
    referrals: referralData, // TODO: replace with the real payload
  };
};

const handleUpdateAllReferralsFor = (property, state, { payload }) => {
  const allReferrals = [...state.referrals];
  const exemptReferral = payload.id;
  allReferrals.forEach((referral, index) => {
    if (referral.id !== exemptReferral) {
      allReferrals[index] = {
        ...referral,
        status: 'Not Hired',
      };
    }
  });
  return {
    ...state,
    referrals: allReferrals,
  };
};

const handleReferralUpdates = (state, { payload }) => {
  let updatedReferral = {};
  Object.keys(payload).forEach(key => {
    updatedReferral[key] = payload[key];
  });

  const referralsCopy = [...state.referrals];
  const index = findInArray(referralsCopy, 'id', updatedReferral.id);
  if (index > -1) referralsCopy[index] = updatedReferral;

  return {
    ...state,
    referrals: referralsCopy,
  };
};

const handleSelectReferral = (state, { payload }) => {
  return {
    ...state,
    currentReferral: payload.referralId,
  };
};
