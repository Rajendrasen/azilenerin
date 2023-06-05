import { state as initialState } from './user.state';
import {
    SET_CURRENT_USER,
    ADD_SUPER_USER,
    ADD_COMPANY,
    SIGN_OUT,
    UPDATE_USER_COMPANY,
    SET_CURRENCY_RATE,
    NEW_NOTIFICATION,
    UPDATE_CURRENT_USER,

} from './user.actions';

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return handleSetCurrentUserAction(state, action);
        case ADD_SUPER_USER:
            return handleAddSuperUserAction(state, action);
        case ADD_COMPANY:
            return handleAddCompanyAction(state, action);
        case UPDATE_USER_COMPANY:

            return handleUpdateUserCompany(state, action);
        case UPDATE_CURRENT_USER:
            return handleUpdateCurrentUser(state, action);
        case SET_CURRENCY_RATE:
            return handleSetCurrencyData(state, action);
        case SIGN_OUT:
            return handleSignOut(state, action);
        case NEW_NOTIFICATION:
            return handleNewNotificationAction(state, action);
        default:
            return state;
    }
};

const handleNewNotificationAction = (state, action) => {
    return {
        ...state,
        newNotification: action.payload.notification,
    };
};

const handleSetCurrentUserAction = (state, action) => {
    // const {currentUser} = action.payload;

    return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload.currentUser },
    };
};

const handleSetCurrencyData = (state, action) => {
    const { currencyRate, currencySymbol } = action.payload;
    return {
        ...state,
        currencyRate,
        currencySymbol,
    };
};
const handleUpdateCurrentUser = (state, action) => {
    const {
        location,
        currency,
        avatar,
        dateFormat,
        defaultDistance,
        openToNewRole,
    } = action.payload.user;
    const { currentUser } = state;
    const updatedUser = {
        ...currentUser,
        location: location,
        currency: currency,
        avatar: avatar,
        dateFormat: dateFormat,
        defaultDistance: defaultDistance,
        openToNewRole: openToNewRole,
    };
    return {
        ...state,
        currentUser: updatedUser,
    };
};

const handleAddSuperUserAction = (state, { payload }) => {
    let newUser = {};
    Object.keys(payload).forEach((key) => {
        newUser[key] = payload[key];
    });

    return {
        ...state,
        superUser: { ...state.superUser, ...newUser },
    };
};

const handleAddCompanyAction = (state, { payload }) => {
    let newCompany = {};
    Object.keys(payload).forEach((key) => {
        newCompany[key] = payload[key];
    });

    return {
        ...state,
        company: { ...state.company, ...newCompany },
    };
};

const handleSignOut = (state) => {
    return {
        ...state,
        currentUser: {},
    };
};

const handleUpdateUserCompany = (state, action) => {
    const { company } = action.payload;
    const { currentUser } = state;
    const updatedUser = { ...currentUser, company: company };
    return {
        ...state,
        currentUser: updatedUser,
    };
};
