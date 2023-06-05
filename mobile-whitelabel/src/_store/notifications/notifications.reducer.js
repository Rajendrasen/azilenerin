import { state as initialState } from './notifications.state';
import { FETCH_NOTIFICATIONS } from './notifications.actions';

export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return handleFetchNotifications(state, action);
    default:
      return state;
  }
};

const handleFetchNotifications = (state, action) => {
  const { payload } = action;
  const { currentUser } = payload;
  const { notifications } = state;
  const updatedUsersNotifications = notifications.filter(
    notification => notification.recipient.userId === currentUser.userId
  );
  return {
    ...state,
    userNotifications: updatedUsersNotifications,
  };
};
