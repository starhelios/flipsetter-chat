import React from 'react';
import {
    Alert, Animated, Dimensions,
    Image, Keyboard,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput, Vibration,
    TouchableOpacity,
    View
} from 'react-native';
var Sound = require('react-native-sound');
import Toast from 'react-native-simple-toast';
import { withSocketContext } from "../../components/Socket";
import { connect } from "react-redux";
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import ActivityLoader from '../../components/ActivityLoader';
import { App, Auth, User } from "../../reducers/actions";
import { Content, Container, Button, Text, Header, Left, Right, Body } from 'native-base';
import logo from '../../components/assets/Logo.png';
// import AuthService from "../../services/AuthService";

const window = Dimensions.get('window');
const windowWidth = window.width;
const MARGIN_TOP = window.height / 10;
export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width / 5;

class ForgotScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            msg: '',
            loading: false,
            showSuccessMessage: true
        }
        this.keyboardHeight = new Animated.Value(0);
        this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
        else {
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
        this.playSound();
    }


    _login = () => {
        this.ringPhn();

        this.props.navigation.goBack()
    }

    checkEmailValid(value) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(value) === true) {
            return false
        }
        else {
            return true
        }
    }



    reset = async () => {
        this.setState({ loading: true })
        this.ringPhn();
        if (!this.state.email) {
            Toast.show('Enter Your Email', Toast.LONG);
            this.setState({loading:false, msg: "Enter Your Email" });
        }
        else if (this.checkEmailValid(this.state.email)) {
            Toast.show('Enter Valid Email', Toast.LONG);
            this.setState({loading:false, msg: "Enter valid Email" });
        }
        else {
            let response = await this.props.forgotPassword(this.state.email)
            this.setState({ loading: false })
            console.log(response, 'check the response here')
            switch (response.type) {
                case "FORGOT_SUCCESS":
                    this.setState({
                        loading:false,
                        msg: response.payload.data.message,
                        email: null,
                        showSuccessMessage: true
                    }, ()=> {
                        Toast.show(response.payload.data.message, Toast.LONG),
                        Keyboard.dismiss()
                        // this.props.navigation.goBack()
                    })
                    break;

                case "FORGOT_FAIL":
                    this.setState({
                        loading:false,
                        msg: (
                            (response?.error?.response?.data?.errors?.email && response.error.response.data.errors.email.length) ? response.error.response.data.errors.email[0] : 'Something went wrong!!') || 'Something went wrong!!'
                    }, ()=> {
                        Toast.show('Please Check Your Email Address', Toast.LONG)
                    })
                    break;

            }
        }
    }
    goBackk=()=>{
        this.ringPhn();
        this.props.navigation.goBack();
    }

    render() {
        const { showSuccessMessage } = this.state;
        return (
            <Container style={styles.container}>
                {this.state.loading ? <ActivityLoader /> : null}
                <Header style={styles.header} transparent>
                <Left><TouchableOpacity onPress={() => this.goBackk()}><Text style={styles.resetText}>Back</Text></TouchableOpacity></Left>
                    <Body></Body>
                    <Right></Right>
                </Header>
                <Animated.View style={[styles.contentContainer, { paddingBottom: this.keyboardHeight }]} onStartShouldSetResponder={() => this.resetInput.blur()}>
                    <Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight, }]} />

                    <Text style={styles.error}>{!showSuccessMessage && this.state.msg}</Text>
                    <TextInput
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email, showSuccessMessage: false, msg: '' })}
                        placeholder={'Email Address'}
                        placeholderTextColor={"#878787"}
                        style={styles.input}
                        ref={(input) => this.resetInput = input}
                    />
                    <TouchableOpacity
                        title={'Login'}
                        onPress={this.reset}
                        style={styles.loginButton}
                        underlayColor='#25422e'
                    >
                        <Text style={styles.resetText}>
                            Reset Password
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.resetText, { padding: 10 }]} onPress={this._login}>
                        Login
                    </Text>
                    {showSuccessMessage && 
                        <View style={[styles.successMessageView]}>
                            <View style={styles.checkmarkView}>
                                <Text style={[styles.successMessageText]}>
                                    Reset Link Sent 
                                </Text>
                                <Icon style={styles.checkIcon} name="checkmark-circle-outline" size={30} color="#FFFFFF" />
                            </View>
                            <Text style={[styles.successMessageText]}>
                                Your reset code has been sent. Please follow the instructions within the email to complete your password reset. 
                            </Text>
                            <Text style={[styles.successMessageText]}>
                                *Make sure to check your SPAM and JUNK folders too!
                            </Text>
                        </View>
                    }
                </Animated.View>
            </Container>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25422e',

    },
    header: {
        backgroundColor: '#25422e',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    successMessageView: {
        marginTop: 15,
        width: windowWidth - 50,
        paddingHorizontal: 30,
    },
    successMessageText: {
        marginTop: 10,
        color: '#ffffff'
    },
    error: {
        marginBottom: 10,
        color: '#FFFFFF'
    },
    logo: {
        height: IMAGE_HEIGHT,
        resizeMode: 'contain',
        marginBottom: 20,
        padding: 10,
        marginTop: MARGIN_TOP
    },
    input: {
        backgroundColor: '#FFFFFF',
        width: window.width - 30,
        height: 50,
        borderRadius: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    loginButton: {
        height: 35,
        width: '50%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        backgroundColor: "#25422e",
        // backgroundColor:'red'
    },
    resetText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'

    },
    checkIcon: {
        marginLeft: 10,
        marginTop: 3,
    },
    checkmarkView: {
        flexDirection: 'row'
    },

});


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
    }
}

const mapDispatchToProps = {
    forgotPassword: Auth.forgotPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(ForgotScreen)))
