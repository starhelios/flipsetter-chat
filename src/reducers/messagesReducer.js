import {Messages} from './actions';
import {emojify} from "react-emojione";
import {AllHtmlEntities as entities} from 'html-entities';
import config from "../config";

const initialState = {
    messages: {},
}

export default function(state =initialState, action){

    switch(action.type){
        case Messages.actionTypes.ADD_MESSAGE:
            // console.log("addMessage", state.messages[action.payload.thread], action.payload.thread);
            // let current = (state.messages[action.payload.thread]) ?? null;
            if(state.messages.hasOwnProperty(action.payload.thread)){
                let check = Object.values(state.messages[action.payload.thread]).filter(message => {
                    if(message._id === action.payload.message.temp_id || message._id === action.payload.message._id){
                        return message;
                    }

                });
                if(check.length === 0){
                    let previous = state.messages[action.payload.thread];
                    return {...state,
                        messages: {
                            ...state.messages,
                            [action.payload.thread]: [action.payload.message, ...(previous) ?? null]
                        }
                    };
                }
            }
            return {...state};
        case Messages.actionTypes.UPDATE_MESSAGE:
            if(state.messages.hasOwnProperty(action.payload.thread)){
                let check = Object.entries(state.messages[action.payload.thread]).filter((message, key) => {
                    if(message[1]._id === action.payload.message.temp_id || message[1]._id === action.payload.message._id){
                        return {message};
                    }

                });
                let update = state.messages[action.payload.thread]
                update[check[0]] = action.payload.message;
                if(check.length === 1){
                    return {...state,
                        messages: {
                            ...state.messages,
                            [action.payload.thread]: [...update]
                        }
                    }
                }
            }
            return {...state};
        case Messages.actionTypes.ADD_MESSAGES:
            return {...state, messages: {...state.messages, [action.payload.thread]: action.payload.messages}};
        case Messages.actionTypes.GET_MESSAGES_SUCCESS:
            let data = action.payload.data;
            let messages = [];
            data.recent_messages.map( (message) => {
                // console.log("message_reducer", message);
                let newMessage;
                // console.log("message_reducer", message.message_type);
                switch(message.message_type){
                    case 0:
                        newMessage =
                            {
                                _id:  message.message_id,
                                text: emojify(entities.decode(message.body), {output: 'unicode'}),
                                createdAt: message.created_at,
                                user: {
                                    _id: message.owner_id,
                                    name: message.name,
                                    avatar:  `https://${config.api.uri}${message.avatar}` ,
                                }
                            };
                        break;
                    case 1:
                        newMessage =
                            {
                                _id: message.message_id,
                                image: `https://${config.api.uri}/${config.api.images.messengerPhoto(message.message_id)}`,
                                createdAt: message.created_at,
                                user: {
                                    _id: message.owner_id,
                                    name: message.owner_name,
                                    avatar: `https://${config.api.uri}${message.avatar}`,
                                }
                            };
                        break;
                    case 89:
                        newMessage =
                            {
                                _id:message.message_id,
                                text: `${message.name} ${message.body}`,
                                createdAt: message.created_at,
                                system: true,
                            }
                        break;
                    case 90:
                        newMessage =
                            {
                                _id:message.message_id,
                                text: `${message.name} ${message.body}`,
                                createdAt: message.created_at,
                                system: true,
                            }
                        break;
                    case 99:
                        newMessage =
                            {
                                _id:message.message_id,
                                text: `${message.name} ${message.body}`,
                                createdAt: message.created_at,
                                system: true,
                            }
                }
                if(newMessage){
                    messages = [
                        newMessage,
                        ...messages
                    ];
                }

            });
            // console.log("MESSAGES", messages);
            return {...state, messages: {...state.messages, [data.thread.thread_id]: messages}};
        case Messages.actionTypes.SEND_MESSAGE_SUCCESS:
            return {...state};
        case Messages.actionTypes.MARK_READ_SUCCESS:
            return {...state};
        case Messages.actionTypes.CLEAR_MESSAGES:
            return {...state, messages: {}};
        default:
            return state;
    }
}