import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    SET_CALL_ID:"SET_CALL_ID",
    SET_CALL_STATUS:"SET_CALL_STATUS",
    SET_CALL_TYPE:"SET_CALL_TYPE",
    SET_CALL_ROOM:"SET_CALL_ROOM",
    SET_CALL_ROOM_PIN:"SET_CALL_ROOM_PIN",
    SET_CALLER_NAME:"SET_CALLER_NAME",
    SET_CALL_THREAD_ID:"SET_CALL_THREAD_ID",
    JOIN_CALL:"JOIN_CALL",
    START_AUDIO_CALL:"START_AUDIO_CALL",
    START_VIDEO_CALL:"START_VIDEO_CALL",
    START_WHITEBOARD:"START_WHITEBOARD",
};

/*
 * ACTION CREATORS
 */
function setCallId(uuid){
    return {type: actionTypes.SET_CALL_ID, payload:uuid}
}
function setCallStatus(status){
    return {type: actionTypes.SET_CALL_STATUS, payload:status}
}
function setCallType(type){
    return {type: actionTypes.SET_CALL_TYPE, payload:type}
}
function setCallRoom(room){
    return {type: actionTypes.SET_CALL_ROOM, payload:room}
}
function setCallRoomPin(pin){
    return {type: actionTypes.SET_CALL_ROOM_PIN, payload:pin}
}
function setCallerName(name){
    return {type: actionTypes.SET_CALLER_NAME, payload:name}
}
function setCallThreadId(thread){
    return {type: actionTypes.SET_CALL_THREAD_ID, payload:thread}
}
function joinCall(){
    return {
        type: actionTypes.JOIN_CALL,
        payload: {
            request: {
                method: 'POST',
                // url: `${config.prefix}/thread/${id}/message`,
                url: `${config.api.prefix}/${config.api.messenger.post.saveThread(id)}`,
                data: {
                    type: "join_call",
                },
                headers:{
                    Authorization: null,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
    }
}

function startAudioCall(){
    return {
        type: actionTypes.START_AUDIO_CALL,
        payload: {
            request: {
                method: 'POST',
                // url: `${config.prefix}/thread/${id}/message`,
                url: `${config.api.prefix}/${config.api.messenger.post.saveThread(id)}`,
                data: {
                    type: "initiate_call",
                },
                headers:{
                    Authorization: null,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
    }
}

function startVideoCall(){
    return {
        type: actionTypes.START_VIDEO_CALL,
        payload: {
            request: {
                method: 'POST',
                // url: `${config.prefix}/thread/${id}/message`,
                url: `${config.api.prefix}/${config.api.messenger.post.saveThread(id)}`,
                data: {
                    type: "initiate_call",
                },
                headers:{
                    Authorization: null,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
    }
}
function startWhiteboard(){
    return {
        type: actionTypes.START_WHITEBOARD,
        payload: {
            request: {
                method: 'POST',
                // url: `${config.prefix}/thread/${id}/message`,
                url: `${config.api.prefix}/${config.api.messenger.post.saveThread(id)}`,
                data: {
                    type: "initiate_call",
                },
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
    actionTypes, setCallId, setCallStatus, setCallType, setCallRoom, setCallRoomPin, setCallerName, setCallThreadId, joinCall, startAudioCall, startVideoCall, startWhiteboard,
};