import {Messages} from './actions';
import {emojify} from "react-emojione";
import {AllHtmlEntities as entities} from 'html-entities';

const initialState = {
    messages: {},
}

export default function(state =initialState, action){

    switch(action.type){
        case Messages.actionTypes.ADD_MESSAGE:
            // console.log("addMessage", state.messages[action.payload.thread], action.payload.thread);
            // let current = (state.messages[action.payload.thread]) ?? null;
            let previous = (state.messages.hasOwnProperty(action.payload.thread)) ? state.messages[action.payload.thread] : [];
            return {...state, messages: {...state.messages, [action.payload.thread]: [action.payload.message, ...(previous) ?? null]}};
        case Messages.actionTypes.ADD_MESSAGES:
            return {...state, messages: {...state.messages, [action.payload.thread]: action.payload.messages}};
        case Messages.actionTypes.GET_MESSAGES_SUCCESS:
            let data = action.payload.data;
            let messages = [];
            data.recent_messages.map( (message) => {
                // console.log("message_reducer", message);
                let newMessage = {};
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
                                    avatar:  `https://tippinweb.com/api/v0` + message.avatar ,
                                }
                            };
                        break;
                    case 1:
                        newMessage =
                            {
                                _id: message.message_id,
                                image: "https://tippinweb.com/api/v0/images/messenger/"+message.message_id,
                                createdAt: message.created_at,
                                user: {
                                    _id: message.owner_id,
                                    name: message.owner_name,
                                    avatar: `https://tippinweb.com/api/v0${message.avatar}`,
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
                }
                messages = [
                    newMessage,
                    ...messages
                ];

            });

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