import { combineReducers } from 'redux';

import { reducers } from './_shared';
import { dashboardReducer } from './dashboard';
import { employeeDetailsReducer } from './employee-details';
import { manageJobsReducer } from './manageJobs';
import { browseJobsReducer } from './browseJobs';
import { editUserProfileReducer } from './editUserProfile';
import { myReferralsReducer } from './my-referrals';
import { notificationsReducer } from './notifications';
import { settingsReducer } from './settings';
import { navigationReducer } from './navigation';

export default combineReducers({
  user: reducers.userReducer,
  dashboard: dashboardReducer,
  employeeDetails: employeeDetailsReducer,
  manageJobs: manageJobsReducer,
  browseJobs: browseJobsReducer,
  editUserProfile: editUserProfileReducer,
  myReferrals: myReferralsReducer,
  notifications: notificationsReducer,
  referral: reducers.referralReducer,
  settings: settingsReducer,
  navigation: navigationReducer,
});
