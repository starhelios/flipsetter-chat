import { Whiteboard } from './actions';

const initialState = {
  backgroundPattern: null,
  color: '#555555',
  width: 5,
};

export default function whiteboardReducer(state = initialState, action) {
  switch (action.type) {
    case Whiteboard.actionTypes.SET_BACKGROUND_PATTERN:
      return { ...state, backgroundPattern: action.payload.patternName };
    case Whiteboard.actionTypes.SET_BRUSH_COLOR:
      return { ...state, color: action.payload.color };
    case Whiteboard.actionTypes.SET_BRUSH_WEIGHT:
      return { ...state, width: action.payload.weight };
    case Whiteboard.actionTypes.RESET:
      return { ...state, ...initialState };
    default:
      return state;
  }
}
