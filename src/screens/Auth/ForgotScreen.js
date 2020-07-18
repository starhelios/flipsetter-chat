import React from 'react';
import {
    Alert, Animated, Dimensions,
    Image, Keyboard,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,Vibration,
    TouchableOpacity,
    View
} from 'react-native';

import {Content, Container, Button, Text,Header, Left, Right, Body} from 'native-base';
import logo from '../../components/assets/Logo.png';
// import AuthService from "../../service/AuthService";

const window = Dimensions.get('window');
const MARGIN_TOP = window.height/10;
export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width /5;

export default class ForgotScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            msg: '',
        }
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

    _login = () => {
        Vibration.vibrate(1000);
        this.props.navigation.goBack()
    }

    reset = async() => {
        Vibration.vibrate(1000);
        if(this.state.email) {
            let response = await AuthService.reset(this.state.email);
            if(response.status){
                this.setState({msg: 'Please Check Your Email to Continue'});
            }else{
                this.setState({msg: response.errors.forms});
            }
        }
        else{
            this.setState({msg: "Enter Your Email"});
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header} transparent>
                    <Left><Text style={styles.resetText}>Back</Text></Left>
                    <Body></Body>
                    <Right></Right>
                </Header>
                <Animated.View style={[styles.contentContainer, { paddingBottom: this.keyboardHeight }]} onStartShouldSetResponder={() => this.resetInput.blur()}>
                    <Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight,}]} />

                    <Text style={styles.error}>{this.state.msg}</Text>
                    <TextInput
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        placeholder={'Email Address'}
                        placeholderTextColor={"#878787"}
                        style={styles.input}
                        ref={(input) => this.resetInput = input}
                    />
                    <TouchableOpacity
                        title={'Login'}
                        onPress={this.reset}
                        style={styles.loginButton}
                        underlayColor='#04b600'
                    ><Text style={styles.resetText}>Reset Password</Text></TouchableOpacity>
                    <Text style={[styles.resetText,{padding:10}]} onPress={this._login}>Login</Text>
                </Animated.View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d833e',

    },
    header: {
        backgroundColor: '#3d833e',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',

    },
    error: {

    },
    logo: {
        height: IMAGE_HEIGHT,
        resizeMode: 'contain',
        marginBottom: 20,
        padding:10,
        marginTop:MARGIN_TOP
    },
   
    input: {
        backgroundColor:'#FFFFFF',
        width: window.width - 30,
        height: 50,
        borderRadius: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    loginButton: {
        height:35,
        width:'50%',
        borderRadius:15,
        alignItems:'center',
        justifyContent: 'center',
        color:'#000',
        backgroundColor: "#04b600",
        // backgroundColor:'red'
    },
    resetText:{
        textAlign:'center',
        fontSize:15,
        fontWeight:'bold',
        color:'white'

    }

});
