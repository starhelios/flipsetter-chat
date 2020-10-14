import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar,Vibration} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, Button } from 'native-base';
import {App, User, Auth} from "../reducers/actions";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";

var Sound = require('react-native-sound');

class SettingsScreen extends Component {
      _onPress = () => {

        this.ringPhn();
        this.props.setIsLoggedIn(null);
        this.props.setAccessToken('');
        this.props.setUserID('');
    }


    playSound = () => {
        var whoosh = new Sound('click.mp3', Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          // loaded successfully
          console.log(
            'duration in seconds: ' +
            whoosh.getDuration() +
            'number of channels: ' +
            whoosh.getNumberOfChannels(),
          );
          // Play the sound with an onEnd callback
          whoosh.play(success => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        });
      };

    ringPhn=()=>{
        this.playSound()
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
