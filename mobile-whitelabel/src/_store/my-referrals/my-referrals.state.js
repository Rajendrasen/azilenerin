import { userData } from '../../../test/data/mb-data';
import { myReferralsData } from '../../../test/data/mb-data';
import { notificationData } from '../../../test/data/mb-data';

export const state = {
  currentUser: userData[0],
  referrals: myReferralsData,
  notifications: notificationData,
};
