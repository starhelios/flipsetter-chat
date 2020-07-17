import React from 'react';
import {Platform} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

import Login from '../../components/Login';

import {withSocketContext} from '../../components/Socket';
import {connect} from 'react-redux';

import {App, Auth, User} from '../../reducers/actions';
import SplashScreen from 'react-native-splash-screen';

// import FCM from "../../components/FCM";
// import Api from "../../service/Api";
// import DeviceService from "../../service/DeviceService";

class LoginScreen extends React.Component {
  // socket = this.props.socket;

  constructor(props) {
    super(props);
    SplashScreen.hide();
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    if (this.props.auth.isLoggedIn === true && this.props.auth.accessToken) {
      this.props.navigation.navigate('Main');
    }
  }

  loginButton = async () => {
    const email = this.props.auth.username;
    const pass = this.props.auth.password;
    const deviceId = DeviceInfo.getUniqueId();
    const deviceOS = Platform.OS;
    const deviceName = await DeviceInfo.getDeviceName();
    const deviceToken = this.props.app.device_token;

    const login = await this.props.login(
      email,
      pass,
      deviceId,
      deviceOS,
      deviceName,
      deviceToken,
    );
    console.log(login);
    switch (login.type) {
      case 'LOGIN_SUCCESS':
        // let data = login.payload.data;
        // await this.props.setAccessToken(data.access_token);
        // await this.props.setRefreshToken(data.refresh_token);
        // await this.props.setExpiry(Date.now() + data.expires_in);
        // await this.props.setEmail(this.props.auth.username);
        // await this.props.setUsername(null);
        // await this.props.setPassword(null);
        // (this.props.auth.isLoggedIn === 2) && this.props.setErrorMsg(null);
        // this.props.setIsLoggedIn(true);
        // this.props.navigation.navigate('Main');
        break;
      case 'LOGIN_FAIL':
        // this.props.setIsLoggedIn(2);
        // this.props.setErrorMsg("Please check your username and password")
        break;
    }
  };

  signUp = () => {
    this.props.navigation.navigate('Register');
  };

  forgot = () => {
    this.props.navigation.navigate('Forgot');
  };

  render() {
    if (Platform.OS === 'android') {
      return (
        <SafeAreaView style={{flex: 1}}>
          <Login
            loginButton={() => this.loginButton()}
            signUp={() => this.signUp()}
            forgot={() => this.forgot()}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <Login
          loginButton={() => this.loginButton()}
          signUp={() => this.signUp()}
          forgot={() => this.forgot()}
        />
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
    user: state.user,
  };
};

const mapDispatchToProps = {
  setErrorMsg: App.setErrorMsg,
  setEmail: User.setEmail,
  getUser: User.getUser,
  setUserID: User.setUserID,
  setUsername: Auth.setUsername,
  setPassword: Auth.setPassword,
  setAccessToken: Auth.setAccessToken,
  setRefreshToken: Auth.setRefreshToken,
  setExpiry: Auth.setExpiry,
  setIsLoggedIn: Auth.setIsLoggedIn,
  login: Auth.login,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSocketContext(withNavigationFocus(LoginScreen)));
