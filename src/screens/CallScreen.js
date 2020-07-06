import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar, View, SafeAreaView} from 'react-native';
import {
    Container,
    Header,
    Icon,
    Content,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Text,
    Title,
    Button,
} from 'native-base';
import { App, Call, User, Threads } from "../reducers/actions/";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";
import WebRTC from "../components/WebRTC";
import config from "../config";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import InCallManager from 'react-native-incall-manager';
import RNCallKeep, {CONSTANTS} from "react-native-callkeep";

class CallScreen extends Component<Props> {

    state = { init: false, }

    constructor(props) {
        super(props);

    }

    componentDidMount(): void {
        InCallManager.start({media: 'video'}); //Add in checks for media type later
        this.setState({
            init: true,
        })
        if(this.props.call.status !== "initiated"){
            this.props.joinCall(this.props.call.threadId);
        }
        this.props.callHeartbeat(this.props.call.threadId, this.props.call.id, "heartbeat");
        this.callHeartbeat = setInterval(() => this.props.callHeartbeat(this.props.call.threadId, this.props.call.id, "heartbeat"), 15000);
    }

    componentWillUnmount(): void {
        InCallManager.stop();
        if(this.props.call.id){
            RNCallKeep.endCall(this.props.call.id);
            this.props.leaveCall(this.props.call.threadId);
        }
        clearInterval(this.callHeartbeat);
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <StatusBar hidden/>
                <View style={styles.remoteVideo}>
                    {
                        (this.state.init) &&
                        <WebRTC/>
                    }
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content:{
        flex: 1,
        backgroundColor: "green",
    },
    remoteVideo: {
        flex: 1,

    },
})

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        call: state.call,
    }
}

const mapDispatchToProps = {
    setErrorMsg: App.setErrorMsg,
    joinCall: Call.joinCall,
    leaveCall: Call.leaveCall,
    callHeartbeat: Call.callHeartbeat,
    appHeartbeat: App.appHeartbeat,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(CallScreen))