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
        case Call.actionTypes.START_VIDEO_CALL_SUCCESS:
            return {...state,
                id: action.payload.data.call_id,
                type: action.payload.data.call_type,
                roomId: action.payload.data.room_id,
                roomPin: action.payload.data.room_pin,
                threadId: action.payload.data.thread_id,
            }
        case Call.actionTypes.START_WHITEBOARD_SUCCESS:
            return {...state,
                id: action.payload.data.call_id,
                type: action.payload.data.call_type,
                roomId: action.payload.data.room_id,
                roomPin: action.payload.data.room_pin,
                threadId: action.payload.data.thread_id,
            }
        default:
            return state;
    }

}