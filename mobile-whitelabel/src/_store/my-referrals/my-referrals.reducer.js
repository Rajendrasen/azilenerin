import { state as initialState } from './my-referrals.state';
import { UPDATE_USER_NOTIFICATION, CREATE_REFERRAL } from './my-referrals.actions';

export const myReferralsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_NOTIFICATION:
      return handleUpdateUserNotification(state, action);
    case CREATE_REFERRAL:
      return handleCreateReferral(state, action);
    default:
      return state;
  }
};

const handleUpdateUserNotification = (state, action) => {
  const { updatedNotification, notificationId } = action.payload;
  const { notifications } = state;
  const updatedNotifications = notifications.map(notification => {
    if (notification.id == notificationId) {
      notification = updatedNotification;
    }
    return notification;
  });
  return {
    ...state,
    notifications: updatedNotifications,
  };
};

const handleCreateReferral = (state, action) => {
  const { newReferral } = action.payload;
  return {
    ...state,
    referrals: [...state.referrals, { ...newReferral }],
  };
};
