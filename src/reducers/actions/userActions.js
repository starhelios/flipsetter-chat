import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    SET_USER_ID: "SET_USER_ID",
    SET_FIRST_NAME:"SET_FIRST_NAME",
    SET_LAST_NAME:"SET_LAST_NAME",
    SET_EMAIL:"SET_EMAIL",
    SET_AVATAR:"SET_AVATAR",
    GET_USER:"GET_USER",
    GET_USER_SUCCESS:"GET_USER_SUCCESS",
}

/*
 * ACTION CREATORS
 */
export function setUserID(id){
    return {type: actionTypes.SET_USER_ID, payload:id}
}
export function setFirstName(first){
    return {type: actionTypes.SET_FIRST_NAME, payload:first}
}
export function setLastName(last){
    return {type: actionTypes.SET_LAST_NAME, payload:last}
}
export function setEmail(email){
    return {type: actionTypes.SET_EMAIL, payload:email}
}
export function setAvatar(avatar){
    return {type: actionTypes.SET_AVATAR, payload:avatar}
}
export function getUser(){
    return {
        type: actionTypes.GET_USER,
        payload: {
            request: {
                method: 'GET',
                url: `${config.api.prefix}/${config.api.user.get.info}`,
                headers:{
                    Authorization: null,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
    }
}

export default {
    actionTypes, setUserID, setFirstName, setLastName, setEmail, getUser
};