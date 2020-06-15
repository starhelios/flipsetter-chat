import {App} from './actions';

const initialState = {
    appState: null,
    error: null,
    isLoading: true,
    route: 'Login',
    device_id: null,
    fcm_token: null,
    voip_token: null,
    lastNotification: null,
}


export default function(state=initialState, action){

    switch(action.type){
        case App.actionTypes.SET_APP_STATE:
            return {...state, appState: action.payload}
        case App.actionTypes.SET_ERROR_MSG:
            return {...state, error: action.payload};
        case App.actionTypes.SET_IS_LOADING:
            return {...state, isLoading: action.payload};
        case App.actionTypes.SET_ROUTE:
            return {...state, route: action.payload};
        case App.actionTypes.SET_DEVICE_ID:
            return {...state, device_id: action.payload};
        case App.actionTypes.SET_FCM_TOKEN:
            return {...state, fcm_token: action.payload};
        case App.actionTypes.SET_VOIP_TOKEN:
            return {...state, voip_token: action.payload};
        case App.actionTypes.SET_LAST_NOTIFICATION:
            return {...state, lastNotification: action.payload};
        default:
            return state;
    }

}