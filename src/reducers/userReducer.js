import { User } from './actions';

const initialState = {
  id: '',
  first: '',
  last: '',
  email: null,
  avatar: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case User.actionTypes.SET_USER_ID:
      return { ...state, id: action.payload };
    case User.actionTypes.SET_FIRST_NAME:
      return { ...state, first: action.payload };
    case User.actionTypes.SET_LAST_NAME:
      return { ...state, last: action.payload };
    case User.actionTypes.SET_EMAIL:
      return { ...state, email: action.payload };
    case User.actionTypes.GET_USER_SUCCESS:
      const { data } = action.payload;
      // alert(JSON.stringify(data))
      return {
        ...state,
        id: data.user_id ? data.user_id : data.id,
        first: data.first,
        last: data.last,
        email: data.email,
        avatar: data.avatar,
      };
    default:
      return state;
  }
}
