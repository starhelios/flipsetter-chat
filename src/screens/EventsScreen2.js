import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title } from 'native-base';
import {setErrorMsg} from "../reducers/actions/appActions";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";

class EventsScreen2 extends Component<Props> {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <StatusBar backgroundColor={"#24422e"} />
                <Header>
                    <Left></Left>
                    <Body><Title>Events</Title></Body>
                    <Right></Right>
                </Header>
                <Content>
                    <Text>
                        Events
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
    setErrorMsg,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(EventsScreen2))