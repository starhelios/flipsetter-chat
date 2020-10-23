import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import thunk from 'redux-thunk';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {
  appReducer, authReducer, userReducer, threadsReducer, messagesReducer, searchReducer, friendsReducer, callReducer, whiteboardReducer,
} from './reducers';
import config from './config';

/** * Axios Client and Config *** */
const client = axios.create({
  baseURL: `https://${config.api.uri}`,
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const axiosMiddlewareConfig = {

  interceptors: {
    request: [
      function ({ getState, dispatch, getSourceAction }, req) {
        if (getState().auth.isLoggedIn && getState().auth.accessToken) {
          req.headers = {
            Authorization: `Bearer ${getState().auth.accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };
        }
        return req;
      },
    ],
  },
};

/** * Sensitive Storage Config ** */
const sensitiveStorage = createSensitiveStorage({
  keychainService: 'myKeychain',
  sharedPreferencesName: 'mySharedPrefs',
});

/** * Persist Configs ** */
export const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
};

const appPersistConfig = {
  key: 'app',
  storage: AsyncStorage,
  blacklist: ['heartbeat'],
};

const authPersistConfig = {
  key: 'auth',
  version: 0,
  storage: sensitiveStorage,
  blacklist: ['accessToken'],
};

const userPersistConfig = {
  key: 'user',
  version: 1,
  storage: AsyncStorage,
};

const friendsPersistConfig = {
  key: 'friends',
  storage: AsyncStorage,
};

const threadsPersistConfig = {
  key: 'threads',
  version: 4,
  storage: AsyncStorage,
};

const messagesPersistConfig = {
  key: 'messages',
  storage: AsyncStorage,
};

const searchPersistConfig = {
  key: 'search',
  storage: AsyncStorage,
};
const callPersistConfig = {
  key: 'call',
  storage: AsyncStorage,
};

/** * Root Reducer ** */
const combinedReducers = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  friends: persistReducer(friendsPersistConfig, friendsReducer),
  threads: persistReducer(threadsPersistConfig, threadsReducer),
  messages: persistReducer(messagesPersistConfig, messagesReducer),
  search: persistReducer(searchPersistConfig, searchReducer),
  call: persistReducer(callPersistConfig, callReducer),
  whiteboard: whiteboardReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }

  return combinedReducers(state, action)
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk, axiosMiddleware(client, axiosMiddlewareConfig))));
export const persistor = persistStore(store);

export default () => {
  if (module.hot) {
    module.hot.accept('./Store', () => {
      store.replaceReducer(
        persistReducer(rootPersistConfig, rootReducer),
      );
    });
  }

  return { store, persistor };
};
