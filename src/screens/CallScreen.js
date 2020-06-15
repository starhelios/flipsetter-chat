import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar, View} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title } from 'native-base';
import { App, Call, User, Threads } from "../reducers/actions/";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";
import WebRTC from "../components/WebRTC";
import config from "../config";

class CallScreen extends Component<Props> {

    state = { init: false, }

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        this.setState({
            init: true,
        })
        console.log("JOIN",this.props.joinCall(this.props.call.threadId));
    }

    componentWillUnmount(): void {
        console.log("LEAVE", this.props.leaveCall(this.props.call.threadId));
    }

    render(){
        return(
            <Container style={{flex: 1}}>
                <Header>
                    <Left></Left>
                    <Body></Body>
                    <Right></Right>
                </Header>

                <View style={styles.remoteVideo}>
                    {
                        (this.state.init) &&
                        <WebRTC/>
                    }
                </View>

            </Container>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(CallScreen))