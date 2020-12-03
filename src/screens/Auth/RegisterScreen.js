import React from 'react';
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Tooltips from 'react-native-tooltips'
import ActivityLoader from '../../components/ActivityLoader';
import { App, Auth, User } from "../../reducers/actions";
import { connect } from "react-redux";
import { withSocketContext } from "../../components/Socket";

import { Container, Header,  Left, Body, Right, Text} from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import { getPasswordStrength } from '../../helper';

var Sound = require('react-native-sound');
const window = Dimensions.get('window');
export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width /6;

const PASSWORD_TEXT = '*Password must be at least 8 characters long, contain one upper case letter, one lower case letter and (one number OR one special character). May NOT contain spaces.';
class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: '',
            last: '',
            email: '',
            password: '',
            verifyPassword: '',
            visible: false,
            color: '#000000'
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
        if(Platform.OS === 'android') {
            setTimeout(() => {
                this.setState({
                    inputRef: this.target,
                    parentRef: this.parent
                })
            }, 1000)
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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

    keyboardDidShow = (event) => {
        // Animated.parallel([
        //     Animated.timing(this.keyboardHeight, {
        //         duration: event.duration,
        //         toValue: event.endCoordinates.height,
        //     }),
        //     Animated.timing(this.imageHeight, {
        //         duration: event.duration,
        //         toValue: IMAGE_HEIGHT_SMALL,
        //     }),
        // ]).start();
    };

    checkEmailValid(value) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(value) === true) {
            return false
        }
        else {
            return true
        }
    }

    checkPassword=(value)=> {
    let reg = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9])|(?=\S*?[^\w*]))\S{8,}$/;
        if (reg.test(value) === true) {
            return false
        }
        else {
            return true
        }
    }

    register = async () => {
        const user = this.state;
        this.setState({ loading: true })
        this.ringPhn();

        if (this.state.first === '') {
            this.setState({ loading: false })
            Toast.show('Please enter the First Name', Toast.LONG);
        }
       else if (this.state.last === '') {
            this.setState({ loading: false })
            Toast.show('Please enter the Last Name', Toast.LONG);
        }
        else if (this.state.email === '') {
            this.setState({ loading: false })
            Toast.show('Please enter the Email Address', Toast.LONG);
        }
        else if (this.checkEmailValid(this.state.email)){
            this.setState({ loading: false })
            Toast.show('Please enter Valid Email', Toast.LONG);
        }
        else if (this.state.password === '') {
            this.setState({ loading: false })
            Toast.show('Please enter Password', Toast.LONG);
        }
        else if(this.checkPassword(this.state.password)) {
            this.setState({ loading: false })
            Toast.show('Password must be at least 8 characters long, contain one upper case letter, one lower case letter and (one number OR one special character). May NOT contain spaces', Toast.LONG);
        }
        else if (this.state.verifyPassword === '') {
            this.setState({ loading: false })
            Toast.show('Please enter Verify Password', Toast.LONG);
        }
        else if (this.state.password !== this.state.verifyPassword) {
            this.setState({ loading: false })
            Toast.show('Password not matched', Toast.LONG);
        }

        else {
            // first,last,email,pass1,pass2
            let first = this.state.first;
            let last = this.state.last;
            let email = this.state.email;
            let pass1 = this.state.password;
            let pass2 = this.state.verifyPassword;
            let response = await this.props.register(first,last,email,pass1,pass2);
            console.log("SignupRes " +JSON.stringify(response))

            switch (response.type) {
                case "REGISTER_SUCCESS":

                    // this.setState({loading:false,msg: "Please check your email address"});
                    this.setState({loading:false},()=>
                    Toast.show(response.payload.data.message, Toast.LONG),
                    this.props.navigation.goBack()
                    )
                    break;

                case "REGISTER_FAIL":

                    this.setState({loading:false},()=>
                    Toast.show('The email address has already been taken', Toast.LONG)
                    )
                    break;

            }


        }

    }
    goBackk=()=>{
        this.ringPhn();
        this.props.navigation.goBack();
    }

    onChangePassword = (password) => {
        const { status, color } = getPasswordStrength(password);
        if (status !== this.state.status) {
            Tooltips.Dismiss(this.state.inputRef);
            Tooltips.Show(
                this.state.inputRef,
                this.state.parentRef,
                {
                    position: 3,
                    text: `Password strength: ${status}`,
                    tintColor: color,
                    clickToHide: false,
                    autoHide: false
                }
            )
        }
        this.setState({
            password,
            status
        })
    }

    render() {
        
        return (
        <Container style={{flex:1}} onStartShouldSetResponder={() => {
            // this.passwordInput.blur(); this.usernameInput.blur();

            this.firstInput.isFocused() ? this.firstInput.blur() :
                this.lastInput.isFocused() ? this.lastInput.blur() :
                    this.passwordInput.isFocused() ? this.passwordInput.blur() :
                        this.emailInput.isFocused() ? this.emailInput.blur() :
                            this.passwordInput.isFocused() ? this.passwordInput.blur() :
                                this.verifyPasswordInput.isFocused() && this.verifyPasswordInput.blur()
            ;
        }}>
            <Header style={styles.header} transparent>
                <Left><TouchableOpacity onPress={() => this.goBackk()}><Text style={styles.backText}>Back</Text></TouchableOpacity></Left>
                <Body></Body>
                <Right></Right>
            </Header>
            {this.state.loading ? <ActivityLoader/> :null}
            <KeyboardAvoidingView style={[styles.container, {flex:1}]} behavior={(Platform.OS === 'ios') && 'padding'} enabled>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>Register</Text>
                    <Text style={styles.backText}>with Collaborate</Text>
                    <Text style={styles.error}>{this.state.msg}</Text>
                </View>
                <View ref={(parent) => {
                    this.parent = parent
                }}>
                <TextInput
                    value={this.state.first}
                    onChangeText={(first) => this.setState({ first })}
                    placeholder={'First Name'}
                    placeholderTextColor={'#919191'}
                    style={styles.input}
                    textContentType={'givenName'}
                    ref={(input) => this.firstInput = input}
                    onSubmitEditing={() => {this.lastInput.focus();}}
                    blurOnSubmit={false}
                />
                <TextInput
                    value={this.state.last}
                    onChangeText={(last) => this.setState({ last })}
                    placeholder={'Last Name'}
                    placeholderTextColor={'#919191'}
                    style={styles.input}
                    textContentType={'familyName'}
                    ref={(input) => this.lastInput = input}
                    onSubmitEditing={() => {this.emailInput.focus();}}
                    blurOnSubmit={false}
                />
                <TextInput
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder={'Email'}
                    placeholderTextColor={'#919191'}
                    style={styles.input}
                    autoCompleteType={'email'}
                    textContentType={'username'}
                    ref={(input) => this.emailInput = input}
                    onSubmitEditing={() => {this.passwordInput.focus();}}
                    blurOnSubmit={false}
                />
                <View collapsable={false} ref={(input) => this.target = input}>
                    <TextInput
                        value={this.state.password}
                        onChangeText={(password) => this.onChangePassword(password)}
                        placeholder={'Password'}
                        placeholderTextColor={'#919191'}
                        style={styles.input}
                        textContentType={'newPassword'}
                        secureTextEntry={true}
                        ref={(input) => this.passwordInput = input}
                        onFocus={() => this.setState({inputRef: this.target,parentRef: this.parent})}
                        onBlur={() => {
                            Tooltips.Dismiss(this.state.inputRef);
                            this.setState({status: ''});
                        }}
                        onSubmitEditing={() => { 
                            this.verifyPasswordInput.focus();
                        }}
                        blurOnSubmit={false}
                    />
                </View>
                <TextInput
                    value={this.state.verifyPassword}
                    onChangeText={(verifyPassword) => this.setState({ verifyPassword })}
                    placeholder={'Confirm Password'}
                    placeholderTextColor={'#919191'}
                    style={styles.input}
                    textContentType={'newPassword'}
                    secureTextEntry={true}
                    ref={(input) => this.verifyPasswordInput = input}
                    onSubmitEditing={this.register}
                    blurOnSubmit={false}
                />

                </View>
                <View style={styles.password}>
                    <Text style={styles.passwordText}>{PASSWORD_TEXT}</Text>
                </View>
                
                <TouchableOpacity
                    title={'Register'}
                    onPress={this.register}
                    style={styles.loginButton}
                    underlayColor='#04b600'
                >
                    <Text style={[styles.backText,{fontSize:20}]}>Register</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25422e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#25422e',
    },
    backText:{
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
    error: {
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText:{
        fontSize:25,
        marginTop:10,
        color:'#ffffff',

    },
    passwordText : {
        fontSize: 14,
        marginTop: 3,
        color: '#ffffff',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    password: {
        width: 300,
    },
    signup:{
        fontSize:15,
        marginTop:15,
    },
    input: {
        width: 300,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        textAlign:'center',
        color: '#000',

    },
    loginButton: {
        height:30,
        width:100,
        borderRadius:15,
        alignItems:'center',
        justifyContent: 'center',
        color:'#000',
        backgroundColor: "#25422e",
        marginTop: 25,
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

    register: Auth.register,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(RegisterScreen)))
