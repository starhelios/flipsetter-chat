import config from "../../config";
import DeviceInfo from 'react-native-device-info';
import { Platform } from "react-native";
import Constants from "../../components/Constants";
/*
 * action types
 */
const actionTypes = {
    SET_APP_STATE: "SET_APP_STATE",
    SET_ERROR_MSG: "SET_ERROR_MSG",
    SET_IS_LOADING: "SET_IS_LOADING",
    SET_ROUTE: "SET_ROUTE",
    SET_DEVICE_ID: "SET_DEVICE_ID",
    SET_DEVICE_TOKEN: "SET_DEVICE_TOKEN",
    SET_VOIP_TOKEN: "SET_VOIP_TOKEN",
    APP_HEARTBEAT: "APP_HEARTBEAT",
    APP_HEARTBEAT_SUCCESS:"APP_HEARTBEAT_SUCCESS",
    JOIN_DEVICE_TO_SITE:"JOIN_DEVICE_TO_SITE",
    REGISTER_DEVICE_TO_ACCOUNT: "REGISTER_DEVICE_TO_ACCOUNT",
    SET_LAST_NOTIFICATION: "SET_LAST_NOTIFICATION",
    SET_DEVICE_TYPE: "SET_DEVICE_TYPE",
};

/*
 * ACTION CREATORS
 */
function setAppState(state){
    return {type: actionTypes.SET_APP_STATE, payload:state}
}
function setErrorMsg(error){
    return {type: actionTypes.SET_ERROR_MSG, payload:error}
}
function setIsLoading(status){
    return {type: actionTypes.SET_IS_LOADING, payload:status}
}
function setRoute(route){
    return {type: actionTypes.SET_ROUTE, payload:route}
}
function setDeviceID(id){
    return {type: actionTypes.SET_DEVICE_ID, payload:id}
}
function setDeviceToken(token){
    return {type: actionTypes.SET_DEVICE_TOKEN, payload:token}
}
function setDeviceType(device_type){
    return {type: actionTypes.SET_DEVICE_TYPE, payload: device_type}
}
function setLastNotification(id){
    return {type: actionTypes.SET_LAST_NOTIFICATION, payload: id}
}
//IOS ONLY!!!
function setVOIPToken(token){
    return {type: actionTypes.SET_VOIP_TOKEN, payload:token}
}
function appHeartbeat(){
    return {
        type: actionTypes.APP_HEARTBEAT,
        payload: {
            request: {
                url: `${config.api.client.get.heartbeat}`,
                method: 'GET',
            }
        }
    }
}
function joinDevice(device_id, device_token, voip_token){

    DeviceInfo.getDeviceName().then(deviceName => {
        Constants.DEVICE_NAME = deviceName;
      });
    return {
        type: actionTypes.JOIN_DEVICE_TO_SITE,
        payload: {
            request: {
                url: `${config.api.client.post.deviceJoin}`,
                data: {
                    "device_id": device_id,
                    // "device_type": (Platform.OS === 'android') ? 0 : 1,
                    "device_token": device_token,
                    "voip_token": voip_token,
                    "device_os":Platform.OS === 'ios'?'ios':'android',
                    "device_name":Constants.DEVICE_NAME
                },
                method: 'POST',
            }
        }
    }
}
function registerDevice(device_id, fcm_token, voip_token){
    // let deviceName = '';

    DeviceInfo.getDeviceName().then(deviceName => {
        Constants.DEVICE_NAME = deviceName;
      });
    return {
        type: actionTypes.REGISTER_DEVICE_TO_ACCOUNT,
        payload: {
            request: {
                url: `${config.api.client.post.deviceRegister}`,
                data: {
                    "device_id": device_id,
                    "device_token": fcm_token,
                    "voip_token": voip_token,
                    "device_os":Platform.OS === 'ios'?'ios':'android',
                    "device_name":Constants.DEVICE_NAME
                },
                method: 'POST',
            }
        }
    }
}

export default {
    actionTypes, setAppState, setErrorMsg, setIsLoading, setRoute, setDeviceID, setDeviceToken, setDeviceType, setVOIPToken, setLastNotification, joinDevice, registerDevice, appHeartbeat
};