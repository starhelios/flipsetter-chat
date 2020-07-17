import config from '../../config';

/*
 * action types
 */
const actionTypes = {
  SET_USERNAME: 'SET_USERNAME',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
  SET_REFRESH_TOKEN: 'SET_REFRESH_TOKEN',
  SET_EXPIRY: 'SET_EXPIRY',
  SET_IS_LOGGED_IN: 'SET_IS_LOGGED_IN',
  SET_ERROR_MSG: 'SET_ERROR_MSG',
  LOGIN: 'LOGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
};

/*
 * ACTION CREATORS
 */
function setUsername(username) {
  return {type: actionTypes.SET_USERNAME, payload: username};
}
function setPassword(password) {
  return {type: actionTypes.SET_PASSWORD, payload: password};
}
function setAccessToken(accessToken) {
  return {type: actionTypes.SET_ACCESS_TOKEN, payload: accessToken};
}
function setRefreshToken(refreshToken) {
  return {type: actionTypes.SET_REFRESH_TOKEN, payload: refreshToken};
}
function setExpiry(expiry) {
  return {type: actionTypes.SET_EXPIRY, payload: expiry};
}
function setIsLoggedIn(status) {
  return {type: actionTypes.SET_IS_LOGGED_IN, payload: status};
}
function setErrorMsg(msg) {
  return {type: actionTypes.SET_ERROR_MSG, payload: msg};
}
function login(email, pass, device_id, device_os, device_name, device_token) {
  return {
    type: actionTypes.LOGIN,
    payload: {
      request: {
        url: `${
          config.env === 'dev'
            ? `https://${config.dev.uri}/`
            : `https://${config.prod.uri}/`
        }api/v1/auth/login`,
        data: {
          email: email,
          password: pass,
          client_secret:
            config.env === 'dev'
              ? config.dev.client_secret
              : config.prod.client_secret,
          device_id: device_id,
          device_os: device_os,
          device_token: device_token,
          device_name: device_name,
          // voip_token: 'voip_token',
        },
        method: 'POST',
      },
    },
  };
}

export default {
  actionTypes,
  setUsername,
  setPassword,
  setAccessToken,
  setRefreshToken,
  setExpiry,
  setIsLoggedIn,
  setErrorMsg,
  login,
};
