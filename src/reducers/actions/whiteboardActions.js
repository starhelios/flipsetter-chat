/*
 * action types
 */
const actionTypes = {
  SET_BACKGROUND_PATTERN: 'SET_BACKGROUND_PATTERN',
  SET_BRUSH_COLOR: 'SET_BRUSH_COLOR',
  SET_BRUSH_WEIGHT: 'SET_BRUSH_WEIGHT',
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

export default {
  actionTypes,
  setBackgroundPattern,
  setBrushColor,
  setBrushWeight,
};
