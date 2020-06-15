import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    GET_MESSAGES:"GET_MESSAGES",
    GET_MESSAGES_SUCCESS:"GET_MESSAGES_SUCCESS",
    SEND_MESSAGE: "SEND_MESSAGE",
    SEND_MESSAGE_SUCCESS: "SEND_MESSAGE_SUCCESS",
    ADD_MESSAGE:"ADD_MESSAGE",
    ADD_MESSAGES:"ADD_MESSAGES",
    MARK_READ: "MARK_READ",
    MARK_READ_SUCCESS: "MARK_READ_SUCCESS",
    CLEAR_MESSAGES:"CLEAR_MESSAGES",
};

/*
 * ACTION CREATORS
 */

export function getMessages(id){
    return {
        type: actionTypes.GET_MESSAGES,
        payload: {
            request: {
                method: 'GET',
                url: `${config.prefix}/fetch/${id}/initiate_thread`,
                headers:{
                    Authorization: null,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
    }
}
export function sendMessage(id, message){
    return {
        type: actionTypes.SEND_MESSAGE,
        payload: {
            request: {
                method: 'POST',
                // url: `${config.prefix}/thread/${id}/message`,
                url: `${config.api.prefix}/${config.api.messenger.post.saveThread(id)}`,
                data: {
                    type: "store_message",
                    temp_id: message._id,
                    message: message.text,
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
export function markRead(id){
    return{
        type: actionTypes.MARK_READ,
        payload: {
            request: {
                method: "GET",
                url: `${config.api.prefix}/${config.api.messenger.get.getMessages(id, "mark_read")}`,
            }
        }
    }
}
export function addMessage(thread, message){
    return{ type: actionTypes.ADD_MESSAGE, payload:{thread, message}}
}
export function addMessages(thread, messages){
    return{ type: actionTypes.ADD_MESSAGES, payload:{thread, messages}}
}
function clearMessages(){
    return {type: actionTypes.CLEAR_MESSAGES}
}


export default {
    actionTypes, getMessages, sendMessage, markRead, addMessage, addMessages, clearMessages
};