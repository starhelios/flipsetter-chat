import React, {Component} from 'react';
import {withNavigationFocus} from 'react-navigation';
import {Animated, KeyboardAvoidingView, Image, Dimensions, Keyboard, Platform, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import logo from "./assets/Logo_Round.png";
import {Container, Text} from "native-base";
import {App, Auth, User} from "../reducers/actions";
import {connect} from "react-redux";
import {withSocketContext} from "./Socket";
import platform from "../native-base-theme/variables/platform";
import config from "../config";
const window = Dimensions.get('window');
export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width /6;

class Login extends Component<Props> {

    state = {
        isFocused: true,
    }

    usernameInput; passwordInput;

    constructor(props){
        super(props);

        this.keyboardHeight = new Animated.Value(0);
        this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    }

    componentDidMount(){

        if(Platform.OS === 'android'){
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
        else{
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
        }

    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {

    }

    keyboardDidShow = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height,
            }),
            Animated.timing(this.imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT_SMALL,
            }),
        ]).start();
    };

    keyboardDidHide = (event) => {
        let config = {
            duration: (event) ? event.duration : 1,
            toValue: 0,
        };
        Animated.parallel([
            Animated.timing(this.keyboardHeight, config),
            Animated.timing(this.imageHeight, {
                duration: (event) ? event.duration : 1,
                toValue: IMAGE_HEIGHT,
            }),
        ]).start();
    };



    render(){
        if(!this.props.isFocused) return(
            <Container style={{flex: 1,}}>
                <View style={{...styles.container}}>
                    <Image source={logo} style={[styles.logo]} />
                </View>
            </Container>
        );
        return(
            <Container style={{flex: 1,}}>
                <Animated.View style={{...styles.container, ...{flex:1, paddingBottom: (Platform.OS === "ios")? this.keyboardHeight:0}}} behavior={(Platform.OS === 'ios') && 'padding'} enabled onStartShouldSetResponder={() => {
                    // this.passwordInput.blur(); this.usernameInput.blur();
                    (this.usernameInput.isFocused()) ? this.usernameInput.blur() : this.passwordInput.isFocused() && this.passwordInput.blur();
                }}>
                {/*<Animated.View style={[styles.container, { paddingBottom: (Platform.OS === 'ios') ? this.keyboardHeight : 0, }]}>*/}
                    <Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight,}]} />
                    {
                        (this.props.auth.errorMsg) &&
                        <Text style={styles.error}>{this.props.auth.errorMsg}</Text>
                    }
                    <TextInput
                        value={this.props.auth.username}
                        onChangeText={(username) => this.props.setUsername(username)}
                        placeholder={'Email Address'}
                        placeholderTextColor={"#878787"}
                        keyboardType='email-address'
                        style={styles.input}
                        textContentType="username"
                        autoCapitalize='none'
                        ref={(input) => this.usernameInput = input}
                        onSubmitEditing={() => {this.passwordInput.focus();}}
                        blurOnSubmit={false}
                    />
                    <TextInput
                        value={this.props.auth.password}
                        onChangeText={(password) => this.props.setPassword(password)}
                        placeholder={'Password'}
                        placeholderTextColor={"#878787"}
                        secureTextEntry={true}
                        style={styles.input}
                        textContentType="password"
                        autoCapitalize='none'
                        ref={(input) => this.passwordInput = input}
                        onSubmitEditing={this.props.loginButton}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={styles.loginButton}
                        underlayColor='#04b600'
                        onPress={this.props.loginButton}
                    >
                        <Text>Login</Text>
                    </TouchableOpacity>

                    <Text style={styles.signup} onPress={this.props.signUp}>Sign Up</Text>
                    <Text style={styles.signup} onPress={this.props.forgot}>Forgot Password</Text>
                {/*</Animated.View>*/}
                </Animated.View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: '#FFF',
        backgroundColor: '#24422e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        textDecorationLine:'underline',
    },
    logo: {
        height: IMAGE_HEIGHT,
        resizeMode: 'contain',
        marginBottom: 20,
        padding:10,
        marginTop:20,
        // borderRadius: IMAGE_HEIGHT/2,
    },
    logoText: {

    },
    signup:{
        fontSize:15,
        marginTop:15,
        color:"#FFF"
    },
    input: {
        width: window.width - 30,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 5,
        paddingLeft:10,
        color: '#000'
    },
    loginButton: {
        height:30,
        width:100,
        borderRadius:15,
        alignItems:'center',
        justifyContent: 'center',
        color:'#000',
        backgroundColor: "#04b600",
    },

});

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
    }
}

const mapDispatchToProps = {
    setErrorMsg: App.setErrorMsg,
    setEmail: User.setEmail,
    setUsername: Auth.setUsername,
    setPassword: Auth.setPassword,
    setAccessToken: Auth.setAccessToken,
    setRefreshToken: Auth.setRefreshToken,
    setExpiry: Auth.setExpiry,
    setIsLoggedIn: Auth.setIsLoggedIn,
    login: Auth.login,

};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(Login)))