import React from 'react';
import {
    Animated,
    Button, Dimensions,
    Image, Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    StatusBar,
    TouchableOpacity,
    View,
} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title} from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import logo from "../../components/assets/Logo.png";
import NativeStatusBarManager from "react-native/Libraries/Components/StatusBar/NativeStatusBarManager";
import {SafeAreaConsumer} from 'react-native-safe-area-context';
import NavigationService from "../../services/NavigationService";

const window = Dimensions.get('window');
export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width /6;

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: '',
            last: '',
            email: '',
            password: '',
            verifyPassword: '',
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


    register = () => {
        const user = this.state;
        // RegisterService.submit(user).then((response) => {
        //     let msg = '';
        //     if(response.errors){
        //         for(var k in response.errors){
        //             msg += '\n' + response.errors[k][0]
        //         }
        //         this.setState({
        //             msg: msg,
        //         })
        //     }
        //     else{
        //         this.setState({
        //             msg: "Registered, please login!",
        //         })
        //     }
        // })
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
                <Left><TouchableOpacity onPress={() => this.props.navigation.goBack()}><Text>Back</Text></TouchableOpacity></Left>
                <Body></Body>
                <Right></Right>
            </Header>
            <KeyboardAvoidingView style={[styles.container, {flex:1}]} behavior={(Platform.OS === 'ios') && 'padding'} enabled>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>Register</Text>
                    <Text>with FlipSetter</Text>
                    <Text style={styles.error}>{this.state.msg}</Text>
                </View>
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
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    placeholderTextColor={'#919191'}
                    style={styles.input}
                    textContentType={'newPassword'}
                    secureTextEntry={true}
                    ref={(input) => this.passwordInput = input}
                    onSubmitEditing={() => {this.verifyPasswordInput.focus();}}
                    blurOnSubmit={false}
                />
                <TextInput
                    value={this.state.verifyPassword}
                    onChangeText={(verifyPassword) => this.setState({ verifyPassword })}
                    placeholder={'Password'}
                    placeholderTextColor={'#919191'}
                    style={styles.input}
                    textContentType={'newPassword'}
                    secureTextEntry={true}
                    ref={(input) => this.verifyPasswordInput = input}
                    onSubmitEditing={this.register}
                    blurOnSubmit={false}
                />
                <TouchableOpacity
                    title={'Register'}
                    onPress={this.register}
                    style={styles.loginButton}
                    underlayColor='#04b600'
                >
                    <Text>Register</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3d833e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#3d833e',
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
        color:'#000',

    },
    signup:{
        fontSize:15,
        marginTop:15,
    },
    input: {
        width: 300,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        color: '#000',

    },
    loginButton: {
        height:30,
        width:100,
        borderRadius:15,
        alignItems:'center',
        justifyContent: 'center',
        color:'#000',
        backgroundColor: "#04b600",
        marginTop: 25,
    },

});
