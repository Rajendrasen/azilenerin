export const UPDATE_PASSWORD = 'EditUserProfile/UPDATE_PASSWORD';
export const UPDATE_USER_PROFILE = 'EditUserProfile/UPDATE_USER_PROFILE';

export const createUpdatePasswordAction = (userId, password) => {
  return {
    type: UPDATE_PASSWORD,
    payload: {
      userId,
      password,
    },
  };
};

export const createUpdateUserProfileAction = (userId, updatedUser) => {
  return {
    type: UPDATE_USER_PROFILE,
    payload: {
      userId,
      updatedUser,
    },
  };
};
