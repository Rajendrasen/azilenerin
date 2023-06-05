export const UPDATE_USER_NOTIFICATION = 'my-referrals/UPDATE_USER_NOTIFICATION';
export const CREATE_REFERRAL = 'my-referrals/CREATE_REFERRAL';

export const createUpdateUserNotificationAction = (updatedNotification, notificationId) => {
  return {
    type: UPDATE_USER_NOTIFICATION,
    payload: {
      notificationId,
      updatedNotification,
    },
  };
};

export const createCreateReferralAction = newReferral => {
  return {
    type: CREATE_REFERRAL,
    payload: {
      newReferral,
    },
  };
};
