import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    GET_THREADS:"GET_THREADS",
    GET_THREADS_SUCCESS:"GET_THREADS_SUCCESS",
    GET_MESSAGES:"GET_MESSAGES",
    SET_MESSAGES:"SET_MESSAGES",
    SET_ACTIVE_THREAD: "SET_ACTIVE_THREAD",
    STORE_THREADS:"STORE_THREADS",
    SEND_MESSAGE: "SEND_MESSAGE",
    UPDATE_THREAD: "UPDATE_THREAD",
    CLEAR_THREADS:"CLEAR_THREADS",
};

/*
 * ACTION CREATORS
 */

function updateThread(thread){
    return {type: actionTypes.UPDATE_THREAD, payload: thread}
}

function storeThreads(threads){
    return {type: actionTypes.STORE_THREADS, payload: threads}
}

function setActiveThread(id){
    return {type: actionTypes.SET_ACTIVE_THREAD, payload:id}
}

function getThreads(){
    return {
        type: actionTypes.GET_THREADS,
        payload: {
            request: {
                method: 'GET',
                // url: `${config.prefix}/threads`,
                url: `${config.api.prefix}/${config.api.messenger.get.type('threads')}`,
                headers:{
                    Authorization: null,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
    }
}

function clearThreads(){
    return {type: actionTypes.CLEAR_THREADS}
}

export default {
    actionTypes, getThreads, storeThreads, setActiveThread, updateThread, clearThreads,
};