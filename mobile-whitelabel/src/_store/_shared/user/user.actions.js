export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const ADD_SUPER_USER = 'ADD_SUPER_USER';
export const ADD_COMPANY = 'ADD_COMPANY';
export const SIGN_OUT = 'SIGN_OUT';
export const UPDATE_USER_COMPANY = 'UPDATE_USER_COMPANY';
export const SET_USER_NAVIGATE = 'SET_USER_NAVIGATE';
export const SET_CURRENCY_RATE = 'SET_CURRENCY_RATE';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

export const setNewNotificationAction = (notification) => {
    return {
        type: NEW_NOTIFICATION,
        payload: {
            notification,
        },
    };
};
export const createSetCurrentUserAction = (currentUser) => ({
    type: SET_CURRENT_USER,
    payload: {
        currentUser,
    },
});

export const setCurrencyData = (currencyRate, currencySymbol) => ({
    type: SET_CURRENCY_RATE,
    payload: {
        currencyRate,
        currencySymbol,
    },
});
export const updateCurrentUser = (user) => ({
    type: UPDATE_CURRENT_USER,
    payload: {
        user,
    },
});

// export const setUserAndNavigate = user => ({
//   type: SET_USER_NAVIGATE,
//   payload: {
//     user
//   }
// })
export const addSuperUserAction = (superUser) => ({
    type: ADD_SUPER_USER,
    payload: {
        superUser,
    },
});

export const addCompanyAction = (company) => ({
    type: ADD_COMPANY,
    payload: {
        company,
    },
});

export const updateUserCompany = (company) => ({
    type: UPDATE_USER_COMPANY,
    payload: {
        company,
    },
});

export const signOut = (token) => {
    return {
        type: SIGN_OUT,
        payload: {
            token,
        },
    };
};
