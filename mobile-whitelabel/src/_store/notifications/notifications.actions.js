export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';

export const createFetchNotificationsAction = currentUser => {
  return {
    type: FETCH_NOTIFICATIONS,
    payload: {
      currentUser,
    },
  };
};
