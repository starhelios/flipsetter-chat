import React, { Component } from 'react';
import {connect} from "react-redux";
import config from "../config/";
import {withSocketContext} from "./Socket";
import {withNavigationFocus, NavigationEvents} from "react-navigation";
import {RTCView} from 'react-native-webrtc';
import {AppRegistry, StyleSheet, Text, TouchableHighlight, View, SafeAreaView, TextInput, ListView, ScrollView, Dimensions, Image, Alert, TouchableOpacity} from 'react-native';
import {Container, Header} from "native-base";
import {CirclesLoader} from "react-native-indicator";
import Icon from "react-native-vector-icons/FontAwesome5";
import Janus from "./Janus";
import InCallManager from 'react-native-incall-manager';
import {Friends} from "../reducers/actions";
import Whiteboard from "./Whiteboard";

// let server = "wss://janus.flipsetter.com/janus-ws";
let server = `wss://${(config.env === "dev") ? `${config.dev.uri}` : `${config.prod.uri}`}/janus-ws`;
let ice = (config.env === "dev") ? [{urls: "stun:tippindev.com:5349", username: "ajnozari", credential: "8BrBQffgdFHoFRQDucvZ"}, {urls: "turn:tippindev.com:5349", username: "ajnozari", credential: "8BrBQffgdFHoFRQDucvZ"}] : [{urls: "turn:janus.flipsetter.com", username: "ajnozari", credential: "8BrBQffgdFHoFRQDucvZ"}];
class WebRTC extends Component<Props> {
    janus;

    state = {
        localStream: null,
        localStreamURL: null,
        remoteList: {},
        remoteListPluginHandle: {},
        remoteSpeaker: null,
        remoteSpeakerTimeout: null,
        remoteHeight: config.layout.window.height,
        remoteWidth: config.layout.window.width,
    };

    constructor(props) {
        super(props);
        console.log("WebRTC", this.props);
        InCallManager.start({media: "video"});
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.setKeepScreenOn(true);
    }

    componentDidMount(): void {
        this.janusInit();
        // this.constraints = setInterval(async() => {
        //     if(this.state.remoteSpeaker && this.state.remoteListPluginHandle[this.state.remoteSpeaker]){
        //         let video = await this.state.remoteListPluginHandle[this.state.remoteSpeaker].webrtcStuff.pc.getRemoteStreams()[0].getVideoTracks()[0];
        //         let stats = await this.state.remoteListPluginHandle[this.state.remoteSpeaker].webrtcStuff.pc.getStats(video);
        //         let remoteDimensions = {height: this.state.remoteHeight, width: this.state.remoteWidth,};
        //         // let constraints = video.getConstraints();
        //         for (let data in stats.values) {
        //             if (data.hasOwnProperty('googFrameHeightReceived')) {
        //                 remoteDimensions.height = data.googFrameHeightReceived;
        //             }
        //             if (data.hasOwnProperty('googFrameWidthReceived')) {
        //                 remoteDimensions.width = data.googFrameWidthReceived;
        //             }
        //         }
        //         if (remoteDimensions.height < remoteDimensions.width) {
        //             this.setState({
        //                 remoteHeight: config.layout.window.height,
        //                 remoteWidth: config.layout.window.width/2,
        //             })
        //         } else {
        //             this.setState({
        //                 remoteHeight: config.layout.window.height/2,
        //                 remoteWidth: config.layout.window.width,
        //             })
        //         }
        //     }
        // }, 1000)
    }

    componentWillUnmount(): void {
        // clearInterval(this.constraints);
        //Not needed on tab since screen is never unmounted

        // this.videoroom.send({"message": { "request": "unpublish" }});
        // console.log("remoteList", this.state.remoteList);
        // Object.entries(this.state.remoteList).map(({id, url}) => {
        //     // this.state.remoteListPluginHandle[id].send({"message": { "request": "unsubscribe"}})
        //     this.state.remoteListPluginHandle[id].detach();
        // });
        // this.videoroom.detach();
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

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(!this.state.remoteSpeaker && Object.keys(this.state.remoteList).length > 0){
            this.setState({
                remoteSpeaker: Object.keys(this.state.remoteList)[0],
            })
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
        // if(prevProps.isFocused !== this.props.isFocused && this.props.isFocused){
        //     InCallManager.start({media: 'video'});
        //     this.janusInit();
        // }

        // if(this.props.app.appState.match(/inactive|background/)){
        //     InCallManager.stop();
        //     this.videoroom.send({"message": { "request": "unpublish" }});
        //     this.janus.destroy();
        //
        // }
        // if(prevProps.app.appState === 'background' && this.props.app.appState.match(/active/)){
        //     InCallManager.start({media: 'video'});
        //     this.janusInit();
        // }

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
            iceServers: ice,
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
                let display = JSON.stringify({
                    name: this.props.user.first + " " + this.props.user.last,
                    id: this.props.user.id,
                    avatar: this.props.user.avatar,
                });
                let register = {request: "join", room: this.props.call.roomId, pin: this.props.call.roomPin, ptype: "publisher", display: display };
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
                        for(var f in list) {
                            console.log("feed",f);
                            var id = list[f]["id"];
                            var display = list[f]["display"];

                            if(list[f]["talking"] || !this.state.remoteSpeaker){
                                if(this.state.remoteSpeaker !== id && this.state.remoteSpeakerTimeout + 3000 <= Date.now()){
                                    this.setState({
                                        remoteSpeaker: id,
                                        remoteSpeakerTimeout: Date.now(),
                                    });
                                }
                                // this.setState(state => ({
                                //     talking:{
                                //         ...state.talking, [id]:
                                //     }
                                // }))
                            }
                            Janus.debug("  >> [" + id + "] " + display);
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
                            let numLeaving = parseInt(msg["leaving"]);
                            // console.log(leaving);
                            if(this.state.remoteList.hasOwnProperty(numLeaving)){
                                this.state.remoteListPluginHandle[numLeaving].detach();
                                let remoteList =  {...this.state.remoteList[numLeaving]};
                                let remoteListPluginHandle = {...delete this.state.remoteListPluginHandle[numLeaving]};
                                let remoteSpeaker = this.state.remoteSpeaker;
                                if(numLeaving === remoteSpeaker){
                                    remoteSpeaker = Object.keys(remoteList)[0];
                                }

                                this.setState({
                                    remoteList: remoteList,
                                    remoteListPluginHandle: remoteListPluginHandle,
                                    remoteSpeaker: remoteSpeaker,
                                    remoteSpeakerTimeout: null,
                                });
                            }
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
                // // console.log("remoteStream", stream);
                // console.log(stream._tracks.map((track, index) => {
                //
                //     // if(track.kind === "audio"){stream._tracks[index].enabled = false}
                // }));
                // this.setState({remoteStream: stream, remoteStreamURL: stream.toURL()})

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

    newRemoteFeed(id){
        let remoteFeed = null;
        this.janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: this.state.opaqueId,
            success: (pluginHandle) => {
                remoteFeed = pluginHandle;
                // console.log("remoteFeed", remoteFeed);
                let subscribe = {request: "join", room: this.props.call.roomId, pin: this.props.call.roomPin, ptype: "listener", feed: id, "private_id": this.mypvtid};
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
                            let body = { request: "start", room: this.props.call.roomId };
                            remoteFeed.send({message: body, jsep: jsep, success: (response) => {console.log(response)}, error: (e) => {console.log(e)}});
                        },
                        error: (error) => {
                            // console.log("createAnswerError", error);
                        }
                    });
                }

            },
            webrtcState: (on) => {console.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed + ") is " + (on ? "up" : "down") + " now")},
            onlocalstream: (stream) => {
                //nothing should happen here

            },
            onremotestream: (stream) => {
                // this.setState({info: 'One peer join!'});
                console.log("Something Changed", stream.getVideoTracks());
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
                let remoteList = this.state.remoteList;
                let remoteListPluginHandle = this.state.remoteListPluginHandle;
                delete remoteList[id];
                delete remoteListPluginHandle[id];
                console.log("Cleanup", {...remoteList});

                this.setState(state => ({
                    remoteList: {...remoteList},
                    remoteListPluginHandle: {...remoteListPluginHandle},
                    remoteSpeaker: Object.keys(remoteList)[0],
                    remoteSpeakerTimeout: Date.now(),
                }))
            }
        })
    }

    render() {
        if(this.props.call.type === 1){
            return(
                // (Object.entries(this.state.remoteList).length > 0) &&
                <View style={{flex: 1, backgroundColor: "#000"}}>
                    {/*{this.state.remoteList && Object.keys(this.state.remoteList).map((key, index) => {*/}
                    {/*    console.log("RemoteList", key)*/}
                    {/*    return <RTCView key={Math.floor(Math.random() * 1000)} streamURL={this.state.remoteList[key]} style={styles.remoteVideo}/>*/}
                    {/*})*/}
                    {/*}*/}

                    {   this.state.remoteSpeaker &&
                    <RTCView style={{...styles.remoteVideo, height: config.layout.window.height, width: config.layout.window.width, alignItems: "center", justifyContent: "center"}} streamURL={this.state.remoteList[this.state.remoteSpeaker]} objectFit={"contain"}/>
                    }
                    <RTCView style={{...styles.localVideo}} streamURL={this.state.localStreamURL} mirror={true}/>
                    <View style={{position: "absolute", bottom: 25,height: 100, width: config.layout.window.width, borderWidth: 1, alignItems: "center", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => this._leaveCall()} style={{backgroundColor:"red", width: 50, height: 50, borderRadius: 25,alignItems: "center", justifyContent: "center"}}>
                            <Icon name={'phone'} size={30} style={{transform: [{rotate:'-135deg'}]}}/>
                        </TouchableOpacity>
                    </View>
                </View>);
        }
        else if(this.props.call.type === 2){
            return(
                <View style={{flex: 1}}>
                    <Whiteboard
                        thread_id={this.props.call.threadId}
                        call_id={this.props.call.id}
                    />
                    {   this.state.remoteSpeaker &&
                        <RTCView style={{...styles.remoteVideoWhiteboard, height: 200, width: 100, zIndex: 10}} streamURL={this.state.remoteList[this.state.remoteSpeaker]} objectFit={"contain"}/>
                    }
                    {/*<View style={{flex: 1}}>*/}
                    {/*    /!*{this.state.remoteList && Object.keys(this.state.remoteList).map((key, index) => {*!/*/}
                    {/*    /!*    console.log("RemoteList", key)*!/*/}
                    {/*    /!*    return <RTCView key={Math.floor(Math.random() * 1000)} streamURL={this.state.remoteList[key]} style={styles.remoteVideo}/>*!/*/}
                    {/*    /!*})*!/*/}
                    {/*    /!*}*!/*/}

                    {/*    {   this.state.remoteSpeaker &&*/}
                    {/*    <RTCView style={{...styles.remoteVideo, height: this.state.remoteHeight/2, width: this.state.remoteWidth, left: config.layout.window.width/2-(this.state.remoteWidth/2),}} streamURL={this.state.remoteList[this.state.remoteSpeaker]} objectFit={"contain"}/>*/}
                    {/*    }*/}
                    {/*    <RTCView style={styles.localVideo} streamURL={this.state.localStreamURL} mirror={true}/>*/}
                    {/*    <View style={{position: "absolute", bottom: 25,height: 100, width: config.layout.window.width, borderWidth: 1, alignItems: "center", justifyContent: "center"}}>*/}
                    {/*        <TouchableOpacity onPress={() => this._leaveCall()} style={{backgroundColor:"red", width: 50, height: 50, borderRadius: 25,alignItems: "center", justifyContent: "center"}}>*/}
                    {/*            <Icon name={'phone'} size={30} style={{transform: [{rotate:'-135deg'}]}}/>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                </View>
            )
        }
    }

    _leaveCall = () => {
        console.log("END",this.props);

        this.props.navigation.navigate("Messages", {
            thread: this.props.call.threadId,
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: config.layout.window.width,
        justifyContent: 'center',
        alignItems: 'center',

    },
    localVideo: {
        height: 200,
        width:100,
        bottom:125,
        left: config.layout.window.width/2-50,
        position:"absolute",
        zIndex:1,

    },
    remoteVideo: {
        zIndex:0,
        // width: config.layout.window.width,
    },
    remoteVideoWhiteboard:{
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