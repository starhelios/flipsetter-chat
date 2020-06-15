import React, {Component} from 'react';
import {connect} from "react-redux";
import {Container} from "native-base";
import * as All from "../services";
import {App, Auth, Threads, User} from "../reducers/actions";

class Services extends Component<Props> {

    constructor(props) {
        super(props);

    }

    render=()=>(
        All.default.map((Component, key) => {
            return <Component key={key}/>
        })
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
    }
};

const mapDispatchToProps = {
    setErrorMsg: App.setErrorMsg,
    setIsLoading: App.setIsLoading,
    setAccessToken: Auth.setAccessToken,
    setIsLoggedIn: Auth.setIsLoggedIn,
    getThreads: Threads.getThreads,
    storeThreads: Threads.storeThreads,
    setActiveThread: Threads.setActiveThread,
    getUser: User.getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Services)