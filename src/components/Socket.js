import React from 'react';
import Echo from "laravel-echo";
import io from "socket.io-client";
import {App, Auth, User, Threads, Messages} from "../reducers/actions";
import {connect} from "react-redux";
const SocketContext = React.createContext(null);

class SocketProvider extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            socket: false,
            privateChannel: false,
            listeners: false,
        }
    }

    async componentDidMount(): void{
        // console.log(this.props);
        let echo = await this.connectSocket();
        if(this.state.socket && this.state.socket.connector.socket.connected){
            this._listeners();
        }



    }

    componentWillUnmount(): void {
        if(this.state.socket){
            this.state.socket.disconnect();
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        // console.log("socket", this.state.socket);
        if(!this.state.socket && this.props.auth.isLoggedIn){
           this.connectSocket();
        }

        if(this.state.socket && this.state.socket.connector.socket.io.readyState === 'open' && !this.state.listeners){
            this._listeners();
            this.setState({
                listeners: true,
            })
        }
        //User Logged In
        if(this.props.auth.isLoggedIn){
            if(this.props.user.id && this.state.socket.connector.socket.io.readyState === "open" && !this.state.privateChannel){
                this.setState({
                    privateChannel: this.state.socket.private(`user_notify_${this.props.user.id}`)
                })
            }
        }
        //on login or logout
        if(prevProps.auth.isLoggedIn !== this.props.auth.isLoggedIn){

            //User Logged Out
            if(!this.props.auth.isLoggedIn){
                this.state.socket.disconnect();
            }

        }
        //Checks while user is logged in
        if(this.props.auth.isLoggedIn){
            //Is Private Channel not connected?
            if(this.props.user.id && !this.state.privateChannel && this.state.socket)
            {
                this.setState({
                    privateChannel: this.state.socket.private(`user_notify_${this.props.user.id}`)
                })
            }
        }
        //Did the app

        if(prevProps.app.appState !== this.props.app.appState && this.props.app.appState.match(/active/)){
            (this.props.auth.isLoggedIn && this.state.socket) && this.state.socket.connect();
            (this.props.auth.isLoggedIn && !this.state.socket) && this.connectSocket();
        }
        if(prevProps.app.appState !== this.props.app.appState && this.props.app.appState.match(/inactive|background/) && this.state.socket){
            this.state.socket.disconnect();
        }
    }

    connectSocket = () => {
        let token = `Bearer ${this.props.auth.accessToken}`;
        if(this.props.auth.isLoggedIn){
            let connect = new Echo({
                broadcaster: 'socket.io',
                host: 'wss://tippinweb.com:6001',
                client: io,
                auth: {
                    headers: {
                        Authorization: token,
                    },
                },
                timeout: 10000,
                jsonp: false,

            });

            this.setState({
                socket: connect,
            }, () => {return true});

        }
        return false;

    }

    _listeners = () => {
        this.state.socket.connector.socket.on('connect', () => {
            // console.log('connected', this.state.socket.socketId());
        }).on('disconnect', (data) => {
            console.log("disconnected", data);
            this.connectSocket();
        }).on('reconnecting', (data) => {
            console.log('reconnecting', data);
        }).on('reconnect', (attempt) => {
            console.log('connecting', attempt);
            //add in if too many attempts, flag in app
        });
    };

    render() {

        return (
            <SocketContext.Provider value={{socket: this.state.socket, privateChannel: this.state.privateChannel}}>
                {this.props.children}
            </SocketContext.Provider>
        );

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

export default connect(mapStateToProps)(SocketProvider);

export function withSocketContext(Component) {
    class ComponentWithSocket extends React.Component {

        static navigationOptions = {
            headerShown: false,
        };

        render() {
            return (
                <SocketContext.Consumer>
                    { socket =>  <Component {...this.props}  socket={socket} ref={this.props.onRef} /> }
                </SocketContext.Consumer>
            );
        }
    }

    return ComponentWithSocket;
}

connect(mapStateToProps)(withSocketContext(SocketProvider))
