import config from "../../config";
import DeviceInfo from 'react-native-device-info';
import React, { Component } from 'react';
import {
    Platform
} from 'react-native';
import Constants from "../../components/Constants";


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
    REGISTER: "REGISTER",
    REGISTER_SUCCESS: "REGISTER_SUCCESS",
    REGISTER_FAIL: "REGISTER_FAIL",
    FORGOT: "FORGOT",
    FORGOT_SUCCESS: "FORGOT_SUCCESS",
    FORGOT_FAIL: "FORGOT_FAIL",
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


function login(email, pass, fcm_token, voip_token) {
    //  DeviceInfo.getDeviceName().then(deviceName => {
    //    Constants.DEVICE_NAME = deviceName;
    // });
    return {
        type: actionTypes.LOGIN,
        payload: {
            request: {
                // url: 'https://tippinweb.com/api/v1/auth/login',
                   url: `${(config.env === "dev") ? `https://${config.dev.uri}`:`https://${config.prod.uri}`}${config.prefix}/auth/login`,
                data: {
                    // grant_type: 'password',
                    // client_id: (config.env === "dev") ? config.dev.client_id : config.prod.client_id,
                    // client_secret: (config.env === "dev") ? config.dev.client_secret : config.prod.client_secret,
                    // username: email,
                    // password: pass,
                    // email:email,
                    // scope: '', 
                    email: email,
                    password: pass,
                    client_secret: (config.env === "dev") ? config.dev.client_secret : config.prod.client_secret,
                    device_id: DeviceInfo.getUniqueId(),
                    device_os: Platform.OS === 'ios' ? 'ios' : 'android',
                    device_token: fcm_token,
                    device_name: Constants.DEVICE_NAME,
                    voip_token: voip_token
                },
                method: 'POST',
            }
        }
    }
}


function register(first, last, email, pass1, pass2) {

    return {
        type: actionTypes.REGISTER,
        payload: {
            request: {
                url: `${(config.env === "dev") ? `https://${config.dev.uri}`:`https://${config.prod.uri}`}${config.prefix}/auth/register`,

                // url: 'https://tippinweb.com/api/v1/auth/register',
                data: {
                    client_secret: (config.env === "dev") ? config.dev.client_secret : config.prod.client_secret,
                    first: first,
                    last: last,
                    email: email,
                    password: pass1,
                    password_confirmation: pass2,
                },
                method: 'POST',
            }
        }
    }
}


function forgotPassword(email) {
    // alert(email)
    return {
        type: actionTypes.FORGOT,
        payload: {
            request: {
                // url: 'https://tippinweb.com/api/v1/auth/password/email',
                   url: `${(config.env === "dev") ? `https://${config.dev.uri}`:`https://${config.prod.uri}`}${config.prefix}/auth/password/email`,
                data: {
                    email: email,
                    client_secret: (config.env === "dev") ? config.dev.client_secret : config.prod.client_secret,
                },
                method: 'POST',
            }
        }
    }
}

export default {
    actionTypes, setUsername, setPassword, forgotPassword, setAccessToken, setRefreshToken, setExpiry, setIsLoggedIn, setErrorMsg, login, register
};