import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    SEARCH: "SEARCH",
    SEARCH_SUCCESS: "SEARCH_SUCCESS",
    SEARCH_FAIL: "SEARCH_FAIL",
    CLEAR_SEARCH: "CLEAR_SEARCH",
};

export function clearSearch(){
    return {type: actionTypes.CLEAR_SEARCH}
}


export function getSearch(query){
    return {
        type: actionTypes.SEARCH,
        payload: {
            request: {
                method: 'GET',
                url: `${config.api.messenger.get.search(query)}`,
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            },
            query: query,
        }
    }
}

export default { actionTypes, getSearch, clearSearch }