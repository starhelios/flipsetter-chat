import config from '../../config';

/*
 * action types
 */
const actionTypes = {
  CALL_HEARTBEAT: 'CALL_HEARTBEAT',
  SET_CALL_ID: 'SET_CALL_ID',
  SET_CALL_STATUS: 'SET_CALL_STATUS',
  SET_CALL_TYPE: 'SET_CALL_TYPE',
  SET_CALL_ROOM: 'SET_CALL_ROOM',
  SET_CALL_ROOM_PIN: 'SET_CALL_ROOM_PIN',
  SET_CALLER_NAME: 'SET_CALLER_NAME',
  SET_CALL_THREAD_ID: 'SET_CALL_THREAD_ID',
  JOIN_CALL: 'JOIN_CALL',
  LEAVE_CALL: 'LEAVE_CALL',
  START_AUDIO_CALL: 'START_AUDIO_CALL',
  START_VIDEO_CALL: 'START_VIDEO_CALL',
  START_VIDEO_CALL_SUCCESS: 'START_VIDEO_CALL_SUCCESS',
  START_WHITEBOARD: 'START_WHITEBOARD',
  START_WHITEBOARD_SUCCESS: 'START_WHITEBOARD_SUCCESS',
  SAVE_PATH: 'SAVE_PATH',
  GET_WHITEBOARD: 'GET_WHITEBOARD',
};

/*
 * ACTION CREATORS
 */
function setCallId(uuid) {
  return { type: actionTypes.SET_CALL_ID, payload: uuid };
}
function setCallStatus(status) {
  return { type: actionTypes.SET_CALL_STATUS, payload: status };
}
function setCallType(type) {
  return { type: actionTypes.SET_CALL_TYPE, payload: type };
}
function setCallRoom(room) {
  return { type: actionTypes.SET_CALL_ROOM, payload: room };
}
function setCallRoomPin(pin) {
  return { type: actionTypes.SET_CALL_ROOM_PIN, payload: pin };
}
function setCallerName(name) {
  return { type: actionTypes.SET_CALLER_NAME, payload: name };
}
function setCallThreadId(thread) {
  return { type: actionTypes.SET_CALL_THREAD_ID, payload: thread };
}
function joinCall(id) {
  return {
    type: actionTypes.JOIN_CALL,
    payload: {
      request: {
        method: 'POST',
        // url: `${config.prefix}/thread/${id}/message`,
        url: `${config.api.messenger.post.saveThread(id)}`,
        data: {
          type: 'join_call',
        },
        headers: {
          Authorization: null,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  };
}

function leaveCall(id) {
  return {
    type: actionTypes.LEAVE_CALL,
    payload: {
      request: {
        method: 'POST',
        // url: `${config.prefix}/thread/${id}/message`,
        url: `${config.api.messenger.post.saveThread(id)}`,
        data: {
          type: 'leave_call',
        },
        headers: {
          Authorization: null,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  };
}

function startAudioCall(id) {
  return {
    type: actionTypes.START_AUDIO_CALL,
    payload: {
      request: {
        method: 'POST',
        // url: `${config.prefix}/thread/${id}/message`,
        url: `${config.api.messenger.post.saveThread(id)}`,
        data: {
          type: 'initiate_call',
        },
        headers: {
          Authorization: null,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  };
}

function startVideoCall(id) {
  return {
    type: actionTypes.START_VIDEO_CALL,
    payload: {
      request: {
        method: 'POST',
        // url: `${config.prefix}/thread/${id}/message`,
        url: `${config.api.messenger.post.saveThread(id)}`,
        data: {
          type: 'initiate_call',
        },
        headers: {
          Authorization: null,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  };
}
function startWhiteboard(id) {
  return {
    type: actionTypes.START_WHITEBOARD,
    payload: {
      request: {
        method: 'POST',
        // url: `${config.prefix}/thread/${id}/message`,
        url: `${config.api.messenger.post.saveThread(id)}`,
        data: {
          type: 'initiate_whiteboard',
        },
        headers: {
          Authorization: null,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  };
}
function callHeartbeat(threadId, callId, type) {
  return {
    type: actionTypes.CALL_HEARTBEAT,
    payload: {
      request: {
        method: 'GET',
        url: `${config.api.messenger.get.fetchCall(threadId, callId, type)}`,
      },
    },
  };
}

function savePath(threadId, callId, path) {
  return {
    type: actionTypes.SAVE_PATH,
    payload: {
      request: {
        method: 'POST',
        url: `${config.api.messenger.post.saveCall(threadId, callId)}`,
        data: {
          action: 'quick_save',
          timeline_item: path,
        },
        fail_alert: true,
      },
    },
  };
}

export default {
  actionTypes, callHeartbeat, setCallId, setCallStatus, setCallType, setCallRoom, setCallRoomPin, setCallerName, setCallThreadId, joinCall, leaveCall, startAudioCall, startVideoCall, startWhiteboard, savePath,
};
