import React, { Component } from 'react';
import {connect} from "react-redux";
import config from "../config/";
import {withSocketContext} from "../components/Socket";
import {withNavigationFocus} from "react-navigation";

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    SafeAreaView,
    TextInput,
    ListView,
    ScrollView,
    Dimensions,
    Image,
    Alert
} from 'react-native';
import {Container, Header} from "native-base";

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    RTCVideoView,
    MediaStreamTrack,
    getUserMedia, mediaDevices,
} from 'react-native-webrtc';
import {CirclesLoader} from "react-native-indicator";
import Icon from "react-native-vector-icons/FontAwesome5";
import Janus from "../components/Janus";
import InCallManager from 'react-native-incall-manager';
import {Friends} from "../reducers/actions";
let server = "ws://tippinweb.com:8188/janus";
let started = false;
let myroom = 2768356249109265;
let roompin = "YO96K9";
let secret = "5z3BS0vA4Ls7";
class EventsScreen extends Component<Props> {
    janus;
    state = {
        localStream: null,
        localStreamURL: null,
        remoteStream: null,
        remoteStreamURL: null,
        session: {},
        username: "",
        opaqueId: this.props.user.id,
        remoteList: {},
        remoteListPluginHandle: {},
        remoteSpeaker: null,
        remoteSpeakerTimeout: null,
    };

    constructor(props) {
        super(props);

    }

    componentDidMount(): void {
        InCallManager.start({media: 'video'});
        this.janusInit();
    }

    componentWillUnmount(): void {
        //Not needed on tab since screen is never unmounted
        // InCallManager.stop();
        // this.echotest.send({"message": { "request": "unpublish" }});
        // console.log("remoteList", this.state.remoteList);
        // Object.entries(this.state.remoteList).map(({id, url}) => {
        //     this.state.remoteListPluginHandle[id].send({"message": { "request": "unsubscribe"}})
        // });
        // this.janus.destroy();
        // this.setState(prevState => ({
        //     remoteList: {},
        //     remoteListPluginHandle: {},
        //     remoteStream: null,
        //     remoteStreamURL: null,
        //
        // }))
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {

        if(prevProps.isFocused !== this.props.isFocused && !this.props.isFocused){
            InCallManager.stop();
            // this.echotest.send({"message": { "request": "unpublish" }});
            // console.log("remoteList", this.state.remoteList);
            // Object.entries(this.state.remoteList).map(({id, url}) => {
            //     this.state.remoteListPluginHandle[id].send({"message": { "request": "leave", "feed": id}})
            // });
            this.janus.destroy();
            this.setState(prevState => ({
                remoteList: {},
                remoteListPluginHandle: {},
                remoteStream: null,
                remoteStreamURL: null,

            }))
        }
        if(prevProps.isFocused !== this.props.isFocused && this.props.isFocused){
            InCallManager.start({media: 'video'});
            this.janusInit();
        }

        if(this.props.app.appState.match(/inactive|background/)){
            InCallManager.stop();
            this.echotest.send({"message": { "request": "unpublish" }});
            this.janus.destroy();
        }
        if(prevProps.app.appState.match(/inactive|background/) && this.app.appState.match(/active/)){
            InCallManager.start({media: 'video'});
            this.janusInit();
        }

    }


    janusInit = () => {
        Janus.init({debug: "all"});
        this.janusStart();

    };

    janusStart = () => {
        this.janus = new Janus({
            server: server,
            apisecret: "Fu.WrK8@pWZ2w!E",
            iceServers: [{urls: "turn:tippindev.com:5349", username: "ajnozari", credential: "8BrBQffgdFHoFRQDucvZ"}],
            success: this.janusSuccess,
            error: (error) => {

            },
            destroyed: (destroy) => {

            },
        })
    }

    onLocalStream = (stream) => {
        console.log(stream);
        this.setState({localStream: stream.toURL()});
    }

    janusSuccess = () => {

        this.janus.attach( {
            plugin:"janus.plugin.videoroom",
            success: (pluginHandle) => {
                console.log("success", pluginHandle);
                this.echotest = pluginHandle;
                let register = {request: "join", room: myroom, pin: roompin, ptype: "publisher", display: this.props.user.first + " " + this.props.user.last };
                this.echotest.send({"message": register});
            },
            error: (error) => {console.log("attach-error", error)},
            consentDialog: (on) => {console.log("attach-consent", on)},
            mediaState: (medium, on) => {console.log("attach-mstate", medium, on)},
            webrtcState: (on) => {console.log("attach-webrtcState", on)},
            onmessage: (msg, jsep) => {

                let event = msg["videoroom"];
                if(event !== undefined && event !== null){
                    if(event === "joined"){
                        this.myid = msg["id"];
                        this.mypvtid = msg["private_id"];
                        this.publishOwnFeed(true);
                        let list = msg["publishers"];
                        console.log("Joined", list);
                        for(var f in list) {
                            var id = list[f]["id"];
                            var display = list[f]["display"];
                            Janus.debug("  >> [" + id + "] " + display);
                            this.newRemoteFeed(id, display);
                        }
                    }
                    else if (event === "destroyed"){}
                    else if (event === "event"){
                        console.log("event", event, msg["result"]);
                        if(msg["publishers"] !== undefined && msg["publishers"] !== null){
                            console.log("publishers", msg["publishers"]);
                            var list = msg["publishers"];
                            for(var f in list) {
                                let id = list[f]["id"]
                                let display = list[f]["display"]
                                this.newRemoteFeed(id, display);
                            }
                        }
                        else if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
                            var leaving = msg["leaving"];
                            var remoteFeed = null;
                            let numLeaving = parseInt(msg["leaving"])
                            console.log(leaving);
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
                        if(this.state.remoteSpeaker !== msg["id"] && this.state.remoteSpeakerTimeout + 3000 <= Date.now()){
                            this.setState(state => ({
                                remoteSpeaker: msg["id"],
                                remoteSpeakerTimeout: Date.now(),
                                remoteStreamURL: state.remoteList[msg["id"]],
                                remoteStream: state.remoteListPluginHandle[msg["id"]],
                            }));
                            // let newFeed = {request: "switch", feed: msg["id"], audio: true, video: true, data: true}
                            // this.echotest.send({message: newFeed});
                        }
                    }
                }
                if(jsep !== undefined && jsep !== null){
                    console.log("handleRemoteJsep", jsep);
                    this.echotest.handleRemoteJsep({jsep: jsep});
                }
            },
            onlocalstream: (stream) => {
                console.log("localStream", stream);
                console.log(stream._tracks.map((track, index) => {

                    // if(track.kind === "audio"){stream._tracks[index].enabled = false}

                }));
                console.log("muted",stream);
                this.setState({localStream: stream, localStreamURL: stream.toURL()});
            },
            onremotestream: (stream) => {
                console.log("remoteStream", stream);
                console.log(stream._tracks.map((track, index) => {

                    // if(track.kind === "audio"){stream._tracks[index].enabled = false}
                }));
                this.setState({remoteStream: stream, remoteStreamURL: stream.toURL()})

            },
            ondataopen: (data) => {
                console.log("dataChannel", data);
            }
        });
    }

    publishOwnFeed(useAudio){
        this.echotest.createOffer({
            media: {audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true},
            simulcast: true,
            success: (jsep) => {
                let publish = {request: "configure", audio: useAudio, video: true};
                this.echotest.send({message: publish, jsep: jsep});
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
                console.log("remoteFeed", remoteFeed);
                let subscribe = {request: "join", room: myroom, pin: roompin, ptype: "listener", feed: id, "private_id": this.mypvtid};
                remoteFeed.videoCodec = "H264";
                remoteFeed.send({message: subscribe});
            },
            error: (error) => {
                console.log("subscribe-error", error);
            },
            onmessage: (msg, jsep) => {
                console.log("remote", msg, jsep);
                var event = msg["videoroom"];
                if(event !== undefined && event !== null){
                    if(event === "attached"){
                        console.log("attached", msg);
                    }else if(event === "event"){

                    } else{}
                }
                if(jsep !== undefined && jsep !== null){
                    console.log("newRemoteJsep", jsep);
                    remoteFeed.createAnswer({
                        jsep: jsep,
                        media: {audioSend: false, videoSend: false},
                        success: (jsep) => {
                            console.log("newmessage-jsep", jsep);
                            let body = { request: "start", room: myroom };
                            remoteFeed.send({message: body, jsep: jsep, success: (response) => {console.log(response)}, error: (e) => {console.log(e)}});
                        },
                        error: (error) => {
                            console.log("createAnswerError", error);
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
                    remoteStream: remoteListPluginHandle[id],
                    remoteStreamURL: remoteList[id],
                });
                // console.log("stream",remoteFeed);
                // stream.getVideoTracks()[0].onmute = (event) => {
                //     stream.getVideoTracks()[0].muted = false;
                //     console.log(stream);
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
        <View style={styles.container}>
            {/*{this.state.remoteList && Object.keys(this.state.remoteList).map((key, index) => {*/}
            {/*    console.log("RemoteList", key)*/}
            {/*    return <RTCView key={Math.floor(Math.random() * 1000)} streamURL={this.state.remoteList[key]} style={styles.remoteVideo}/>*/}
            {/*})*/}
            {/*}*/}
            <RTCView  style={styles.remoteVideo} streamURL={this.state.remoteStreamURL}/>
            <RTCView style={styles.localVideo} streamURL={this.state.localStreamURL} mirror={true}/>
        </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: config.layout.window.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    localVideo: {
        flex: 1,
        width: config.layout.window.width,
        borderWidth:1,
    },
    remoteVideo: {
        flex: 1,
        width: config.layout.window.width,
        borderWidth:1,
        borderColor:"green",
    }
});

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
        friends: state.friends
    }
}

const mapDispatchToProps = {
    getList: Friends.getList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(EventsScreen)))