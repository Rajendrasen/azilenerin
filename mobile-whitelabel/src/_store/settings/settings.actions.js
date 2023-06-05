export const FETCH_COMPANY = 'settings/FETCH_COMPANY';
export const UPDATE_SETTINGS = 'settings/UPDATE_SETTINGS';
export const DELETE_DEPARTMENT = 'settings/DELETE_DEPARTMENT';

export const createFetchCompanyAction = companyId => {
  return {
    type: FETCH_COMPANY,
    payload: {
      companyId,
    },
  };
};

export const createUpdateSettingsAction = updatedSettings => {
  return {
    type: UPDATE_SETTINGS,
    payload: {
      updatedSettings,
    },
  };
};

export const createDeleteDepartmentAction = deletedDepartment => {
  return {
    type: DELETE_DEPARTMENT,
    payload: {
      deletedDepartment,
    },
  };
};
