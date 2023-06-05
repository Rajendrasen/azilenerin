import { state as initialState } from './editUserProfile.state';
import { UPDATE_PASSWORD, UPDATE_USER_PROFILE } from './editUserProfile.actions';

export const editUserProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PASSWORD:
      return handleUpdatePassword(state, action);
    case UPDATE_USER_PROFILE:
      return handleUpdateUserProfile(state, action);
    default:
      return state;
  }
};

const handleUpdatePassword = (state, action) => {
  const { payload } = action;
  const { userId, password } = payload;
  const { users } = state;
  const updatedUsers = users.map(user => {
    if (user.userId == userId) {
      return { ...user, password: password };
    }
    return user;
  });
  return {
    ...state,
    users: updatedUsers,
  };
};

const handleUpdateUserProfile = (state, action) => {
  const { updatedUser, userId } = action.payload;
  const { users } = state;
  const updatedUsers = users.map(user => {
    if (user.userId == userId) {
      user = updatedUser;
    }
    return user;
  });
  return {
    ...state,
    users: updatedUsers,
  };
};
