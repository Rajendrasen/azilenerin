// TODO: remove mock data when api is ready
import { userData } from '../../../test/data/mb-data';
import { referralData } from '../../../test/data/mb-data';

// just initial setup, will probably change
export const state = {
  users: userData,
  currentUser: userData[0],
  referrals: referralData,
  selectedUser: {},
};
