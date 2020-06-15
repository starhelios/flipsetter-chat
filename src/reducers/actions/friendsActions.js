import config from "../../config";

/*
 * action types
 */
const actionTypes = {
    GET_LIST: "GET_LIST",
    GET_LIST_SUCCESS: "GET_LIST_SUCCESS",
};

export function getList(){
    return {
        type: actionTypes.GET_LIST,
        payload: {
            request: {
                method: 'GET',
                url: `${config.api.friends.get.list}`,
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            },
        }
    }
}

export default { actionTypes, getList }