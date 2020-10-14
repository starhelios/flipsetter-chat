import config from '../../config';

/*
 * action types
 */
const actionTypes = {
  GET_MESSAGES: 'GET_MESSAGES',
  GET_MESSAGES_SUCCESS: 'GET_MESSAGES_SUCCESS',
  GET_EARLIER_MESSAGES: 'GET_EARLIER_MESSAGES',
  GET_EARLIER_MESSAGES_SUCCESS: 'GET_EARLIER_MESSAGES_SUCCESS',
  SEND_MESSAGE: 'SEND_MESSAGE',
  SEND_MESSAGE_SUCCESS: 'SEND_MESSAGE_SUCCESS',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  ADD_MESSAGES: 'ADD_MESSAGES',
  REMOVE_MESSAGE: 'REMOVE_MESSAGE',
  MARK_READ: 'MARK_READ',
  MARK_READ_SUCCESS: 'MARK_READ_SUCCESS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
};

/*
 * ACTION CREATORS
 */
export function getMessages(id) {
  return {
    type: actionTypes.GET_MESSAGES,
    payload: {
      request: {
        method: 'GET',
        url: `${config.api.messenger.get.getMessages(id, 'initiate_thread')}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  };
}
export function getEarlierMessages(threadId, messageId) {
  return {
    type: actionTypes.GET_EARLIER_MESSAGES,
    payload: {
      request: {
        method: 'GET',
        url: `${config.api.messenger.get.getEarlierMessages(
          threadId,
          messageId,
        )}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      threadId,
    },
  };
}
export function sendMessage(id, message, type, file) {
  let data = {};
  if (type === 'message') {
    data = {
      type: 'store_message',
      temp_id: message._id,
      message: message.text,
    };
  } else if (type === 'img') {
    const formData = new FormData();
    formData.append('type', 'store_message');
    formData.append('temp_id', message._id);
    formData.append('image_file', file);
    data = formData;
  } else {
    const formData = new FormData();
    formData.append('type', 'store_message');
    formData.append('temp_id', message._id);
    formData.append('doc_file', file);
    data = formData;
  }
  return {
    type: actionTypes.SEND_MESSAGE,
    payload: {
      request: {
        method: 'POST',
        url: `${config.api.messenger.post.saveThread(id)}`,
        data,
        headers: {
          Authorization: null,
          Accept: 'application/json',
          'Content-Type':
            type === 'message' ? 'application/json' : 'multipart/form-data',
        },
      },
    },
  };
}
export function markRead(id) {
  return {
    type: actionTypes.MARK_READ,
    payload: {
      request: {
        method: 'GET',
        url: `${config.api.messenger.get.getMessages(id, 'mark_read')}`,
      },
    },
  };
}

export function addMessage(thread, message) {
  return {type: actionTypes.ADD_MESSAGE, payload: {thread, message}};
}

export function updateMessage(thread, message) {
  return {type: actionTypes.UPDATE_MESSAGE, payload: {thread, message}};
}

export function addMessages(thread, messages) {
  return {type: actionTypes.ADD_MESSAGES, payload: {thread, messages}};
}

export function removeMessage(thread, message) {
  return {type: actionTypes.REMOVE_MESSAGE, payload: {thread, message}};
}

function clearMessages() {
  return {type: actionTypes.CLEAR_MESSAGES};
}

export default {
  actionTypes,
  getMessages,
  getEarlierMessages,
  sendMessage,
  markRead,
  addMessage,
  updateMessage,
  addMessages,
  removeMessage,
  clearMessages,
};
