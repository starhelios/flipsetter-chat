import React, { Component } from 'react';
import {connect} from "react-redux";
import config from "../config/";
import {withSocketContext} from "./Socket";
import {withNavigationFocus, NavigationEvents} from "react-navigation";
import {RTCView} from 'react-native-webrtc';
import {AppRegistry, StyleSheet, Text, TouchableHighlight, View, SafeAreaView, TextInput, ListView, ScrollView, Dimensions, Image, Alert} from 'react-native';
import {Container, Header} from "native-base";

import {CirclesLoader} from "react-native-indicator";
import Icon from "react-native-vector-icons/FontAwesome5";
import Janus from "./Janus";
import InCallManager from 'react-native-incall-manager';
import {Friends} from "../reducers/actions";

let server = "wss://janus.flipsetter.com/janus-ws";
let remoteHeight = 175; let remoteWidth = 225;
class WebRTC extends Component<Props> {
    janus;

    state = {
        localStream: null,
        localStreamURL: null,
        remoteList: {},
        remoteListPluginHandle: {},
        remoteSpeaker: null,
        remoteSpeakerTimeout: null,
        remoteDimensions: {
            height: 175,
            width: 225,
        }
    };

    constructor(props) {
        super(props);
        console.log("WebRTC state", this.state);
    }

    componentDidMount(): void {
        this.janusInit();
    }

    componentWillUnmount(): void {
        //Not needed on tab since screen is never unmounted

        // this.videoroom.send({"message": { "request": "unpublish" }});
        // console.log("remoteList", this.state.remoteList);
        // Object.entries(this.state.remoteList).map(({id, url}) => {
        //     this.state.remoteListPluginHandle[id].send({"message": { "request": "unsubscribe"}})
        // });
        this.janus.destroy();
        // not needed due to unmounting
        // this.setState(prevState => ({
        //     remoteList: {},
        //     remoteListPluginHandle: {},
        //     remoteStream: null,
        //     remoteStreamURL: null,
        //
        // }))
    }

    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        console.log("Talkers", this.state.remoteSpeaker);
        if(!this.state.remoteSpeaker){

            //Grab first stream in list, doesn't matter just to get started
            let stream = Object.keys(this.state.remoteList);
            console.log("INIT", stream)
            if(stream.length > 0){
                this.setState({
                    remoteSpeaker: stream[0]
                })
            }

        }

        // if(prevProps.isFocused !== this.props.isFocused && !this.props.isFocused){
        //     InCallManager.stop();
        //     // this.videoroom.send({"message": { "request": "unpublish" }});
        //     // // // console.log("remoteList", this.state.remoteList);
        //     // Object.entries(this.state.remoteList).map(({id, url}) => {
        //     //     this.state.remoteListPluginHandle[id].send({"message": { "request": "leave", "feed": id}})
        //     // });
        //     this.janus.destroy();
        //     this.setState(prevState => ({
        //         remoteList: {},
        //         remoteListPluginHandle: {},
        //         remoteStream: null,
        //         remoteStreamURL: null,
        //     }))
        // }

        if(prevProps.isFocused !== this.props.isFocused && this.props.isFocused){
            InCallManager.start({media: 'video'});
            this.janusInit();
        }

        if(this.props.app.appState.match(/inactive|background/)){
            InCallManager.stop();
            this.videoroom.send({"message": { "request": "unpublish" }});
            this.janus.destroy();

        }
        if(prevProps.app.appState === 'background' && this.props.app.appState.match(/active/)){
            InCallManager.start({media: 'video'});
            this.janusInit();
        }

    }


    janusInit = () => {
        Janus.init({});
        this.janusStart();

    };

    janusStart = () => {
        this.janus = new Janus({
            server: server,
            opaqueId: this.props.user.id,
            apisecret: "Fu.WrK8@pWZ2w!E",
            iceServers: [{urls: "turn:janus.flipsetter.com", username: "ajnozari", credential: "8BrBQffgdFHoFRQDucvZ"}],
            success: this.janusSuccess,
            error: (error) => {
            },
            destroyed: (destroy) => {

            },
        })
    }

    onLocalStream = (stream) => {
        console.log("LOCAL", stream);
        this.setState({localStream: stream.toURL()});
    }

    janusSuccess = () => {

        this.janus.attach( {
            plugin:"janus.plugin.videoroom",
            success: (pluginHandle) => {
                // console.log("success", pluginHandle);
                this.videoroom = pluginHandle;
                let register = {request: "join", room: 2768356249109265, pin: "YO96K9", ptype: "publisher", display: this.props.user.first + " " + this.props.user.last };
                this.videoroom.send({"message": register});
            },
            error: (error) => {console.log("attach-error", error)},
            consentDialog: (on) => {console.log("attach-consent", on)},
            mediaState: (medium, on) => {console.log("attach-mstate", medium, on)},
            webrtcState: (on) => {console.log("attach-webrtcState", on)},
            onmessage: (msg, jsep) => {
                console.log("Message", msg, jsep);
                let event = msg["videoroom"];
                if(event !== undefined && event !== null){
                    if(event === "joined"){
                        this.myid = msg["id"];
                        this.mypvtid = msg["private_id"];
                        this.publishOwnFeed(true);

                        let list = msg["publishers"];
                        console.log("Joined", list);
                        let talkers = [];
                        for(var f in list) {
                            console.log("feed",f);
                            var id = list[f]["id"];
                            var display = list[f]["display"];
                            Janus.debug("  >> [" + id + "] " + display);
                            if(list[f]["talking"]) {
                                if (this.state.remoteSpeaker !== msg["id"] && this.state.remoteSpeakerTimeout + 3000 <= Date.now()) {
                                    this.setState(state => ({
                                        remoteSpeaker: msg["id"],
                                        remoteSpeakerTimeout: Date.now(),
                                        // remoteStreamURL: state.remoteList[msg["id"]],
                                        // remoteStream: state.remoteListPluginHandle[msg["id"]],
                                    }));

                                }
                            }
                            this.newRemoteFeed(id, display);
                        }



                    }
                    else if (event === "destroyed"){}
                    else if (event === "event"){
                        // console.log("event", event, msg["result"]);
                        if(msg["publishers"] !== undefined && msg["publishers"] !== null){
                            console.log("publishers", msg["publishers"]);
                            var list = msg["publishers"];
                            for(var f in list) {
                                let id = list[f]["id"]
                                let display = list[f]["display"]
                                let talking = list[f]["talking"];
                                this.newRemoteFeed(id, display);
                            }
                        }
                        else if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
                            var leaving = msg["leaving"];
                            var remoteFeed = null;
                            let numLeaving = parseInt(msg["leaving"])
                            // console.log(leaving);
                            // if(this.state.remoteList.hasOwnProperty(numLeaving)){
                            //     delete this.state.remoteList.numLeaving
                            //     this.setState({remoteList: this.state.remoteList})
                            //     this.state.remoteListPluginHandle[numLeaving].detach();
                            //     delete this.state.remoteListPluginHandle.numLeaving
                            // }
                        }
                        else if(msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
                            var unpublished = msg["unpublished"];
                            if(unpublished === 'ok') {
                                sfutest.hangup();
                                return;
                            }
                            let numLeaving = parseInt(msg["unpublished"])
                            // if(this.state.remoteList.hasOwnProperty(numLeaving)){
                            //     delete this.state.remoteList.numLeaving;
                            //     this.setState({remoteList: this.state.remoteList});
                            //     this.state.remoteListPluginHandle[numLeaving].detach();
                            //     delete this.state.remoteListPluginHandle.numLeaving
                            // }
                        } else if(msg["error"] !== undefined && msg["error"] !== null) {
                        }
                    }
                    if(event === "talking"){
                        console.log("talking", event, msg);
                        if(this.state.remoteSpeaker !== msg["id"] && this.state.remoteSpeakerTimeout + 3000 <= Date.now()){
                            this.setState(state => ({
                                remoteSpeaker: msg["id"],
                                remoteSpeakerTimeout: Date.now(),
                                // remoteStreamURL: state.remoteList[msg["id"]],
                                // remoteStream: state.remoteListPluginHandle[msg["id"]],
                            }));

                        }
                        else if(!this.state.remoteSpeaker){
                            let remotes = this.state.remoteList.reduce((v, k, i) => {
                                if(i === 0){
                                    this.setState({
                                        remoteSPeaker: v,
                                        remoteSpeakerTimeout: Date.now(),
                                    })
                                }
                            })
                        }
                    }
                }
                if(jsep !== undefined && jsep !== null){
                    // console.log("handleRemoteJsep", jsep);
                    this.videoroom.handleRemoteJsep({jsep: jsep});
                }
            },
            onlocalstream: (stream) => {
                console.log("localStream", stream);
                console.log(stream._tracks.map((track, index) => {

                    // if(track.kind === "audio"){stream._tracks[index].enabled = false}

                }));
                // console.log("muted",stream);
                this.setState({localStream: stream, localStreamURL: stream.toURL()});
            },
            onremotestream: (stream) => {
                // console.log("remoteStream", stream);
                console.log(stream._tracks.map((track, index) => {

                    // if(track.kind === "audio"){stream._tracks[index].enabled = false}
                }));
                this.setState({remoteStream: stream, remoteStreamURL: stream.toURL()})

            },
            ondataopen: (data) => {
                // console.log("dataChannel", data);
            }
        });
    }

    publishOwnFeed(useAudio){
        this.videoroom.createOffer({
            media: {audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true},
            simulcast: true,
            success: (jsep) => {
                let publish = {request: "configure", audio: useAudio, video: true};
                this.videoroom.send({message: publish, jsep: jsep});
            },
            error: (error) => {
                if(useAudio){
                    this.publishOwnFeed(false);
                }else{
                    //Publish again?
                }
            }
        })
    }

    newRemoteFeed(id, display){
        let remoteFeed = null;
        this.janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: this.state.opaqueId,
            success: (pluginHandle) => {
                remoteFeed = pluginHandle;
                // console.log("remoteFeed", remoteFeed);
                let subscribe = {request: "join", room: 2768356249109265, pin: "YO96K9", ptype: "listener", feed: id, "private_id": this.mypvtid};
                remoteFeed.videoCodec = "H264";
                remoteFeed.send({message: subscribe});
            },
            error: (error) => {
                // console.log("subscribe-error", error);
            },
            onmessage: (msg, jsep) => {
                // console.log("remote", msg, jsep);
                var event = msg["videoroom"];
                if(event !== undefined && event !== null){
                    if(event === "attached"){
                        // console.log("attached", msg);
                    }else if(event === "event"){

                    } else{}
                }
                if(jsep !== undefined && jsep !== null){
                    // console.log("newRemoteJsep", jsep);
                    remoteFeed.createAnswer({
                        jsep: jsep,
                        media: {audioSend: false, videoSend: false},
                        success: (jsep) => {
                            // console.log("newmessage-jsep", jsep);
                            let body = { request: "start", room: 2768356249109265 };
                            remoteFeed.send({message: body, jsep: jsep, success: (response) => {console.log(response)}, error: (e) => {console.log(e)}});
                        },
                        error: (error) => {
                            // console.log("createAnswerError", error);
                        }
                    });
                }

            },
            webrtcState: (on) => {console.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now")},
            onlocalstream: (stream) => {
                //nothing should happen here
            },
            onremotestream: (stream) => {
                // this.setState({info: 'One peer join!'});
                const remoteList = this.state.remoteList;
                const remoteListPluginHandle = this.state.remoteListPluginHandle;
                remoteList[id] = stream.toURL();
                remoteListPluginHandle[id] = remoteFeed;
                this.setState({
                    remoteList: remoteList,
                    remoteListPluginHandle: remoteListPluginHandle,
                });
                // console.log("stream",remoteFeed);
                // stream.getVideoTracks()[0].onmute = (event) => {
                //     stream.getVideoTracks()[0].muted = false;
                //   console.log(stream);
                // }

            },
            oncleanup: () => {
                this.setState(state => ({
                    remoteList: {...delete state.remoteList[id]},
                    remoteListPluginHandle: {...delete state.remoteListPluginHandle[id]}
                }))
            }
        })
    }



    render() {
        return(
            // (Object.entries(this.state.remoteList).length > 0) &&
            <View style={styles.container}>
                <RTCView style={styles.localVideo} streamURL={this.state.localStreamURL}/>
                {/*{this.state.remoteList && Object.keys(this.state.remoteList).map((key, index) => {*/}
                {/*    console.log("RemoteList", key)*/}
                {/*    return <RTCView key={Math.floor(Math.random() * 1000)} streamURL={this.state.remoteList[key]} style={styles.remoteVideo}/>*/}
                {/*})*/}
                {/*}*/}
                {/*<RTCView style={styles.remoteVideo} streamURL={this.state.remoteStreamURL}/>*/}

                { this.state.remoteSpeaker &&

                    <RTCView style={{...styles.remoteVideo}} streamURL={this.state.remoteList[this.state.remoteSpeaker]}/>
                }

            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        height: config.layout.window.height - 75,
        width: config.layout.window.width,
        zIndex: 0,
        position:"absolute",

    },
    localVideo: {
        flex: 1,
        height: 225,
        width: 175,
        position: "absolute",
        top:50, right:0,
    },
    remoteVideo: {
        flex:1,
        position:'absolute',
        bottom:0,
        right:0,
        height: 225,
        width: 175,
    }
});

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
        friends: state.friends,
        call: state.call,
    }
}

const mapDispatchToProps = {
    getList: Friends.getList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(WebRTC)))