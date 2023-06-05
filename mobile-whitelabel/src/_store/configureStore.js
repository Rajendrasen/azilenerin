
import { createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { NODE_ENV } from './config';
import reducer from './reducer';
import Reactotron from './ReactotronConfig';
import AsyncStorage from '@react-native-community/async-storage';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const configureStore = () => {
    let store = createStore(
        persistedReducer, compose(Reactotron.createEnhancer())
        // compose(
        //     NODE_ENV === 'development' &&
        //     window.__REDUX_DEVTOOLS_EXTENSION__ &&
        //     window.__REDUX_DEVTOOLS_EXTENSION__()
        // )
    );
    let persistor = persistStore(store);
    return { store, persistor };
};
