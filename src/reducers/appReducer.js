import {App} from './actions';

const initialState = {
  appState: null,
  heartbeat: null,
  error: null,
  isLoading: true,
  route: 'Login',
  device_id: null,
  device_token: null,
  voip_token: null,
  device_type: null,
  lastNotification: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case App.actionTypes.SET_APP_STATE:
      return {...state, appState: action.payload};
    case App.actionTypes.SET_ERROR_MSG:
      return {...state, error: action.payload};
    case App.actionTypes.SET_IS_LOADING:
      return {...state, isLoading: action.payload};
    case App.actionTypes.SET_ROUTE:
      return {...state, route: action.payload};
    case App.actionTypes.SET_DEVICE_ID:
      return {...state, device_id: action.payload};
    case App.actionTypes.SET_DEVICE_TOKEN:
      return {...state, device_token: action.payload};
    case App.actionTypes.SET_VOIP_TOKEN:
      return {...state, voip_token: action.payload};
    case App.actionTypes.SET_LAST_NOTIFICATION:
      return {...state, lastNotification: action.payload};
    case App.actionTypes.SET_DEVICE_TYPE:
      return {...state, device_type: action.payload};
    case App.actionTypes.APP_HEARTBEAT_SUCCESS:
      return {...state, heartbeat: action.payload};
    case App.actionTypes.APP_HEARTBEAT_FAIL: {
      return {...state, heartbeat: {
        ...state.heartbeat,
        error: action.error
      }};
    }

    default:
      return state;
  }
}
