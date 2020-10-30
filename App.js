/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Component} from 'react';

import {AppState, YellowBox, StatusBar, Linking} from 'react-native';
import {connect, Provider} from 'react-redux';
import 'react-native-gesture-handler';
import {PersistGate} from 'redux-persist/es/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {StyleProvider} from 'native-base';
import {App, Auth, User, Threads, Messages, Call} from './src/reducers/actions';

import {store, persistor} from './src/Store';
import Services from './src/components/Services';
import {default as SocketProvider} from './src/components/Socket';
import AppNavigator from './src/navigation/AppNavigator';
import NavigationService from './src/services/NavigationService';
import getTheme from './src/native-base-theme/components';
import material from './src/native-base-theme/variables/material';
import appActions from './src/reducers/actions/appActions';
import Analytics from 'appcenter-analytics';
import ShareMenu from 'react-native-share-menu';
import SplashScreen from 'react-native-splash-screen';
import RNFetchBlob from 'rn-fetch-blob';

let socket;
enableScreens();

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

class Main extends Component {
  Heartbeat;
  appState;
  state = {
    heartbeat: null,
  };

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        this.handleOpenURL(initialUrl);
      }

      Linking.addEventListener('url', (e) => this.handleOpenURL(e.url));
    } else {
      ShareMenu.getInitialShare((data) => {
        console.debug('data1', data)
        if (data) {
          NavigationService.navigate('ShareMenu', {
            data,
          });
        }

      });

      ShareMenu.addNewShareListener((data) => {
        console.debug('data2', data)
        if (data) {
          NavigationService.navigate('ShareMenu', {
            data,
          });
        }
      });
    }


    await Analytics.setEnabled(true);

    await Analytics.trackEvent('Analytics Started');

    let appState = await AppState.currentState;
    if (
      appState === 'active' &&
      (this.props.app.appState === 'inactive' ||
        this.props.app.appState === 'background' ||
        this.props.app.appState !== 'callDisplayed')
    )
      this._handleAppStateChange('active');
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.user.id && this.props.auth.isLoggedIn) {
      this.setState(
        {
          heartbeat: Date.now(),
        },
        () => this.props.appHeartbeat(),
      );
    }
    this.Heartbeat = setInterval(async () => {
      if (this.props.user.id && this.props.auth.isLoggedIn) {
        this.setState(
          {
            heartbeat: Date.now(),
          },
          () => this.props.appHeartbeat(),
        );
      }
    }, 60000);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !this.state.heartbeat &&
      this.props.user.id &&
      this.props.auth.isLoggedIn
    ) {
      this.setState(
        {
          heartbeat: Date.now(),
        },
        async (store) => this.props.appHeartbeat(),
      );
    }

    if (this.props.app.heartbeat?.status === 401) {
      this.props.setIsLoggedIn(null);
      this.props.setAccessToken('');
      this.props.setUserID('');
    }
  }

  componentWillUnmount() {
    clearInterval(this.Heartbeat);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }


  getFileStat = async (path) => {
    const res = await RNFetchBlob.fs.stat(path);
    return res;
  }

  handleOpenURL =  async (url) =>  {
    const isUrl = url.search('http');

    if (isUrl !== -1) {
      const path = url.substring(url.search('http'));

      NavigationService.navigate('ShareMenu', {
        data: {
          data: path,
          mimeType: 'text/plain'
        },
      });

      return;
    }

    const path = decodeURI(url.substring(url.search('file:///') + 7));

    try {
      const res  = await this.getFileStat(path);

      this.props.updateToUploadFilesIos({
        data: [...this.props.toUploadFilesIos.data, path],
        mimeType: mime.lookup(res.filename)
      })

      NavigationService.navigate('ShareMenu', {
        data: null,
      });
    } catch (error) {
      console.debug('handleOpenurl', error)
    }
  }


  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider socket={socket}>
            <Services />
            {/*<SafeAreaProvider>*/}
            <AppNavigator
              ref={(navigatorRef) => {
                if (navigatorRef) {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }
              }}
              onNavigationStateChange={(prevState, currentState, action) => {
                const currentRouteName = getActiveRouteName(currentState);
                const previousRouteName = getActiveRouteName(prevState);
                if (previousRouteName !== currentRouteName) {
                  // console.log(currentRouteName);
                  // console.log("__DEV__", __DEV__)
                  this._updateRoute(currentRouteName);
                }
              }}
              // appState={this.appState}
            />
            {/*</SafeAreaProvider>*/}
          </SocketProvider>
        </PersistGate>
      </StyleProvider>
    );
  }

  _handleAppStateChange = (nextAppState) => {
    this.props.setAppState(nextAppState);
    // console.log("AppState", AppState.currentState);
  };

  _updateRoute = async (route) => {
    await this.props.setRoute(route);
  };

  _heartbeat = async () => {
    return this.props.appHeartbeat();
  };
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    app: state.app,
    threads: state.threads,
    user: state.user,
    messages: state.messages,
    toUploadFilesIos: state.messages.toUploadFilesIos
  };
};

const mapDispatchToProps = {
  setErrorMsg: App.setErrorMsg,
  setAppState: App.setAppState,
  setRoute: App.setRoute,
  appHeartbeat: App.appHeartbeat,
  setAccessToken: Auth.setAccessToken,
  setIsLoggedIn: Auth.setIsLoggedIn,
  setUserID: User.setUserID,
  logout: Auth.logout,
  updateToUploadFilesIos: Messages.updateToUploadFilesIos
};

let Flipsetter = connect(mapStateToProps, mapDispatchToProps)(Main);

const MyApp = () => {
  return (
    <Provider persistor={persistor} store={store}>
      <Flipsetter />
    </Provider>
  );
};
export default MyApp;

