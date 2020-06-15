import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title } from 'native-base';
import { App } from "../reducers/actions/";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";

class CallScreen extends Component<Props> {

    constructor(props) {
        super(props);

    }

    render(){
        return(
            <Container>
                <StatusBar backgroundColor={"#24422e"} />
                <Content>
                    <Text>
                        Call
                    </Text>
                </Content>
            </Container>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
    }
}

const mapDispatchToProps = {
    setErrorMsg: App.setErrorMsg,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(CallScreen))