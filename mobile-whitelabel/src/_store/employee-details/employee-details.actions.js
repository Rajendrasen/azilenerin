export const TOGGLE_DISABLED = 'EmployeeDetails/TOGGLE_DISABLED';
export const UPDATE_PASSWORD = 'EmployeeDetails/UPDATE_PASSWORD';
export const UPDATE_ROLE = 'EmployeeDetails/UPDATE_ROLE';
export const SET_PERMISSIONS = 'EmployeeDetails/SET_PERMISSIONS';
export const FETCH_USER = 'EmployeeDetails/FETCH_USER';

export const createFetchUserAction = user => {
  return {
    type: FETCH_USER,
    payload: {
      user,
    },
  };
};

export const createToggleDisabledAction = (userId, disabled) => {
  return {
    type: TOGGLE_DISABLED,
    payload: {
      userId,
      disabled,
    },
  };
};

export const createUpdatePasswordAction = (userId, password) => {
  return {
    type: UPDATE_PASSWORD,
    payload: {
      userId,
      password,
    },
  };
};

export const createUpdateRoleAction = (userId, role) => {
  return {
    type: UPDATE_ROLE,
    payload: {
      userId,
      role,
    },
  };
};

export const createSetPermissionsAction = (userId, permissions) => {
  return {
    type: SET_PERMISSIONS,
    payload: {
      userId,
      permissions,
    },
  };
};
