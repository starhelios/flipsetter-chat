import { Threads } from './actions';
import {emojify} from "react-emojione";
import {AllHtmlEntities as entities} from "html-entities";

const initialState = {
    activeThread: null,
    threads: {},
};


export default function(state=initialState, action){
    // alert(JSON.stringify(action))
    let threads = {};
    switch(action.type){
        case Threads.actionTypes.SET_ACTIVE_THREAD:
            if(action.payload){
                state.threads[action.payload].unread = false;

                return {...state,
                    activeThread: action.payload,
                    threads: {...state.threads}
                };
            }
            else{
                return {...state, activeThread: null,};
            }
        case Threads.actionTypes.STORE_THREADS:
            return {...state, threads: {...action.payload}};
        case Threads.actionTypes.UPDATE_THREAD:
            threads = state.threads.filter( thread => thread.thread_id !== action.payload.thread.thread_id);
            return {...state, threads: {threads, [action.payload.thread.thread_id]: action.payload.thread}};
        case Threads.actionTypes.GET_THREADS_SUCCESS:
            (action.payload.data.threads).map(thread => {
                if(thread.recent_message.message_type === 90 || thread.recent_message.message_type === 89){
                    thread.recent_message.body = `${thread.recent_message.name} ${thread.recent_message.body}`;
                }
                if(thread.recent_message.message_type === 1){
                    thread.recent_message.body = `${thread.recent_message.name} sent a photo`;
                }
                if(thread.recent_message.message_type === 2){
                    thread.recent_message.body = `${thread.recent_message.name} sent a video`;
                }
                thread.recent_message.body = emojify(entities.decode(thread.recent_message.body), {output: 'unicode'})
                threads[thread.thread_id] = thread
            });
            return {...state, threads: {...threads}};
        case Threads.actionTypes.CLEAR_THREADS:
            return {...state, threads: {}, activeThread: null,};
        default:
            return state;
    }

}