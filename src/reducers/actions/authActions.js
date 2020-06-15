import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    SET_USERNAME:"SET_USERNAME",
    SET_PASSWORD:"SET_PASSWORD",
    SET_ACCESS_TOKEN:"SET_ACCESS_TOKEN",
    SET_REFRESH_TOKEN:"SET_REFRESH_TOKEN",
    SET_EXPIRY:"SET_EXPIRY",
    SET_IS_LOGGED_IN:"SET_IS_LOGGED_IN",
    SET_ERROR_MSG: "SET_ERROR_MSG",
    LOGIN:"LOGIN",
    LOGIN_SUCCESS:"LOGIN_SUCCESS",
    LOGIN_FAIL:"LOGIN_FAIL",

}

/*
 * ACTION CREATORS
 */
function setUsername(username){
    return {type: actionTypes.SET_USERNAME, payload:username}
}
function setPassword(password){
    return {type: actionTypes.SET_PASSWORD, payload:password}
}
function setAccessToken(accessToken){
    return {type: actionTypes.SET_ACCESS_TOKEN, payload:accessToken}
}
function setRefreshToken(refreshToken){
    return {type: actionTypes.SET_REFRESH_TOKEN, payload:refreshToken}
}
function setExpiry(expiry){
    return {type: actionTypes.SET_EXPIRY, payload:expiry}
}
function setIsLoggedIn(status){
    return {type: actionTypes.SET_IS_LOGGED_IN, payload:status}
}
function setErrorMsg(msg){
    return {type: actionTypes.SET_ERROR_MSG, payload:msg}
}
function login(email, pass){
    return {
        type: actionTypes.LOGIN,
        payload: {
            request: {
                url: 'oauth/token',
                data: {
                    grant_type: 'password',
                    client_id: config.dev.client_id,
                    client_secret: config.dev.client_secret,
                    username: email,
                    password: pass,
                    scope: '',
                },
                method: 'POST',
            }
        }
    }
}
export default {
    actionTypes, setUsername, setPassword, setAccessToken, setRefreshToken, setExpiry, setIsLoggedIn, setErrorMsg, login
};