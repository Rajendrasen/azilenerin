import { userReducer, userActions } from './user';
import { referralReducer, referralActions } from './referral';

const reducers = {
  userReducer,
  referralReducer,
};

export { reducers, userActions, referralActions };
