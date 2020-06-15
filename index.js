/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

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

