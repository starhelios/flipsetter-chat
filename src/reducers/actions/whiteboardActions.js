/*
 * action types
 */
const actionTypes = {
  SET_BACKGROUND_PATTERN: 'SET_BACKGROUND_PATTERN',
  SET_BRUSH_COLOR: 'SET_BRUSH_COLOR',
  SET_BRUSH_WEIGHT: 'SET_BRUSH_WEIGHT',
  RESET: 'RESET',
};

/*
 * ACTION CREATORS
 */
function setBackgroundPattern(payload) {
  return { type: actionTypes.SET_BACKGROUND_PATTERN, payload };
}

function setBrushColor(payload) {
  return { type: actionTypes.SET_BRUSH_COLOR, payload };
}
function setBrushWeight(payload) {
  return { type: actionTypes.SET_BRUSH_WEIGHT, payload };
}
function reset(payload) {
  return { type: actionTypes.RESET, payload };
}

export default {
  actionTypes,
  setBackgroundPattern,
  setBrushColor,
  setBrushWeight,
  reset,
};
