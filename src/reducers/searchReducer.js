import {Search} from "./actions";

const initialState = {
    query: null,
    results: {},
}

export default function(state =initialState, action) {
    switch (action.type) {
        case Search.actionTypes.SEARCH:
            return {...state, query: action.payload.query};
        case Search.actionTypes.SEARCH_SUCCESS:
            return {...state, results: action.payload.data.results};
        case Search.actionTypes.CLEAR_SEARCH:
            return {...state, results: {}, query: null,};
        default:
            return state;
    }
}