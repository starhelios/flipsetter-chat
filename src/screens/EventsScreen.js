import React, { Component } from 'react';
import {connect} from "react-redux";
import config from "../config/";
import {withSocketContext} from "../components/Socket";
import {withNavigationFocus} from "react-navigation";
import {Friends, App, Call, Auth, User} from "../reducers/actions";
import {AppRegistry, StyleSheet, Text, TouchableHighlight, View, SafeAreaView, TextInput, ListView, ScrollView, Dimensions, Image, Alert} from 'react-native';
import {Container, Header} from "native-base";
import WebRTC from "../components/WebRTC";
import Whiteboard from "../components/Whiteboard";

class EventsScreen extends Component<Props> {

    constructor(props) {
        super(props);

    }

    componentDidMount(): void {

    }

    componentWillUnmount(): void {

    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {


    }

    render() {
        return(
        <View style={styles.container}>
            <Whiteboard style={styles.whiteboard} />
            <WebRTC style={styles.remoteVideo}/>
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
    whiteboard: {
        flex:1,
    },

    remoteVideo: {
        position:'absolute',
        bottom:0,
        right:0,
        height: 175,
        width: 225,
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