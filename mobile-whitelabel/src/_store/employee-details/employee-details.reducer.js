import { state as initialState } from '../employee-details/employeeDetails.state';
import {
  TOGGLE_DISABLED,
  UPDATE_PASSWORD,
  UPDATE_ROLE,
  SET_PERMISSIONS,
  FETCH_USER,
} from './employee-details.actions';

export const employeeDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return handleFetchUser(state, action);
    case TOGGLE_DISABLED:
      return handleToggleDisabled(state, action);
    case UPDATE_PASSWORD:
      return handleUpdatePassword(state, action);
    case UPDATE_ROLE:
      return handleUpdateRole(state, action);
    case SET_PERMISSIONS:
      return handleSetPermissions(state, action);
    default:
      return state;
  }
};

const handleFetchUser = (state, action) => {
  const { user } = action.payload;
  return {
    ...state,
    selectedUser: user,
  };
};

const handleToggleDisabled = (state, action) => {
  const { payload } = action;
  const { userId, disabled } = payload;
  const { users } = state;
  const updatedUsers = users.map(user => {
    if (user.userId == userId) {
      return { ...user, disabled: !disabled };
    }
    return user;
  });
  return {
    ...state,
    users: updatedUsers,
  };
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

const handleUpdateRole = (state, action) => {
  const { payload } = action;
  const { userId, role } = payload;
  const { users } = state;
  const updatedUsers = users.map(user => {
    if (user.userId == userId) {
      return { ...user, role: role };
    }
    return user;
  });
  return {
    ...state,
    users: updatedUsers,
  };
};

const handleSetPermissions = (state, action) => {
  const { payload } = action;
  const { userId, permissions } = payload;
  const { users } = state;
  const updatedUsers = users.map(user => {
    if (user.userId == userId) {
      return { ...user, permissions: permissions };
    }
    return user;
  });
  return {
    ...state,
    users: updatedUsers,
  };
};
