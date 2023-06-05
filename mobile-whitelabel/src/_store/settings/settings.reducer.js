import { state as initialState } from './settings.state';
import { FETCH_COMPANY, UPDATE_SETTINGS, DELETE_DEPARTMENT } from './settings.actions';

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMPANY:
      return handleFetchCompany(state, action);
    case UPDATE_SETTINGS:
      return handleUpdateSettings(state, action);
    case DELETE_DEPARTMENT:
      return handleDeleteDepartment(state, action);
    default:
      return state;
  }
};

const handleFetchCompany = (state, action) => {
  const { companyId } = action.payload;
  const { companies } = state;

  const userCompany = companies.find(company => company.id === companyId);
  return {
    ...state,
    company: userCompany,
  };
};

const handleUpdateSettings = (state, action) => {
  const { updatedSettings } = action.payload;
  return {
    ...state,
    company: updatedSettings,
  };
};

const handleDeleteDepartment = (state, action) => {
  const { deletedDepartment } = action.payload;
  return {
    ...state,
    company: {
      ...state.company,
      departments: [
        ...state.company.departments.filter(department => department !== deletedDepartment),
      ],
    },
  };
};
