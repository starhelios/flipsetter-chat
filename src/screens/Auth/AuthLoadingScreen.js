import React from 'react';
import { connect } from 'react-redux';
import SplashScreen from "react-native-splash-screen";

import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { Button, Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, View} from 'native-base';

import { withSocketContext } from "../../components/Socket";
import {Auth, User} from "../../reducers/actions";


class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();

    }

    componentDidMount(){

    }



    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {

        if(this.props.auth.isLoggedIn && this.props.auth.accessToken){
            this.props.navigation.navigate('Main');
        }
        else{
            this.props.navigation.navigate('Login');
        }
        // // AuthService.delete();
        // const userToken = await AuthService.get('access_token');
        //
        // // This will switch to the App screen or Auth screen and this loading
        // // screen will be unmounted and thrown away.
        // if(userToken){
        //     const {socket} = this.props;
        //     if(Object.keys(socket.socket).length === 0){
        //         let auth = await AuthService.get();
        //         let token = 'Bearer ' + auth;
        //         this.props.socket.connect(token);
        //     }
        //     this.props.navigation.navigate('Main');
        // }
        // else{
        //     this.props.navigation.navigate('Login');
        // }
        // console.log("authloading");
    };

    // Render any loading content that you like here
    render() {
        return (
            <Container style={styles.container}>
                <Body style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="#0000ff" />
                    <Text>Loading</Text>
                </Body>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F5FCFF'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        user: state.user,
    }
}

// const mapDispatchtoProps = {
//     setAccessToken: Auth.setAccessToken
// };


export default connect(mapStateToProps)(withSocketContext(AuthLoadingScreen))