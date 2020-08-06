import React from 'react';
import Echo from "laravel-echo";
import io from "socket.io-client";
import {emojify} from "react-emojione";
import {AllHtmlEntities as entities} from "html-entities";
import {connect} from "react-redux";

import {App, Auth, User, Threads, Messages, Call} from "../reducers/actions";
import config from "../config";

const SocketContext = React.createContext(null);

class SocketProvider extends React.Component {

    state = {
        socket: false,
        privateChannel: false,
        listeners: false,
        status: "disconnected",
    }

    async componentDidMount(){
        await this.connectSocket();
        if(this.state.socket && this.state.socket.connector.socket.connected){
            this._listeners();
        }
    }

    componentWillUnmount() {
        if(this.state.socket){
            this.state.socket.disconnect();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

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
            //Private not set
            if(this.props.user.id && this.state.socket && !this.state.privateChannel){
                if(typeof this.state.socket.connector.channels[`private-user_notify_${this.props.user.id}`] !== "undefined"){
                    this.privateChannel = this.state.socket.connector.channels[`private-user_notify_${this.props.user.id}`]
                    this.setState({
                        privateChannel: this.privateChannel,
                    });
                }
                else{
                    this.privateChannel = this.state.socket.private(`user_notify_${this.props.user.id}`);
                    this.setState({
                        privateChannel: this.privateChannel
                    }, this._privateListeners());

                }

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

        // if(prevProps.app.appState !== this.props.app.appState && this.props.app.appState.match(/active/)){
        //     (this.props.auth.isLoggedIn && this.state.socket) && this.state.socket.connect();
        //     (this.props.auth.isLoggedIn && !this.state.socket) && this.connectSocket();
        // }
        // if(prevProps.app.appState !== this.props.app.appState && this.props.app.appState.match(/inactive|background/) && this.state.socket && this.props.app.appState !== "callDisplayed"){
        //     this.state.socket.disconnect();
        // }
    }

    connectSocket = () => {
        let token = `Bearer ${this.props.auth.accessToken}`;
        if(this.props.auth.isLoggedIn){
            let connect = new Echo({
                broadcaster: 'socket.io',
                host: `wss://${(config.env === "dev") ? config.dev.uri+":6001" : config.prod.uri}`,
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
                status: "connected",
            }, () => {return true});

        }
        return false;

    }

    _listeners = () => {
        this.state.socket.connector.socket.on('connect', () => {
            // console.log('connected', this.state.socket.socketId());
        }).on('disconnect', (data) => {
            console.log("disconnected", data);
            this.setState({
                status: "disconnected",
            })
            this.connectSocket();
        }).on('reconnecting', (data) => {
            console.log('reconnecting', data);
            this.setState({
                status: "reconnecting",
            })
        }).on('reconnect', (attempt) => {
            console.log('connecting', attempt);
            //add in if too many attempts, flag in app

            this.setState({
                status: "connected",
            })
        });
    };

    _privateListeners = () => {
        console.log("Listener", this.privateChannel);
        this.privateChannel
            .listen('.new_message', (e) => {
                console.log("NEW MESSAGE", e);
                let check = Object.values(this.props.messages.messages[e.thread_id]).filter(message => {
                    // console.log("LIST", message);
                    if(message._id === e.temp_id || message._id === e.message_id || e.owner_id === this.props.user.id){
                        if(typeof message.temp_id !== "undefined"){
                            if(message.temp_id !== e._id){
                                return message;
                            }
                        }
                        else{
                            return message;
                        }
                    }
                });
                console.log("CHECK");
                if(check.length === 0){
                //     if(e.thread_id === this.props.app.activeThread){
                        let newMessage = {};
                        switch(e.message_type){
                            case 0:
                                newMessage =
                                    {
                                        _id: e.message_id,
                                        text: emojify(entities.decode(e.body), {output: 'unicode'}),
                                        createdAt: e.created_at,
                                        user: {
                                            _id: e.owner_id,
                                            name: e.name,
                                            avatar: `https://${config.api.uri}${e.avatar}`,
                                        }
                                    };
                                break;
                            case 1:
                                newMessage =
                                    {
                                        _id: e.message_id,
                                        image: `https://${config.api.uri}${config.api.images.messengerPhoto(e.message_id, true)}`,
                                        createdAt: e.created_at,
                                        user: {
                                            _id: e.owner_id,
                                            name: e.name,
                                            avatar: `https://${config.api.uri}${e.avatar}`,
                                        }
                                    };
                                break;
                            case 89:
                                newMessage =
                                    {
                                        _id:e.message_id,
                                        text: `${e.name} ${e.body}`,
                                        createdAt: e.created_at,
                                        system: true,
                                    }
                                break;
                            case 90:
                                newMessage =
                                    {
                                        _id:e.message_id,
                                        text: `${e.name} ${e.body}`,
                                        createdAt: e.created_at,
                                        system: true,
                                    }
                                break;

                        }

                        // let filter = this.props.messages.messages[this.props.navigation.getParam('thread')].filter( (message, i) => {
                        //     if(message._id === e.message_id){
                        //         return message;
                        //     }
                        // });

                        // if(filter.length === 0) {
                            this.props.addMessage(e.thread_id, newMessage);
                            if(e.thread_id === this.props.threads.activeThread){
                                this.props.markRead(this.props.threads.activeThread);
                            }
                            //update threads screen store in the background
                            let threads = {...this.props.threads.threads};
                            let current = threads[e.thread_id];
                            delete threads[e.thread_id];
                            current.recent_message = {
                                body: newMessage.text,
                                message_type: e.message_type,

                            };
                            if(newMessage.system !== true) current.recent_message.name = newMessage.user.name;
                            if(e.message_type === 1){
                                current.recent_message.body = `${newMessage.user.name} sent a photo`;
                            }
                            else if(e.message_type === 2){
                                current.recent_message.body = `${newMessage.user.name} sent a video`;
                            }
                            if(this.props.threads.activeThread !== e.thread_id){
                                current.unread = true;
                            }
                            this.props.storeThreads({
                                [e.thread_id]: current,
                                ...threads
                            });


                            // this.thread.whisper('read', {
                            //     owner_id: this.props.user.id,
                            //     message_id: newMessage._id,
                            // });
                        // }
                    // }
                }

            })
            .listen('.thread_joined', event => { console.log('.thread_joined', event)})
            .listen('.message_purged',  event => { console.log('.message_purged', event)})
            .listen('.call_started', event => { console.log('.call_started', event)})
            .listen('.thread_kicked', event => { console.log('.thread_kicked', event)})
            .listen('.knock_knock',  event => { console.log('.knock_knock', event)});
    }
    render() {

        return (
            <SocketContext.Provider value={{socket: this.state.socket, privateChannel: this.state.privateChannel, status: this.state.status}}>
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

const mapDispatchToProps = {
    setErrorMsg: App.setErrorMsg,
    setIsLoading: App.setIsLoading,
    setAccessToken: Auth.setAccessToken,
    setIsLoggedIn: Auth.setIsLoggedIn,
    getUser: User.getUser,
    getMessages: Messages.getMessages,
    sendMessage: Messages.sendMessage,
    markRead: Messages.markRead,
    addMessage: Messages.addMessage,
    addMessages: Messages.addMessages,
    setActiveThread: Threads.setActiveThread,
    storeThreads: Threads.storeThreads,
    startVideoCall: Call.startVideoCall,
    startWhiteboard: Call.startWhiteboard,
    setCallId: Call.setCallId,
    setCallType: Call.setCallType,
    setCallRoom: Call.setCallRoom,
    setCallRoomPin: Call.setCallRoomPin,
    setCallerName: Call.setCallerName,
    setCallThreadId: Call.setCallThreadId,
    setCallStatus: Call.setCallStatus,
    appHeartbeat: App.appHeartbeat,
};

export default connect(mapStateToProps, mapDispatchToProps)(SocketProvider);

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
