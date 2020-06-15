import React, {Component} from 'react';
import {App, Auth, Threads, User} from "../reducers/actions";

import AppNavigator from "../navigation/AppNavigator";
import NavigationService from "./NavigationService";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";

class AuthService extends Component{
    state = { auth: false,}

    constructor(props) {
        super(props);
        // console.log(this.props);
        //Routes that don't require Auth
        this.noAuthRoutes = ["Login", "Register", "Forgot"];
    }

    async componentDidMount(): void {
        this.checkAuth();
        if(!this.props.user.id  && this.props.auth.isLoggedIn){
            // console.log();
            this.checkUser();
            this.setState({
                auth: true,
            })
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        this.checkAuth();
        if(!this.props.user.id && this.props.auth.isLoggedIn && this.state.auth){
            // console.log();
            this.checkUser();
        }
    }

    checkAuth(){
        if(!this.noAuthRoutes.includes(this.props.app.route) && !this.props.auth.accessToken){
            NavigationService.navigate('Login');
        }
    }

    async checkUser(){

            this.props.getUser();

    }


    render(){
        return null
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
    }
}

const mapDispatchToProps = {
    setRoute: App.setRoute,
    getUser: User.getUser,
    setUserID: User.setUserID,
}

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(AuthService))