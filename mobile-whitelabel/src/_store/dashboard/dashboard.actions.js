export const SET_ACTIVE_JOBS = 'SET_ACTIVE_JOBS';
export const GET_BUSINESS_NETWORK_DATA = 'GET_BUSINESS_NETWORK_DATA';
export const GET_REFERRALS = 'GET_REFERRALS';
export const GET_DEPARTMENTS = 'GET_DEPARTMENTS';
export const GET_EMPLOYEES = 'GET_EMPLOYEES';

export const createSetActiveJobsAction = activeJobs => ({
  type: SET_ACTIVE_JOBS,
  payload: {
    activeJobs,
  },
});

export const createGetBusinessNetworkAction = businessNetwork => ({
  type: GET_BUSINESS_NETWORK_DATA,
  payload: {
    businessNetwork,
  },
});

export const createGetDepartmentsAction = departments => ({
  type: GET_DEPARTMENTS,
  payload: {
    departments,
  },
});

export const createGetReferralsAction = referrals => ({
  type: GET_REFERRALS,
  payload: {
    referrals,
  },
});

export const createGetEmployeesAction = employees => ({
  type: GET_EMPLOYEES,
  payload: {
    employees,
  },
});
