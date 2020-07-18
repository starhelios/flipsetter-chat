import config from "../../config";
import DeviceInfo from 'react-native-device-info';
import React, { Component } from 'react';
import {
    Platform
} from 'react-native';
/*
 * action types
 */

const actionTypes = {
    SET_USERNAME: "SET_USERNAME",
    SET_PASSWORD: "SET_PASSWORD",
    SET_ACCESS_TOKEN: "SET_ACCESS_TOKEN",
    SET_REFRESH_TOKEN: "SET_REFRESH_TOKEN",
    SET_EXPIRY: "SET_EXPIRY",
    SET_IS_LOGGED_IN: "SET_IS_LOGGED_IN",
    SET_ERROR_MSG: "SET_ERROR_MSG",
    LOGIN: "LOGIN",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL",

}

/*
 * ACTION CREATORS
 */
function setUsername(username) {
    return { type: actionTypes.SET_USERNAME, payload: username }
}
function setPassword(password) {
    return { type: actionTypes.SET_PASSWORD, payload: password }
}
function setAccessToken(accessToken) {
    return { type: actionTypes.SET_ACCESS_TOKEN, payload: accessToken }
}
function setRefreshToken(refreshToken) {
    return { type: actionTypes.SET_REFRESH_TOKEN, payload: refreshToken }
}
function setExpiry(expiry) {
    return { type: actionTypes.SET_EXPIRY, payload: expiry }
}
function setIsLoggedIn(status) {
    return { type: actionTypes.SET_IS_LOGGED_IN, payload: status }
}
function setErrorMsg(msg) {
    return { type: actionTypes.SET_ERROR_MSG, payload: msg }
}

function login(email, pass,fcm_token,voip_token) {
let deviceName = '';
    DeviceInfo.getDeviceName().then(deviceName => {
        deviceName = deviceName
      });

    return {
        type: actionTypes.LOGIN,
        payload: {
            request: {
<<<<<<< HEAD
                url: `${(config.env === "dev") ? `https://${config.dev.uri}/`:`https://${config.prod.uri}/`}oauth/token`,
                data: {
                    grant_type: 'password',
                    client_id: (config.env === "dev") ? config.dev.client_id : config.prod.client_id,
                    client_secret: (config.env === "dev") ? config.dev.client_secret : config.prod.client_secret,
                    username: email,
=======
                url: 'https://tippinweb.com/api/v1/auth/login',
                //    url: `${(config.env === "dev") ? `https://${config.dev.uri}/`:`https://${config.prod.uri}/`}oauth/token`,
                data: {
                    // grant_type: 'password',
                    // client_id: (config.env === "dev") ? config.dev.client_id : config.prod.client_id,
                    // client_secret: (config.env === "dev") ? config.dev.client_secret : config.prod.client_secret,
                    // username: email,
                    // password: pass,
                    // email:email,
                    // scope: '',
                    email: email,
>>>>>>> alex-dev
                    password: pass,
                    client_secret : '5UgakrxzfZGYlu5hlWWi6Pu6ScWl3ahZblmkhpFq',
                    device_id : DeviceInfo.getDeviceId(),
                    device_os : Platform.OS === 'ios'?'ios':'android',
                    device_token : 'fcm_token',
                    device_name : deviceName,
                    voip_token : voip_token 
                },
                method: 'POST',
            }
        }
    }
}
export default {
    actionTypes, setUsername, setPassword, setAccessToken, setRefreshToken, setExpiry, setIsLoggedIn, setErrorMsg, login
};