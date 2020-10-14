import { Auth } from './actions';

const initialState = {
    username: null,
    password: null,
    accessToken: null,
    refreshToken: null,
    expiry: null,
    isLoggedIn: false,
    errorMsg: null,
}


export default function(state=initialState, action){
    // alert(JSON.stringify(action.payload))
    switch(action.type){
        case Auth.actionTypes.SET_USERNAME:
            return {...state, username: action.payload};
        case Auth.actionTypes.SET_PASSWORD:
            return {...state, password: action.payload};
        case Auth.actionTypes.SET_ACCESS_TOKEN:
            return {...state, accessToken: action.payload};
        case Auth.actionTypes.SET_REFRESH_TOKEN:
            return {...state, refreshToken: action.payload};
        case Auth.actionTypes.SET_EXPIRY:
            return {...state, expiry: action.payload};
        case Auth.actionTypes.SET_IS_LOGGED_IN:
            return {...state, isLoggedIn: action.payload};
        case Auth.actionTypes.SET_ERROR_MSG:
            return {...state, errorMsg: action.payload};


        case Auth.actionTypes.LOGIN_SUCCESS:
            let data = action.payload.data;
            return {...state,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiry: Date.now() + data.expires_in,
                isLoggedIn: true,
                errorMsg: null,
            };
        case Auth.actionTypes.LOGIN_FAIL:
            return {...state, isLoggedIn: 2, errorMsg: "Please check your username and password"};

        case Auth.actionTypes.FORGOT_SUCCESS:
                return {...state, response: 'true'};
        case Auth.actionTypes.FORGOT_FAIL:
                return {...state, error: action.error};
       
        case Auth.actionTypes.REGISTER_SUCCESS:
            return {...state, signIn: 'true'};

        case Auth.actionTypes.REGISTER_FAIL:
            return {...state, error: action.error};

            default:
            return state;
    }
}