import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, Button } from 'native-base';
import {App, User, Auth} from "../reducers/actions";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";

class SettingsScreen extends Component<Props> {

    constructor(props) {
        super(props);
    }

    _onPress = () => {
        this.props.setIsLoggedIn(null);
        this.props.setAccessToken('');
        this.props.setUserID('');
    }

    render(){
        return(
            <Container>
                <Header style={{backgroundColor: "#24422e"}}>
                    <StatusBar backgroundColor={"#24422e"} />
                    <Left></Left>
                    <Body><Title>Settings</Title></Body>
                    <Right></Right>
                </Header>
                <Content>
                    <Button
                        onPress={() => this._onPress()}
                    >
                        <Text>Logout</Text>
                    </Button>
                </Content>
            </Container>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
    }
}

const mapDispatchToProps = {
    setAccessToken: Auth.setAccessToken,
    setIsLoggedIn: Auth.setIsLoggedIn,
    setUserID: User.setUserID,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(SettingsScreen))