import {Friends} from "./actions";

const initialState = {
    list: {},
}

export default function(state =initialState, action) {
    switch (action.type) {
        case Friends.actionTypes.GET_LIST:
            return {...state};
        case Friends.actionTypes.GET_LIST_SUCCESS:
            // console.log({...action.payload.data.friends});
            return {...state, list: {...action.payload.data.friends}};
        default:
            return state;
    }
}