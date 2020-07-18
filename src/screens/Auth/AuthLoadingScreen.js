import React from 'react';
import { connect } from 'react-redux';
import SplashScreen from "react-native-splash-screen";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,Image
} from 'react-native';
import { Button, Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, View} from 'native-base';
import { withSocketContext } from "../../components/Socket";
import {Auth, User} from "../../reducers/actions";
import logo from '../../components/assets/Logo.png';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
<<<<<<< HEAD
        this._bootstrapAsync();
    }

    componentDidMount(){
=======

    }

    componentDidMount(){
        setTimeout(() => {
            this._bootstrapAsync();
       }, 3000);

       SplashScreen.hide();
>>>>>>> alex-dev
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
                <View style={{flex: 1,  alignItems: 'center'}}>
                   <Image resizeMode='contain' style={{marginTop:'35%', alignSelf:'center',width:wp('50%'),height:wp('50%')}} source={logo}/>
                   <Text style={{padding:15,textAlign:'center', fontSize:22,fontWeight:'bold'}}>Collaborate</Text>
                  <View style={{bottom:0,position:'absolute',marginBottom:30,}}>
                  <View style={{flexDirection:'row',alignSelf:'center'}}>
                      <Text style={{ textAlign:'center', fontSize:17,fontWeight:'bold'}}>By</Text>
                  <Text style={{color:'green', textAlign:'center', fontSize:17,fontWeight:'bold'}}> Flip</Text>
                  <Text style={{ textAlign:'center', fontSize:17,fontWeight:'bold'}}>Setter</Text>
                  </View>
                  <Text style={{ textAlign:'center',padding:2, fontSize:15,fontWeight:'bold'}}>The door is always open!</Text>
                  </View>
                    {/* <ActivityIndicator color="#0000ff" />
                    <Text>Loading</Text> */}
                </View>
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