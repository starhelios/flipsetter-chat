/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import SplashScreen from "react-native-splash-screen";
// console.disableYellowBox = true;
// (__DEV__) && SplashScreen.hide();
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
    'YellowBox.js:71 Module RNNotificationActions requires main queue setup since it overrides `init` but doesn\'t implement `requiresMainQueueSetup`. In a future release React Native will default to initializing all native modules on a background thread unless explicitly opted-out of.',
    "Require cycle:"
]);


AppRegistry.registerComponent(appName, () => App);

if(Platform.OS === "android"){
    //Used to launch call from android phone app
    AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
        // Make your call here

        return Promise.resolve();
    });

    //Used to receive Firebase messages while app is closed
    AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => {

        return Promise.resolve;
    });
}

