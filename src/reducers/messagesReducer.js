import {Messages} from './actions';
import {emojify} from 'react-emojione';
import {AllHtmlEntities as entities} from 'html-entities';
import config from '../config';
import {constructProperMessage} from '../helper/index';
import {update} from 'lodash';

const initialState = {
  messages: {},
  toUploadFilesIos: {
    data: [],
    mimeType: null
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case Messages.actionTypes.ADD_MESSAGE:
      if (state.messages.hasOwnProperty(action.payload.thread)) {
        let check = Object.values(state.messages[action.payload.thread]).filter(
          (message) => {
            if (
              message._id === action.payload.message.temp_id ||
              message._id === action.payload.message._id
            ) {
              return message;
            }
          },
        );
        if (check.length === 0) {
          let previous = state.messages[action.payload.thread];
          return {
            ...state,
            messages: {
              ...state.messages,
              [action.payload.thread]: [
                action.payload.message,
                ...(previous ?? null),
              ],
            },
          };
        }
      }
      return {...state};
    case Messages.actionTypes.UPDATE_MESSAGE:
      const {thread, message} = action.payload;
      if (state.messages.hasOwnProperty(thread)) {
        const currentThreadMessages = state.messages[thread];
        const existingMessageIndex = currentThreadMessages.findIndex(
          (item) =>
            item.temp_id === message.temp_id || item._id === message.temp_id,
        );
        const newList = JSON.parse(JSON.stringify(currentThreadMessages));
        newList[existingMessageIndex] = message;

        // let check = Object.entries(
        //   state.messages[action.payload.thread],
        // ).filter((message, key) => {
        //   if (
        //     message[1]._id === action.payload.message.temp_id ||
        //     message[1]._id === action.payload.message._id
        //   ) {
        //     return {message};
        //   }
        // });
        // let update = state.messages[action.payload.thread];
        // console.log(update, 'Just before updating message', check);
        // update[check[0]] = action.payload.message;
        // if (check.length === 1) {
        //   console.log('check state after update', state);
        return {
          ...state,
          messages: {
            ...state.messages,
            [action.payload.thread]: [...newList],
          },
        };
        // }
      }
      return {...state};
    case Messages.actionTypes.ADD_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.thread]: action.payload.messages,
        },
      };
    case Messages.actionTypes.REMOVE_MESSAGE:
      const {thread: activeThread, message: unsentMessage} = action.payload;
      const currentThreadMessages = state.messages[activeThread];
      const updatedList = currentThreadMessages.filter(
        (item) => item.temp_id === unsentMessage.team_id,
      );
      return {
        ...state,
        messages: {
          ...state.messages,
          [activeThread]: [...updatedList],
        },
      };
    case Messages.actionTypes.GET_EARLIER_MESSAGES_SUCCESS:
      const {
        meta: {previousAction: {payload: {threadId} = {}} = {}} = {},
        payload: {
          data: {messages: oldMessages = []},
        },
      } = action;
      const {messages: existingMessages = {}} = state;
      let structureOldMessages = oldMessages.map((messageItem) =>
        constructProperMessage(messageItem),
      );
      structureOldMessages = structureOldMessages.reverse();
      if (threadId) {
        return {
          ...state,
          messages: {
            ...existingMessages,
            [threadId]: [
              ...existingMessages[threadId],
              ...structureOldMessages,
            ],
          },
        };
      }
      return {...state};
    case Messages.actionTypes.GET_MESSAGES_SUCCESS:
      let data = action.payload.data;
      let messages = [];
      data.recent_messages.map((message) => {
        const newMessage = constructProperMessage(message);
        if (newMessage) {
          messages = [newMessage, ...messages];
        }
      });
      return {
        ...state,
        messages: {...state.messages, [data.thread.thread_id]: messages},
      };
    case Messages.actionTypes.SEND_MESSAGE_SUCCESS:
      return {...state};
    case Messages.actionTypes.MARK_READ_SUCCESS:
      return {...state};
    case Messages.actionTypes.CLEAR_MESSAGES:
      return {...state, messages: {}};

    case Messages.actionTypes.UPDATE_TO_UPLOAD_FILES_IOS:
      return {...state, toUploadFilesIos: {...state.toUploadFilesIos, ...action.payload}}
    default:
      return state;
  }
}
