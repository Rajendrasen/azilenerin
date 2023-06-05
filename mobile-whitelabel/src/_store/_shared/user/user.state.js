// TODO: remove mock data when api is ready
import {userData} from '../../../../test/data';
import {userData as topReferrerData} from '../../../../test/data/users.data';
export const state = {
  users: userData,
  // TODO: initial state of currentUser should be empty object for production
  currentUser: {},
  superUser: {},
  company: {},
  topReferrers: topReferrerData,
  currencyRate: 1,
  currencySymbol: '$',
  newNotification: null,
};
