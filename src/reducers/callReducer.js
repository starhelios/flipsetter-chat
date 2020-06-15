import {Call} from './actions';

const initialState = {
    id: null,
    status: 0,
    type: 0,
    roomId: null,
    roomPin: null,
    callerName: null,
    threadId: null,

}


export default function(state=initialState, action){

    switch(action.type){
        case Call.actionTypes.SET_CALL_ID:
            return {...state, id: action.payload};
        case Call.actionTypes.SET_CALL_STATUS:
            return {...state, status: action.payload};
        case Call.actionTypes.SET_CALL_TYPE:
            return {...state, type: action.payload};
        case Call.actionTypes.SET_CALL_ROOM:
            return {...state, roomId: action.payload};
        case Call.actionTypes.SET_CALL_ROOM_PIN:
            return {...state, roomPin: action.payload};
        case Call.actionTypes.SET_CALLER_NAME:
            return {...state, callerName: action.payload};
        case Call.actionTypes.SET_CALL_THREAD_ID:
            return {...state, threadId: action.payload};
        default:
            return state;
    }

}