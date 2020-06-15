import React from "react";
import Redux from '../Store';
import {App, Messages, Threads} from "../reducers/actions";
import {connect} from 'react-redux';
import NavigationService from "./NavigationService";

class ThreadsService extends React.Component {

    constructor(props) {
        super(props);
        // console.log(props);
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        // if(prevProps.threads.activeThread !== this.props.threads.activeThread){
        //     NavigationService.navigate("Messages", {
        //         thread: this.props.threads.activeThread,
        //     });
        // }
        // if(this.props.app.routeName !== 'Messages'){console.log("clearActiveThread"); this.props.setActiveThread(null)}
        if(this.props.app.route !== 'Messages' && this.props.threads.activeThread){
            // console.log("clear active", this.props.app.route);
            this.props.setActiveThread(null);
        }
        // console.log(this.props.threads.activeThread, this.props.app.route);
    }

    // state: store.getState(),
    // get: async() =>{
    //     let threads = {};
    //     store.dispatch(Threads.getThreads()).then((response) => {
    //         // console.log(response);
    //         response.payload.data.data.map( thread => {
    //             threads[thread.thread_id] = thread;
    //         });
    //     }).then(() => {
    //         store.dispatch(Threads.storeThreads(threads))
    //     }).then(() => {
    //         return true;
    //     });
    // }

    render(){
        return null;
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        threads: state.threads,
        user: state.user,
        messages: state.messages,
    }
}

const mapDispatchToProps = {
    setActiveThread: Threads.setActiveThread,
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsService)